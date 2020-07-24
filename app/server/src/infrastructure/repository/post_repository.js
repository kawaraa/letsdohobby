const CustomError = require("../../domain/model/custom-error");
const Validator = require("../../my-npm/validator");
const Owner = require("../../domain/model/owner");
const Post = require("../../domain/model/post");
const Distance = require("../../domain/model/distance");

class PostRepository {
  constructor(mySqlProvider, idGenerator, config) {
    this.mySqlProvider = mySqlProvider;
    this.idGenerator = idGenerator;
    this.config = config;
  }

  async createPost(userInfo, post) {
    post.id = this.idGenerator();
    await this.mySqlProvider.query("INSERT INTO feeds.post SET ?", post);
    return this.getById(userInfo, post.id);
  }
  async getPosts(searchCriteria) {
    const { minLatitude, maxLatitude, minLongitude, maxLongitude, userId, limit, offset } = searchCriteria;
    const values = [userId, minLatitude, maxLatitude, minLongitude, maxLongitude, userId, limit, offset];
    const query = `SELECT t1.id, t1.owner, t1.activity, t1.description, t1.participants, t1.mediaUrls, t1.createdAt, t1.startAt, t1.locationLat, t1.locationLng, t2.displayName, t2.avatarUrl, (SELECT COUNT(*) FROM feeds.request WHERE receiver=t1.id AND sender=?) AS requested, (SELECT COUNT(member) FROM feeds.chat WHERE postId=t1.id) AS members FROM feeds.post t1 JOIN user.profile t2 ON t1.owner=t2.owner WHERE t1.locationLat BETWEEN ? AND ? AND t1.locationLng BETWEEN ? AND ? AND t1.id NOT IN(SELECT postId FROM feeds.chat WHERE member=? GROUP BY postId) ORDER BY t1.createdAt DESC LIMIT ? OFFSET ?`;
    const result = await this.mySqlProvider.query(query, values);
    if (!result[0]) return [];

    return result.map((post) => this.makePostObject(searchCriteria, post));
  }
  async getPostsByOwner(userInfo) {
    const query = `SELECT t1.id, t1.owner, t1.activity, t1.description, t1.participants, t1.mediaUrls, t1.createdAt, t1.startAt, t1.locationLat, t1.locationLng, t2.displayName, t2.avatarUrl, (SELECT COUNT(member) FROM feeds.chat WHERE postId=t1.id) AS members FROM feeds.post t1 JOIN user.profile t2 ON t1.owner=t2.owner WHERE t1.owner=? ORDER BY t1.createdAt DESC`;
    const result = await this.mySqlProvider.query(query, userInfo.id);
    if (!result[0]) return [];

    return result.map((post) => this.makePostObject(userInfo, post));
  }
  async getPostById(userInfo, postId) {
    const post = await this.getById(userInfo, postId);
    let query = `SELECT owner, displayName, avatarUrl FROM user.profile WHERE owner IN(SELECT member FROM feeds.chat WHERE postId=?)`;

    const result = await this.mySqlProvider.query(query, postId);
    post.members = result[0] ? result : [];
    return post;
  }
  async getPostsByMember(userInfo) {
    const query = `SELECT t1.id, t1.owner, t1.activity, t1.description, t1.participants, t1.mediaUrls, t1.createdAt, t1.startAt, t1.locationLat, t1.locationLng, t3.displayName, t3.avatarUrl, (SELECT COUNT(member) FROM feeds.chat WHERE postId=t1.id) AS members FROM feeds.post t1 JOIN feeds.chat t2 ON t1.id=t2.postId JOIN user.profile t3 ON t1.owner=t3.owner WHERE t2.member=? ORDER BY t1.createdAt DESC`;
    const result = await this.mySqlProvider.query(query, userInfo.id);
    if (!result[0]) return [];
    return result.map((post) => this.makePostObject(userInfo, post, "requested"));
  }
  async updatePost(userInfo, post, fields = "", values = []) {
    for (let key in post) {
      if (key !== "id" && key !== "owner") {
        fields += `${key}=?,`;
        values.push(post[key]);
      }
    }
    values.push(post.id);
    values.push(post.owner);
    const query = `UPDATE feeds.post SET ${fields.slice(0, -1)} WHERE id=? AND owner=?`;
    await this.mySqlProvider.query(query, values);
    return await this.getById(userInfo, post.id);
  }
  async deletePost({ id, owner } = post) {
    // 1- delete the media files of the post
    let query = "SELECT * FROM feeds.post WHERE id=? AND owner=?";
    const result = await this.mySqlProvider.query(query, [id, owner]);
    if (!result[0]) throw new CustomError("Unauthorized operation");

    await this.mySqlProvider.query("DELETE FROM feeds.notification WHERE objectId=?", id);
    await this.mySqlProvider.query("DELETE FROM feeds.request WHERE receiver=?", id);
    await this.mySqlProvider.query("DELETE FROM feeds.message WHERE chatId=?", id);
    await this.mySqlProvider.query("DELETE FROM feeds.chat WHERE postId=?", id);
    await this.mySqlProvider.query("DELETE FROM feeds.post WHERE id=? AND owner=?", [id, owner]);
  }
  async reportPost(reporter) {
    const result = await this.mySqlProvider.query(`SELECT*FROM feeds.post WHERE id=?`, reporter.itemId);
    if (!result[0]) return;
    const newItem = { itemId: reporter.itemId, table: "post", content: JSON.stringify(result[0]) };
    await this.mySqlProvider.query(`INSERT IGNORE INTO archive.report SET ?`, newItem);

    return this.mySqlProvider.query(`INSERT INTO archive.reporter SET ?`, reporter);
  }

  async getMediaUrls(id) {
    let query = `SELECT mediaUrls FROM feeds.post WHERE id=?`;
    const result = await this.mySqlProvider.query(query, [id]);
    return result[0] ? Validator.stringToArray(result[0].mediaUrls) : [];
  }

  async getById(userInfo, postId) {
    let query = `SELECT t1.id, t1.owner, t1.activity, t1.description, t1.participants, t1.mediaUrls, t1.createdAt, t1.startAt, t1.locationLat, t1.locationLng, t2.displayName, t2.avatarUrl, (SELECT COUNT(*) FROM feeds.request WHERE sender=?) AS requested, (SELECT COUNT(member) FROM feeds.chat WHERE postId=t1.id) AS members FROM feeds.post t1 JOIN user.profile t2 ON t1.owner = t2.owner WHERE t1.id=?`;
    const result = await this.mySqlProvider.query(query, [userInfo.id, postId]);
    return result[0] ? this.makePostObject(userInfo, result[0]) : null;
  }
  makePostObject({ currentLat, currentLng, unit } = userInfo, post, unWantedKey) {
    post.requested = post.requested ? true : false;
    post.owner = new Owner(post.owner, post.displayName, post.avatarUrl);
    post.distance = new Distance(currentLat, currentLng, post.locationLat, post.locationLng, unit);
    post.mediaUrls = Validator.stringToArray(post.mediaUrls);
    const p = new Post(post);
    if (unWantedKey) delete p[unWantedKey];
    return p;
  }
}

module.exports = PostRepository;

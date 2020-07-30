const CustomError = require("../../domain/model/custom-error");
const Validator = require("../../my-npm/validator");

class DeleteAccountHandler {
  constructor(mySqlProvider, storageProvider, idGenerator, config) {
    this.mySqlProvider = mySqlProvider;
    this.storageProvider = storageProvider;
    this.idGenerator = idGenerator;
    this.config = config;
  }
  async handle({ username, hashedPsw } = command) {
    let query = `SELECT * FROM user.account WHERE username=? AND hashedPsw=?`;
    const result = await this.mySqlProvider.query(query, [username, hashedPsw]);
    if (!result[0]) throw new CustomError("Incorrect password");
    await this.deleteMedia(result[0]);
    await this.deleteAccount(result[0]);
  }

  async deleteMedia(account) {
    let query = `SELECT avatarUrl FROM user.profile WHERE owner=?`;
    const avatarRes = await this.mySqlProvider.query(query, account.id);

    query = `SELECT photoUrls FROM user.profile WHERE owner=?`;
    const photoRes = await this.mySqlProvider.query(query, account.id);

    query = `SELECT mediaUrls FROM feeds.post WHERE owner=?`;
    const mediaRes = await this.mySqlProvider.query(query, account.id);

    let allMedia = mediaRes.reduce((total, item) => total + item.mediaUrls, "");

    if (avatarRes[0].avatarUrl) allMedia += avatarRes[0].avatarUrl + ",";
    if (photoRes[0].photoUrls) allMedia += photoRes[0].photoUrls;

    const allMediaUrls = Validator.stringToArray(allMedia);

    return await Promise.all(
      allMediaUrls.map(
        async (url) => await this.storageProvider.storage.file(url.replace(this.config.domain, "")).delete()
      )
    );
  }

  async deleteAccount(account) {
    await this.handleArchivingMessages(account.id);
    const postsIds = await this.handleArchivingPosts(account.id);
    await this.handleArchivingProfile(account);

    let query = `DELETE FROM feeds.request WHERE sender=? OR receiver IN(?)`;
    await this.mySqlProvider.query(query, [account.id, postsIds]);

    query = `DELETE FROM feeds.notification WHERE receiver=? OR subjectId=?`;
    await this.mySqlProvider.query(query, [account.id, account.id]);

    await this.mySqlProvider.query(`DELETE FROM feeds.message WHERE owner=?`, account.id);
    await this.mySqlProvider.query(`DELETE FROM feeds.chat WHERE member=?`, account.id);
    await this.mySqlProvider.query(`DELETE FROM feeds.post WHERE owner=?`, account.id);
    await this.mySqlProvider.query(`DELETE FROM user.settings WHERE owner=?`, account.id);
    await this.mySqlProvider.query(`DELETE FROM user.profile WHERE owner=?`, account.id);
    await this.mySqlProvider.query(`DELETE FROM user.account WHERE id=?`, account.id);
  }

  async handleArchivingMessages(owner) {
    const messages = await this.mySqlProvider.query(`SELECT * FROM feeds.message WHERE owner=?`, owner);
    if (!messages[0]) return;
    const content = JSON.stringify(messages);
    const deletedItem = { id: this.idGenerator(), table: "message", content };
    await this.mySqlProvider.query(`INSERT INTO archive.deleted SET ?`, deletedItem);
  }

  async handleArchivingPosts(owner) {
    const posts = await this.mySqlProvider.query(`SELECT * FROM feeds.post WHERE owner=?`, owner);
    if (!posts[0]) return "";
    const deletedItem = { id: this.idGenerator(), table: "post", content: JSON.stringify(posts) };
    await this.mySqlProvider.query(`INSERT INTO archive.deleted SET ?`, deletedItem);
    return posts.reduce((initial, post) => initial + post.id + ", ", "");
  }

  async handleArchivingProfile({ id, username } = account) {
    const profile = await this.mySqlProvider.query(`SELECT * FROM user.profile WHERE owner=?`, id);
    profile.username = username;
    const content = JSON.stringify(profile);
    const deletedItem = { id: this.idGenerator(), table: "message", content };
    await this.mySqlProvider.query(`INSERT INTO archive.deleted SET ?`, deletedItem);
  }
}

module.exports = DeleteAccountHandler;

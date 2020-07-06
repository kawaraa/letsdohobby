const CustomError = require("../../domain/model/custom-error");
const Validator = require("../../my-npm/validator");

class GroupRepository {
  constructor(mySqlProvider, config) {
    this.mySqlProvider = mySqlProvider;
    this.config = config;
  }

  async getGroupById(groupId) {
    let query = `SELECT id, owner, activity FROM feeds.post WHERE id=?`;
    const result = await this.mySqlProvider.query(query, groupId);
    if (!result[0]) throw new CustomError("Not found");
    query = `SELECT member AS id FROM feeds.chat WHERE postId=? GROUP BY member`;
    const members = await this.mySqlProvider.query(query, groupId);
    return { ...result[0], members };
  }

  async addNewRequest(request) {
    await this.mySqlProvider.query("INSERT INTO feeds.request set ?", request);
    return this.getGroupById(request.receiver);
  }
  async removeRequest(request) {
    const query = `DELETE FROM feeds.request WHERE receiver=? AND sender=?`;
    await this.mySqlProvider.query(query, [request.receiver, request.sender]);
    return this.getGroupById(request.receiver);
  }
  async removeRequestByMember(userInfo, notificationId) {
    let query = `SELECT t2.id, t2.owner, t1.subjectId AS requesterId, t3.displayName AS requesterName FROM feeds.notification t1 JOIN feeds.post t2 ON t1.objectId=t2.id JOIN user.profile t3 ON t1.subjectId=t3.owner WHERE t1.id=? AND t2.owner=? OR t2.id IN(SELECT postId FROM feeds.chat WHERE member=? GROUP BY t2.id)`;
    let result = await this.mySqlProvider.query(query, [notificationId, userInfo.id, userInfo.id]);
    if (!result[0]) throw new CustomError("Unauthorized operation");
    const { id, owner, requesterId, requesterName } = result[0];

    query = `SELECT member AS id FROM feeds.chat WHERE postId=?`;
    const members = await this.mySqlProvider.query(query, id);

    query = `DELETE FROM feeds.request WHERE receiver=? AND sender=?`;
    await this.mySqlProvider.query(query, [id, requesterId]);

    return { id, owner, members, requesterId, requesterName };
  }
  async addNewMember(userInfo, notificationId) {
    let query = `SELECT t2.id, t2.owner, t1.subjectId AS newMemberId, t3.displayName AS newMemberName, (SELECT COUNT(member) FROM feeds.chat WHERE postId=t2.id) AS membersNumber FROM feeds.notification t1 JOIN feeds.post t2 ON t1.objectId=t2.id JOIN user.profile t3 ON t1.subjectId=t3.owner WHERE t1.id=? AND t2.owner=? OR t2.id IN(SELECT postId FROM feeds.chat WHERE member=? GROUP BY t2.id)`;
    let result = await this.mySqlProvider.query(query, [notificationId, userInfo.id, userInfo.id]);
    if (!result[0]) throw new CustomError("Unauthorized operation");
    const { id, owner, membersNumber, newMemberId, newMemberName } = result[0];

    query = `INSERT IGNORE INTO feeds.chat SET ?`;
    await this.mySqlProvider.query(query, { postId: id, member: newMemberId, unseenMessages: 1 });
    if (membersNumber < 2) {
      await this.mySqlProvider.query(query, { postId: id, member: owner, unseenMessages: 1 });
    }

    query = `DELETE FROM feeds.request WHERE receiver=? AND sender=?`;
    await this.mySqlProvider.query(query, [id, newMemberId]);

    query = `SELECT member AS id FROM feeds.chat WHERE postId=?`;
    const members = await this.mySqlProvider.query(query, id);

    return { id, owner, members, newMemberId, newMemberName };
  }
}

module.exports = GroupRepository;

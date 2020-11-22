class NotificationRepository {
  constructor(mySqlProvider, idGenerator) {
    this.mySqlProvider = mySqlProvider;
    this.idGenerator = idGenerator;
  }

  create(notification) {
    return this.mySqlProvider.query("INSERT INTO feeds.notification SET ?", notification);
  }
  async getUnseenByOwner(owner) {
    const query = `SELECT id FROM feeds.notification WHERE receiver=? AND unseen > 0`;
    const result = await this.mySqlProvider.query(query, owner);
    return result;
  }
  async getListByOwner(owner) {
    const query = `SELECT id, text, unseen FROM feeds.notification WHERE receiver=? ORDER BY createdAt DESC`;
    const result = await this.mySqlProvider.query(query, owner);
    await this.mySqlProvider.query(`UPDATE feeds.notification SET unseen=0 WHERE receiver=?`, owner);
    return result;
  }
  async getBySubjectIdAndObjectId(subjectId, objectId) {
    const query = `SELECT id FROM feeds.notification WHERE type="join-request" AND subjectId=? AND objectId=?`;
    const result = await this.mySqlProvider.query(query, [subjectId, objectId]);
    return result;
  }
  async deleteBySubjectIdAndObjectId(subjectId, objectId) {
    const query = `DELETE FROM feeds.notification WHERE type="join-request" AND subjectId=? AND objectId=?`;
    return await this.mySqlProvider.query(query, [subjectId, objectId]);
  }
}

module.exports = NotificationRepository;

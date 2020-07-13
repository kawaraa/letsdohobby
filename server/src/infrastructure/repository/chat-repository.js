class ChatRepository {
  constructor(mySqlProvider, config) {
    this.mySqlProvider = mySqlProvider;
    this.config = config;
  }

  async createMessage(userInfo, message) {
    message.id = (Math.random() * 65445678 * Math.random()).toString();
    message.owner = userInfo.id;
    await this.mySqlProvider.query("INSERT INTO feeds.message SET ?", message);
    this.updateUnseenMessages(null, message.chatId);
    message.owner = { id: userInfo.id, name: userInfo.displayName, avatarUrl: userInfo.avatarUrl };
    return message;
  }

  async getUnseenChats(userId) {
    const query = `SELECT postId AS id FROM feeds.chat WHERE member=? AND unseenMessages > 0`;
    const result = await this.mySqlProvider.query(query, userId);
    return result;
  }
  async getChatsByMember(id) {
    let query = `SELECT t1.id, t1.activity, t1.startAt, (SELECT COUNT(member) FROM feeds.chat WHERE postId=t1.id) AS members, t2.unseenMessages FROM feeds.post t1 JOIN feeds.chat t2 ON t1.id=t2.postId WHERE t2.member=?`;
    const result = await this.mySqlProvider.query(query, id);
    return result;
  }
  async getChatMessages(userInfo, chatId) {
    let query = `SELECT id, content, type, createdAt, owner AS ownerId, (SELECT displayName FROM user.profile WHERE owner=ownerId) AS name, (SELECT avatarUrl FROM user.profile WHERE owner=ownerId) AS avatarUrl FROM feeds.message WHERE ? IN(SELECT member FROM feeds.chat WHERE postId=? GROUP BY member) AND chatId=? ORDER BY createdAt DESC`;
    const result = await this.mySqlProvider.query(query, [userInfo.id, chatId, chatId]);

    query = `UPDATE feeds.chat SET unseenMessages=0 WHERE member=? AND postId=?`;
    await this.mySqlProvider.query(query, [userInfo.id, chatId]);
    this.updateUnseenMessages(userInfo, chatId);
    return result.map((message) => {
      const { id, content, type, createdAt, ownerId, name, avatarUrl } = message;
      return { id, content, type, createdAt, owner: { id: ownerId, name, avatarUrl } };
    });
  }

  async updateUnseenMessages(userInfo, chatId) {
    let query = `UPDATE feeds.chat SET unseenMessages = unseenMessages + 1 WHERE postId = ?`;
    try {
      if (!userInfo) return await this.mySqlProvider.query(query, chatId);
      query = `UPDATE feeds.chat SET unseenMessages=0 WHERE member=? AND postId=?`;
      return await this.mySqlProvider.query(query, [userInfo.id, chatId]);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ChatRepository;

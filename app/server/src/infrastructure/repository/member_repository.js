const CustomError = require("../../domain/model/custom-error");

class MemberRepository {
  constructor(mySqlProvider, idGenerator, config) {
    this.mySqlProvider = mySqlProvider;
    this.idGenerator = idGenerator;
    this.config = config;
  }

  async getMemberBasicInfo(id) {
    let query = `SELECT owner AS id, displayName, avatarUrl FROM user.profile WHERE owner = ?`;
    const result = await this.mySqlProvider.query(query, [id]);
    if (!result[0] || !result[0].id) throw new CustomError("Not Found");
    return result[0];
  }
  async getMemberProfile(id) {
    let query = `SELECT owner as id, displayName, avatarUrl, gender, birthday, about FROM user.profile  WHERE owner = ?`;
    const result = await this.mySqlProvider.query(query, [id]);
    if (!result[0] || !result[0].id) throw new CustomError("Not Found");
    return result[0];
  }
}

module.exports = MemberRepository;

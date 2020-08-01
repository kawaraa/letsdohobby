const CustomError = require("../../domain/model/custom-error");
const Member = require("../../domain/model/member");

class MemberRepository {
  constructor(mySqlProvider) {
    this.mySqlProvider = mySqlProvider;
  }

  async getMemberProfile(id) {
    let query = `SELECT owner as id, displayName, avatarUrl, gender, birthday, about, activities FROM user.profile  WHERE owner = ?`;
    const result = await this.mySqlProvider.query(query, [id]);
    if (!result[0] || !result[0].id) throw new CustomError("Not Found");
    return new Member(result[0]);
  }
}

module.exports = MemberRepository;

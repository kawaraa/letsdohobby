const CustomError = require("../../domain/model/custom-error");
const UserInfo = require("../../domain/model/user-info");

class AccountRepository {
  constructor(mySqlProvider) {
    this.mySqlProvider = mySqlProvider;
  }

  async createAccount(account) {
    const user = await this.checkAccount(account.username);
    if (user) throw new CustomError("Username is already in used", "Signup");
    await this.mySqlProvider.query("INSERT INTO user.account SET ?", account);
    const result = await this.mySqlProvider.query("SELECT * FROM user.account WHERE username = ?", [
      account.username,
    ]);
    if (!result[0] || !result[0].id) throw new CustomError();
    return new UserInfo(result[0]);
  }

  async getAccountById(id) {
    const query = `SELECT * FROM user.account WHERE id=?`;
    const result = await this.mySqlProvider.query(query, id);
    return result[0];
  }

  async checkAccount(username, psw) {
    let query = `SELECT t1.id, t1.username, t1.confirmed, t2.displayName, t2.avatarUrl, t3.currentLat, t3.currentLng, t3.locationRange, t3.unit, t3.notifications, t3.language, t3.accountStatus FROM user.account t1 JOIN user.profile t2 ON t1.id = t2.owner JOIN user.settings t3 ON t1.id = t3.owner WHERE t1.username = ?`;

    if (psw) query += " AND t1.hashedPsw = ?";
    const result = await this.mySqlProvider.query(query, psw ? [username, psw] : [username]);
    if (!result[0] || !result[0].id) return null;
    return result[0];
  }

  async updateUsername(userInfo, command) {
    const account = await this.checkAuthorization(userInfo.username, command.hashedPsw);
    const query = `UPDATE user.account SET username=? WHERE hashedPsw=?`;
    await this.mySqlProvider.query(query, [command.username, command.hashedPsw]);
    account.username = command.username;
    return account;
  }

  async updatePassword(command) {
    const account = await this.checkAuthorization(command.username, command.hashedPsw);
    const query = `UPDATE user.account SET hashedPsw=? WHERE username=?`;
    await this.mySqlProvider.query(query, [command.newHashedPsw, account.username]);
  }

  async checkAuthorization(username, psw) {
    const user = await this.checkAccount(username, psw);
    if (!user) throw new CustomError("Unauthorized operation");
    return user;
  }
  async confirmAccount(id) {
    await this.mySqlProvider.query("UPDATE user.account SET confirmed=? WHERE id=?", [1, id]);
  }
}

module.exports = AccountRepository;

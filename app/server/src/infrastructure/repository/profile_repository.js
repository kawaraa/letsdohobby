const CustomError = require("../../domain/model/custom-error");
const Profile = require("../../domain/model/profile");

class ProfileRepository {
  constructor(mySqlProvider, idGenerator, config) {
    this.mySqlProvider = mySqlProvider;
    this.idGenerator = idGenerator;
    this.config = config;
  }

  async createProfile(profile) {
    await this.mySqlProvider.query("INSERT INTO user.profile SET ?", profile);
  }
  async getProfile(owner) {
    const result = await this.mySqlProvider.query("SELECT * FROM user.profile WHERE owner=?", [owner]);
    if (!result[0] || !result[0].owner) throw new CustomError("Not Found");
    return new Profile(result[0]);
  }
  async updateAvatar(user) {
    const query = "UPDATE user.profile SET avatarUrl=? WHERE owner=?";
    const result = this.mySqlProvider.query(query, [user.avatarUrl, user.id]);
    return result[0];
  }
  async updateAbout(profile) {
    const query = "UPDATE user.profile SET about=?  WHERE owner=?";
    await this.mySqlProvider.query(query, [profile.about, profile.owner]);
    return this.getProfile(profile.owner);
  }
  async updateFullName(profile) {
    const { owner, firstName, lastName, displayName } = profile;
    const query = `UPDATE user.profile SET firstName=?, lastName=?, displayName=? WHERE owner=?`;
    await this.mySqlProvider.query(query, [firstName, lastName, displayName, owner]);
  }
  async updateActivity(profile) {
    const { owner, activities } = profile;
    const query = `UPDATE user.profile SET activities=? WHERE owner=?`;
    await this.mySqlProvider.query(query, [activities, owner]);
    return this.getProfile(owner);
  }
  async updateStatus(id, status) {
    try {
      await this.mySqlProvider.query(`UPDATE user.profile SET status=? WHERE owner=?`, [status, id]);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = ProfileRepository;

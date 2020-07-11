const CustomError = require("../../domain/model/custom-error");
const Settings = require("../../domain/model/settings");

class SettingsRepository {
  constructor(mySqlProvider, config) {
    this.mySqlProvider = mySqlProvider;
    this.config = config;
  }

  async createSettings(settings) {
    await this.mySqlProvider.query("INSERT INTO user.settings SET ?", settings);
    return new Settings(settings);
  }
  async getSettings(owner) {
    const result = await this.mySqlProvider.query("SELECT * FROM user.settings WHERE owner=?", owner);
    return new Settings(result[0]);
  }
  async updateSettings(settings, fields = "", values = []) {
    for (let key in settings) {
      if (key !== "owner") {
        fields += `${key}=?,`;
        values.push(settings[key]);
      }
    }
    values.push(settings.owner);
    const query = `UPDATE user.settings SET ${fields.slice(0, -1)} WHERE owner=?`;
    await this.mySqlProvider.query(query, values);
    return this.getSettings(settings.owner.toString());
  }
}

module.exports = SettingsRepository;

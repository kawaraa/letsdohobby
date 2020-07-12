const CustomError = require("../model/custom-error");

class UpdateAboutCommand {
  constructor(profile) {
    this.owner = profile.owner;
    this._about = profile.about;
  }
  set _about(value) {
    if (value && typeof value !== "string") throw new CustomError("About field should be type of text");
    this.about = value;
  }
}

module.exports = UpdateAboutCommand;

const Validator = require("../../my-npm/validator");

class Member {
  constructor(profile) {
    this.id = profile.id;
    this.displayName = profile.displayName;
    this.avatarUrl = profile.avatarUrl;
    this.gender = profile.gender;
    this._birthday = profile.birthday;
    this.about = profile.about;
    this._activities = profile.activities;
    this.photoUrls = profile.photoUrls;
    this.status = profile.status;
  }

  set _birthday(value) {
    const date = new Date(value);
    this.birthday = date.toLocaleDateString("default", { month: "long", day: "numeric" });
  }
  set _activities(value) {
    this.activities = Validator.stringToArray(value);
  }
}

module.exports = Member;

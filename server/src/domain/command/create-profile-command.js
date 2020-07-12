const Validator = require("../../my-npm/validator");
const CustomError = require("../model/custom-error");

class CreateProfileCommand {
  constructor(profile) {
    this.owner = profile.owner || 0;
    this._firstName = profile.firstName;
    this._lastName = profile.lastName;
    this._displayName = profile.displayName;
    this._gender = profile.gender || "other";
    this._birthday = profile.birthday;
    this._about = profile.about || " ";
    this.activities = profile.activities || "";
    this.avatarUrl = profile.avatarUrl || "";
    this.photoUrls = profile.photoUrls || "";
    this._status = profile.status || "online";
  }

  set _firstName(value) {
    if (!Validator.isString(value, 1, 20)) throw new CustomError("Invalid input First Name");
    this.firstName = value;
  }
  set _lastName(value) {
    if (!Validator.isString(value, 4, 20)) throw new CustomError("Invalid input Last Name");
    this.lastName = value;
  }
  set _displayName(value) {
    if (Validator.isString(value, 5, 40)) return (this.displayName = value);
    this.displayName = this.firstName + " " + this.lastName;
  }
  set _gender(value) {
    if (!Validator.isString(value, 4, 6) || !/male|female|other/gim.test(value)) {
      throw new CustomError("Invalid Gender type");
    }
    return (this.gender = value);
  }
  set _birthday(value) {
    if (!Validator.isDate(value)) throw new CustomError("Invalid Date of birth");
    const birthday = new Date(value);
    const age = (Date.parse(new Date()) - Date.parse(birthday)) / (24 * 60 * 60 * 1000) / 365;
    // const age1 = ((today - birthday) / (24 * 60 * 60 * 1000)) % 7;
    if (age < 17.8) throw new CustomError("Sorry you must be at least 18 years old");
    this.birthday = `${birthday.getFullYear()}-${birthday.getMonth()}-${birthday.getDate()}`;
  }
  set _about(value) {
    console.log(value);
    if (!Validator.isString(value)) throw new CustomError("About field should be text");
    this.about = value;
  }
  set _status(value) {
    if (Validator.isString(value, 6, 7) && /online|offline/gim.test(value)) return (this.status = value);
    this.status = "offline";
  }
}

module.exports = CreateProfileCommand;

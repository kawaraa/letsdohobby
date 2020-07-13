const CustomError = require("../model/custom-error");
const Validator = require("../../my-npm/validator");

class UpdateFullNameCommand {
  constructor(profile) {
    this.owner = profile.owner;
    this._firstName = profile.firstName;
    this._lastName = profile.lastName;
    this._displayName = profile.displayName;
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
}

module.exports = UpdateFullNameCommand;

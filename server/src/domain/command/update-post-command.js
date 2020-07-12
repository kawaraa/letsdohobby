const Validator = require("../../my-npm/validator");
const CustomError = require("../model/custom-error");

class UpdatePostCommand {
  constructor(post) {
    this._id = post.id;
    this.owner = post.owner;
    this._participants = post.participants;
    this._description = post.description;
    this.startAt = UpdatePostCommand.isValidStartDate(post.todayDate, post.startAt);
    this._expireAt = this.startAt;
  }

  set _id(value) {
    if (!Validator.isString(value, 25)) throw new CustomError("Invalid input");
    this.id = value;
  }
  set _participants(value) {
    if (!Validator.isNumber(value, 0, 100)) throw new CustomError("Invalid input participants");
    this.participants = Number.parseInt(value);
  }
  set _description(value) {
    if (typeof value !== "string") throw new CustomError("Invalid input Description must be text");
    if (value.length >= 30) return (this.description = value);
    throw new CustomError("Description field must be at least 30 characters");
  }
  set _expireAt(value) {
    const date = new Date(this.startAt);
    date.setDate(date.getDate() + 2);
    this.expireAt = Validator.formatDate(date);
  }
  static isValidStartDate(todayDate, startAt) {
    if (Date.parse(todayDate) >= Date.parse(startAt)) {
      throw new CustomError("Invalid input start Date or Time");
    }
    return Validator.formatDate(startAt);
  }
}

module.exports = UpdatePostCommand;

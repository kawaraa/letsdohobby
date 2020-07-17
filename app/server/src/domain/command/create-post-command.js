const Validator = require("../../my-npm/validator");
const CustomError = require("../model/custom-error");

class CreatePostCommand {
  constructor(post) {
    this.id = post.id;
    this.owner = post.owner;
    this._activity = post.activity;
    this._participants = post.participants || 0;
    this._description = post.description;
    this.mediaUrls = post.mediaUrls || "";
    this.locationLat = post.locationLat;
    this.locationLng = post.locationLng;
    this._createdAt = post.createdAt;
    this._startAt = post.startAt;
    this._expireAt = this.startAt;
  }

  set _activity(value) {
    if (!Validator.isActivity(value)) throw new CustomError("Invalid input Activity");
    this.activity = value;
  }
  set _participants(value) {
    if (!Validator.isNumber(value, 0, 100)) throw new CustomError("Invalid participants");
    this.participants = Number.parseInt(value);
  }
  set _description(value) {
    if (typeof value !== "string") throw new CustomError("Invalid input Description field must be text");
    if (value.length >= 30) return (this.description = value);
    throw new CustomError("Description field must be at least 30 characters");
  }
  set _createdAt(value) {
    if (!Validator.isDate(value)) throw CustomError("Invalid input creation date");
    this.createdAt = Validator.formatDate(value);
  }
  set _startAt(value) {
    if (Date.parse(this.createdAt) < Date.parse(value)) return (this.startAt = Validator.formatDate(value));
    throw new CustomError("Invalid input start Date or Time");
  }
  set _expireAt(value) {
    const date = new Date(this.startAt);
    date.setDate(date.getDate() + 2);
    this.expireAt = Validator.formatDate(date);
  }
}

module.exports = CreatePostCommand;

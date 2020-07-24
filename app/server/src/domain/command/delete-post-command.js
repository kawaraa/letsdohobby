const CustomError = require("../model/custom-error");

class DeletePostCommand {
  constructor(post) {
    this._id = post.id;
    this._owner = post.owner;
  }

  set _id(value) {
    if (typeof value !== "string") throw new CustomError("Invalid input Post ID");
    this.id = value;
  }
  set _owner(value) {
    if (typeof value === "string" || typeof value === "number") return (this.owner = value);
    throw new CustomError("Invalid input Post Owner");
  }
}

module.exports = DeletePostCommand;

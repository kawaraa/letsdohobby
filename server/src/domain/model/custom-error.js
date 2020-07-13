"use strict";

class CustomError extends Error {
  constructor(message, name = "General") {
    super(message ? message + "(!)" : "Something went wrong, Please try again(!)");
    this.name = name + "Error";
  }

  static validate(error) {
    return /\([!]+\)/i.test(error.message) ? error : new CustomError();
  }
  static toJson(error) {
    if (!error) return JSON.stringify({ message: new CustomError().message });
    return JSON.stringify({ message: CustomError.validate(error).message });
  }
}
module.exports = CustomError;

const CustomError = require("../model/custom-error");

class UpdateAccountCommand {
  constructor(profile) {
    this._username = profile.username;
    this.hashedPsw = profile.psw || "";
    this.newHashedPsw = profile.newPsw || "";
  }
  set _username(value) {
    if (!value) throw new CustomError("username is required field");
    const isEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w[a-zA-Z]{2,5})+$/.test(value);
    const isPhoneNumber = !Number.isNaN(Number.parseInt(value));
    // const isPhoneNumber = /^[+|0][\s/0-9]*$/.test(value);
    if (!isEmail && !isPhoneNumber) throw new CustomError("Invalid input username");
    this.username = value.toLowerCase();
  }
}

module.exports = UpdateAccountCommand;

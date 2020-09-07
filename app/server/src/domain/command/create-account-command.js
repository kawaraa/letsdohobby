const CustomError = require("../model/custom-error");

class CreateAccountCommand {
  constructor(account) {
    this.id = account.id || 0;
    this._username = account.username;
    this._hashedPsw = account.psw;
    this.confirmed = 0;
  }
  set _username(value) {
    if (!value) throw new CustomError("username is required field");
    const isEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w[a-zA-Z]{1,5})+$/.test(value);
    const isPhoneNumber = !Number.isNaN(Number.parseInt(value));
    // const isPhoneNumber = /^[+|0][\s/0-9]*$/.test(value);
    if (!isEmail && !isPhoneNumber) throw new CustomError("Invalid input username");
    this.username = value.toLowerCase();
  }
  set _hashedPsw(value) {
    if (!value) throw new CustomError("Password is required field");
    if (typeof value !== "string") value += "";
    if (value.length < 10) throw new CustomError("Password must be at least 10 Characters / Numbers");
    this.hashedPsw = value;
  }
}

module.exports = CreateAccountCommand;

const CustomError = require("../model/custom-error");
const Validator = require("../../my-npm/validator");

class UpdateAboutCommand {
  constructor(profile) {
    this.owner = profile.owner;
    this._activities = profile.activities;
  }
  set _activities(value) {
    const result = Validator.areActivities(value);
    if (result.valid) return (this.activities = value.reduce((init, a) => init + a + ",", ""));
    const Invalid = result.invalid.reduce((initials, inAct) => initials + inAct + ", ", " ");
    throw new CustomError("Invalid input activities " + Invalid);
  }
}

module.exports = UpdateAboutCommand;

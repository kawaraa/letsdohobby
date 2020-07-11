const Validator = require("../../my-npm/validator");
const CustomError = require("../model/custom-error");

class UpdateSettingsCommand {
  constructor(settings) {
    this.owner = settings.owner;
    this.setCurrentLat(settings.currentLat);
    this.setCurrentLng(settings.currentLng);
    this.setRange(settings.locationRange);
    this.setUnit(settings.unit);
    this.setLanguage(settings.language);
    this.setAccountStatus(settings.accountStatus);
  }
  setCurrentLat(value) {
    if (Validator.isNumber(value, -90, 90)) this.currentLat = Validator.parseLatitude(value);
  }
  setCurrentLng(value) {
    if (Validator.isNumber(value, -180, 180)) this.currentLng = Validator.parseLongitude(value);
  }
  setRange(value) {
    if (Validator.isNumber(value, 5, 161)) this.locationRange = Number.parseInt(value);
  }
  setUnit(value) {
    if (Validator.isString(value, 1, 2) && /km|mi/gim.test(value)) this.unit = value;
  }
  setLanguage(value) {
    if (Validator.isString(value, 2, 2) && /en|ar/gim.test(value)) this.language = value;
  }
  setAccountStatus(value) {
    if (Validator.isNumber(value, 0, 2)) this.accountStatus = value;
  }
}

module.exports = UpdateSettingsCommand;

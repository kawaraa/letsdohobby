const { hobbies } = require("../../config/config.json");

class Validator {
  static isString(str, minLength, maxLength) {
    let valid = true;
    if (!str || typeof str !== "string") return false;
    if (!Number.isNaN(Number.parseInt(minLength))) valid = str.length >= minLength;
    if (!Number.isNaN(Number.parseInt(maxLength))) valid = str.length <= maxLength;
    return valid;
  }
  static stringToArray(string) {
    string = string.replace(/\s/g, "");
    if (string.slice(-1) === ",") string = string.slice(0, string.length - 1);
    return string ? string.split(",") : [];
  }
  static isNumber(num, min, max) {
    const N = Number.parseFloat(num);
    if (!Number.isNaN(N) && !max) return true;
    return !Number.isNaN(N) && N >= min && N <= max ? true : false;
  }
  static isDate(date) {
    return new Date(date).toString() !== "Invalid Date";
  }
  static formatDate(date) {
    if (typeof date === "string") date.replace(".000Z", "");
    let d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
  }
  static parseLatitude(latitude) {
    return Number.parseFloat(Number.parseFloat(latitude).toPrecision(10));
  }
  static parseLongitude(longitude) {
    return Number.parseFloat(Number.parseFloat(longitude).toPrecision(11));
  }
  static isActivity(activity) {
    if (!Validator.isString(activity)) return false;
    if (hobbies.find((hobby) => hobby.toLowerCase() === activity.toLowerCase())) return true;
    return false;
  }
  static areActivities(activities, result = { valid: false, valid: [], invalid: [] }) {
    if (!activities || typeof activities !== "array") return result;
    for (let hobby in hobbies) {
      const activity = activities.find((act) => act.toLowerCase() === hobby.toLowerCase());
      if (activity) valid.push(activity);
      if (valid.length === activities.length) {
        result.valid = true;
        return result;
      }
    }
    result.invalid = activities.filer((a) => valid.find((v) => v.toLowerCase() !== a.toLowerCase()));
    return result;
  }
}
module.exports = Validator;

const Validator = require("../../my-npm/validator");
const CustomError = require("./custom-error");

class Dimensions {
  constructor(dimensions) {
    this._x = dimensions.x;
    this._width = dimensions.width;
    this._y = dimensions.y;
    this._height = dimensions.height;
    this.sameSize = dimensions.sameSize && dimensions.sameSize === "true";
  }
  set _x(value) {
    if (!Validator.isNumber(value)) throw new CustomError("Invalid input X in dimensions");
    this.x = Number.parseInt(value);
  }
  get _x() {
    return this.x;
  }
  set _width(value) {
    if (!Validator.isNumber(value)) throw new CustomError("Invalid input Width in dimensions");
    this.width = Number.parseInt(value);
  }
  get _width() {
    return this.width;
  }
  set _y(value) {
    if (!Validator.isNumber(value)) throw new CustomError("Invalid input Y in dimensions");
    this.y = Number.parseInt(value);
  }
  get _y() {
    return this.y;
  }
  set _height(value) {
    if (!Validator.isNumber(value)) throw new CustomError("Invalid input Height in dimensions");
    this.height = Number.parseInt(value);
  }
  get _height() {
    return this.height;
  }
}

module.exports = Dimensions;

const CustomError = require("../model/custom-error");
class SearchCriteria {
  constructor(user) {
    this.userId = user.id;
    this.unit = user.unit;
    this._locationRange = user.locationRange;
    this.minLatitude = 0;
    this.maxLatitude = 0;
    this.minLongitude = 0;
    this.maxLongitude = 0;
    this._currentLat = user.currentLat;
    this._currentLng = user.currentLng;
    this._limit = user.limit; // Limit per page
    this._offset = user.offset; // the start of the limit
  }

  set _locationRange(value) {
    // 0.000 => 130km, 13km, 1.3km, 130m
    // 1.5 = 200km, 0.040 = 5km
    this.locationRange = Number.parseFloat((Number.parseFloat(value) / 130).toPrecision(2));
  }

  set _currentLat(value) {
    this.currentLat = Number.parseFloat(value);
    let minLatitude = 0;
    let maxLatitude = 0;

    if (this.currentLat < 0) minLatitude = this.currentLat + this.locationRange;
    if (this.currentLat >= 0) minLatitude = this.currentLat - this.locationRange;
    if (this.currentLat < 0) maxLatitude = this.currentLat - this.locationRange;
    if (this.currentLat >= 0) maxLatitude = this.currentLat + this.locationRange;
    if (maxLatitude > 90) maxLatitude = maxLatitude - 90 - 90;
    if (maxLatitude < -90) maxLatitude = 90 + (maxLatitude + 90);

    maxLatitude = Number.parseFloat(Number.parseFloat(maxLatitude).toPrecision(10));
    minLatitude = Number.parseFloat(Number.parseFloat(minLatitude).toPrecision(10));
    this.maxLatitude = maxLatitude;
    this.minLatitude = minLatitude;
    if (maxLatitude < minLatitude) {
      this.maxLatitude = minLatitude;
      this.minLatitude = maxLatitude;
    }
  }

  set _currentLng(value) {
    this.currentLng = Number.parseFloat(value);
    if (!this.currentLat && !this.currentLng) {
      throw new CustomError("Location is required in order to find activities around you");
    }
    let minLongitude = 0;
    let maxLongitude = 0;

    if (this.currentLng < 0) minLongitude = this.currentLng + this.locationRange;
    if (this.currentLng >= 0) minLongitude = this.currentLng - this.locationRange;
    if (this.currentLng < 0) maxLongitude = this.currentLng - this.locationRange;
    if (this.currentLng >= 0) maxLongitude = this.currentLng + this.locationRange;
    if (maxLongitude > 180) maxLongitude = maxLongitude - 180 - 180;
    if (maxLongitude < -180) maxLongitude = 180 + (maxLongitude + 180);

    maxLongitude = Number.parseFloat(Number.parseFloat(maxLongitude).toPrecision(10));
    minLongitude = Number.parseFloat(Number.parseFloat(minLongitude).toPrecision(10));
    this.maxLongitude = maxLongitude;
    this.minLongitude = minLongitude;
    if (maxLongitude < minLongitude) {
      this.maxLongitude = minLongitude;
      this.minLongitude = maxLongitude;
    }
  }
  set _offset(value) {
    const number = Number.parseInt(value);
    this.offset = typeof number === "number" ? number : 0;
  }
  set _limit(value) {
    const number = Number.parseInt(value);
    this.limit = typeof number === "number" ? number : 20;
  }
}
module.exports = SearchCriteria;

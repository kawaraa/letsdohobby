class Distance {
  constructor(userLat, userLng, lat2, lng2, unit = "km") {
    this.unit = unit;
    this.length = Distance.calculateDistance(userLat, userLng, lat2, lng2, unit);
  }

  static calculateDistance(lat1, lng1, lat2, lng2, unit) {
    // if unit km the radius will be 6371 km otherwise 3958.8 miles, default Kilometers
    const radiusOfTheEarth = unit.toLowerCase() === "m" ? 3958.8 : 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = radiusOfTheEarth * c;
    if (distance > 1) return Number.parseFloat(distance.toPrecision(3));
    if (distance <= 1) return Number.parseFloat("0." + Math.round(distance * 1000));
  }
}

module.exports = Distance;

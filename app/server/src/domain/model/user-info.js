class UserInfo {
  constructor(user) {
    this.id = user.id;
    this.username = user.username;
    this.displayName = user.displayName;
    this.avatarUrl = user.avatarUrl;
    this.currentLat = user.currentLat;
    this.currentLng = user.currentLng;
    this.locationRange = user.locationRange;
    this.unit = user.unit;
    this.notifications = user.notifications;
    this.language = user.language;
    this.accountStatus = user.accountStatus;
  }
}

module.exports = UserInfo;

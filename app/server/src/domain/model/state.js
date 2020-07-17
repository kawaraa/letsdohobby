class UserInfo {
  constructor(user) {
    this.id = user.id;
    this.username = user.username;
    this.displayName = user.displayName;
    this.avatarUrl = user.avatarUrl;
    this.accountStatus = user.accountStatus;
    this.state = { messages: 0, notifications: 0 };
  }
}

module.exports = UserInfo;

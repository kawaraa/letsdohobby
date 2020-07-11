class MemberProfile {
  constructor(account) {
    this.id = account.id || "";
    this.email = account.email || "";
    this.firstName = account.profile.firstName || "";
    this.lastName = account.profile.lastName || "";
    this.initials = account.profile.initials || "";
    this.sex = account.profile.sex || "";
    this.about = account.profile.about || "";
    this.avatarUrl = account.profile.avatarUrl || "";
    this.dateOfBirth = account.profile.dateOfBirth || "";
  }
}

module.exports = MemberProfile;

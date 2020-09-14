class Settings {
  constructor(settings) {
    this.locationRange = settings.locationRange;
    this.unit = settings.unit;
    this.notifications = settings.notifications;
    this.language = settings.language;
  }
}

module.exports = Settings;

class CreateSettingsCommand {
  constructor() {
    this.owner = 0;
    this.currentLat = 0;
    this.currentLng = 0;
    this.locationRange = 161;
    this.unit = "km";
    this.language = "en";
    this.accountStatus = 0;
  }
}

module.exports = CreateSettingsCommand;
/*
setOwner(value) {
  if (Number.isNaN(Number.parseInt(value))) throw new CustomError("Invalid Owner", "Validation");
  this.owner = Number.parseInt(value);
}
if (!SearchCriteria.isValidNumber(value, -90, 90)) {
  throw new CustomError("Invalid Location latitude", "Location");
}
throw new CustomError("Location Range is required in order to find activities around you", "Location");
*/

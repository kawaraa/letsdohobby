const UserInfo = require("../../domain/model/user-info");
const UpdateAccountCommand = require("../../domain/command/update-account-command");
const UpdateSettingsCommand = require("../../domain/command/update-settings-command");
const UpdateFullNameCommand = require("../../domain/command/update-full-name-command");
const UpdateAboutCommand = require("../../domain/command/update-about-command");
const UpdateActivitiesCommand = require("../../domain/command/update-activities-command");
const CustomError = require("../../domain/model/custom-error");

class UserResolver {
  constructor(server, firewall, accountRepo, profileRepo, settingsRepo, deleteAccountHandler) {
    this.server = server;
    this.firewall = firewall;
    this.accountRepository = accountRepo;
    this.profileRepository = profileRepo;
    this.settingsRepository = settingsRepo;
    this.deleteAccountHandler = deleteAccountHandler;
  }

  resolve() {
    this.server.use("/user", this.firewall.authRequired);
    this.server.use("/user/state", this.onCheckState.bind(this));
    this.server.post("/user/username", this.updateUsername.bind(this));
    this.server.post("/user/psw", this.updatePassword.bind(this));
    this.server.post("/user", this.deleteAccount.bind(this));
    this.server.get("/user/profile", this.getProfile.bind(this));
    this.server.post("/user/profile/full-name", this.updateFullName.bind(this));
    this.server.post("/user/profile/about", this.updateAbout.bind(this));
    this.server.put("/user/profile/activity", this.updateActivities.bind(this));
    this.server.put("/user/settings", this.updateSettings.bind(this));
    this.server.get("/user/settings", this.getSettings.bind(this));
  }

  async onCheckState(request, response) {
    response.json(request.user);
  }
  async updateUsername(request, response) {
    try {
      const command = new UpdateAccountCommand(request.body);
      const account = await this.accountRepository.updateUsername(request.user, command);
      request.user.username = account.username;
      this.firewall.updateToken(request.user, response);
      response.json(request.user);
    } catch (error) {
      console.log(error);
      response.status(500).end(CustomError.toJson(error));
    }
  }
  async updatePassword(request, response) {
    try {
      request.body.username = request.user.username;
      await this.accountRepository.updatePassword(new UpdateAccountCommand(request.body));
      response.json({ success: true });
    } catch (error) {
      console.log(error);
      response.status(500).end(CustomError.toJson(error));
    }
  }
  async deleteAccount(request, response) {
    try {
      request.body.username = request.user.username;
      console.log(request.body);
      await this.deleteAccountHandler.handleDeleteAccount(new UpdateAccountCommand(request.body));
      response.clearCookie("userToken");
      response.json({ success: true });
    } catch (error) {
      console.log(error);
      response.status(500).end(CustomError.toJson(error));
    }
  }
  async getProfile(request, response) {
    try {
      const profile = await this.profileRepository.getProfile(request.user.id);
      response.json(profile);
    } catch (error) {
      response.status(500).end(CustomError.toJson(error));
    }
  }
  async updateFullName(request, response) {
    try {
      request.body.owner = request.user.id;
      const command = new UpdateFullNameCommand({ ...request.body });
      await this.profileRepository.updateFullName(command);
      request.user.displayName = command.displayName;
      this.firewall.updateToken(request.user, response);
      response.json(request.user);
    } catch (error) {
      response.status(500).end(CustomError.toJson(error));
    }
  }
  async updateAbout(request, response) {
    try {
      request.body.owner = request.user.id;
      const command = new UpdateAboutCommand({ ...request.body });
      const profile = await this.profileRepository.updateAbout(command);
      response.json(profile);
    } catch (error) {
      response.status(500).end(CustomError.toJson(error));
    }
  }
  async updateActivities(request, response) {
    try {
      const command = new UpdateActivitiesCommand({ owner: request.user.id, activities: request.body });
      const profile = await this.profileRepository.updateActivity(command);
      response.json(profile);
    } catch (error) {
      response.status(500).end(CustomError.toJson(error));
    }
  }
  async updateSettings(request, response) {
    try {
      request.body.owner = request.user.id;
      const command = new UpdateSettingsCommand({ ...request.body });
      const isLat = request.body.currentLat && request.user.currentLat !== request.body.currentLat;
      const isLng = request.body.currentLng && request.user.currentLng !== request.body.currentLng;
      if (isLat || isLng) command.setAccountStatus(1);
      const settings = await this.settingsRepository.updateSettings(command);
      await this.firewall.updateToken(new UserInfo({ ...request.user, ...command }), response);
      response.json({ settings });
    } catch (error) {
      console.log(error);
      response.status(500).end(CustomError.toJson(error));
    }
  }
  async getSettings(request, response) {
    try {
      const settings = await this.settingsRepository.getSettings(request.user.id.toString());
      response.json(settings);
    } catch (error) {
      response.status(500).end(CustomError.toJson(error));
    }
  }
}

module.exports = UserResolver;

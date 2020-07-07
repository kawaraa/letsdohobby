"use strict";
const CustomError = require("../../domain/model/custom-error");
const CreateAccountCommand = require("../../domain/command/create-account-command");
const CreateProfileCommand = require("../../domain/command/create-profile-command");
const CreateSettingsCommand = require("../../domain/command/create-settings-command");

class AuthResolver {
  constructor(server, firewall, accountRepository, profileRepository, settingsRepository, config) {
    this.server = server;
    this.firewall = firewall;
    this.accountRepository = accountRepository;
    this.profileRepository = profileRepository;
    this.settingsRepository = settingsRepository;
    this.config = config;
  }

  resolve() {
    this.server.post("/signup", this.onSignup.bind(this));
    this.server.post("/login", this.onLogin.bind(this));
    this.server.use("/logout", this.onLogout.bind(this));
  }
  async onSignup(request, response) {
    try {
      const settings = new CreateSettingsCommand();
      const profile = new CreateProfileCommand({ ...request.body });
      const account = await this.accountRepository.createAccount(
        new CreateAccountCommand({ id: 0, ...request.body })
      );
      settings.owner = account.id;
      profile.owner = account.id;
      await this.profileRepository.createProfile(profile);
      await this.settingsRepository.createSettings(settings);

      const user = await this.accountRepository.checkAccount(account.username, account.hashedPsw);
      const token = this.firewall.createToken(user);
      if (!token) return response.status(500).end(CustomError.toJson());
      response.cookie("userToken", token, this.config.cookieOption);
      response.json(user);
    } catch (error) {
      console.error("MyError: ", error);
      response.clearCookie("userToken");
      response.status(400).end(CustomError.toJson(error));
    }
  }
  async onLogin(request, response) {
    console.log("Login requested ");
    try {
      const account = new CreateAccountCommand(request.body);
      const user = await this.accountRepository.checkAccount(account.username, account.hashedPsw);
      if (!user) throw new CustomError("Incorrect combination of Username / Password");

      const token = this.firewall.createToken(user);
      if (!token) return response.status(500).end(CustomError.toJson());
      response.cookie("userToken", token, this.config.cookieOption);
      response.json(user);
    } catch (error) {
      console.error("MyError: ", error);
      response.clearCookie("userToken");
      response.status(400).end(CustomError.toJson(error));
    }
  }
  onLogout(request, response) {
    response.clearCookie("userToken");
    response.redirect("/");
  }
}

module.exports = AuthResolver;

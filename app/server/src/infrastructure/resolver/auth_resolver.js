"use strict";
const CustomError = require("../../domain/model/custom-error");
const CreateAccountCommand = require("../../domain/command/create-account-command");
const CreateProfileCommand = require("../../domain/command/create-profile-command");
const CreateSettingsCommand = require("../../domain/command/create-settings-command");

class AuthResolver {
  constructor(server, firewall, accountRepo, profileRepo, settingsRepo, mailHandler) {
    this.server = server;
    this.firewall = firewall;
    this.accountRepository = accountRepo;
    this.profileRepository = profileRepo;
    this.settingsRepository = settingsRepo;
    this.mailHandler = mailHandler;
    this.config = env.authResolver;
  }

  resolve() {
    this.server.post("/signup", this.onSignup.bind(this));
    this.server.post("/login", this.onLogin.bind(this));
    this.server.use("/log-me-out", this.onLogout.bind(this));
  }
  async onSignup(request, response) {
    try {
      const settings = new CreateSettingsCommand();
      const profile = new CreateProfileCommand({ ...request.body });
      const createAccountCommand = new CreateAccountCommand({ id: 0, ...request.body });

      const account = await this.accountRepository.createAccount(createAccountCommand);
      settings.owner = account.id;
      profile.owner = account.id;
      await this.profileRepository.createProfile(profile);
      await this.settingsRepository.createSettings(settings);

      const user = await this.accountRepository.checkAccount(account.username, account.hashedPsw);
      const token = this.firewall.createToken({ id: user.id });
      if (!token) return response.status(500).end(CustomError.toJson());

      const result = await this.mailHandler.sendConfirmationLink(user, token); // Comment this for dev mode
      response.json({ success: true });
    } catch (error) {
      response.clearCookie("userToken");
      response.status(400).end(CustomError.toJson(error));
      console.log(error);
    }
  }
  async onLogin(request, response) {
    try {
      const account = new CreateAccountCommand(request.body);
      const user = await this.accountRepository.checkAccount(account.username, account.hashedPsw);
      if (!user) throw new CustomError("Incorrect combination of Username / Password");
      if (user.confirmed < 1) {
        const token = await this.firewall.createToken({ id: user.id });
        const info = await this.mailHandler.sendConfirmationLink(user, token);
        const username = Number.isNaN(Number.parseInt(user.username)) ? "Email" : "Phone Number";
        throw new CustomError(`Please confirm your ${username} to login`);
      }
      const token = await this.firewall.createToken(user);
      if (!token) return response.status(500).end(CustomError.toJson());
      response.cookie("userToken", token, this.config.cookieOption);
      response.json(user);
    } catch (error) {
      response.clearCookie("userToken");
      response.status(400).end(CustomError.toJson(error));
      console.log(error);
    }
  }
  onLogout(request, response) {
    response.clearCookie("userToken");
    response.redirect("/");
  }
}

module.exports = AuthResolver;

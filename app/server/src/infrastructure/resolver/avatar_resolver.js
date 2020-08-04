const CustomError = require("../../domain/model/custom-error");

class AvatarResolver {
  constructor(server, firewall, profileRepository, createAvatarHandler) {
    this.server = server;
    this.firewall = firewall;
    this.profileRepository = profileRepository;
    this.createAvatarHandler = createAvatarHandler;
  }

  resolve() {
    this.server.use("/avatar", this.firewall.authRequired);
    this.server.post("/avatar", this.addAvatar.bind(this));
    this.server.put("/avatar", this.addAvatar.bind(this));
    this.server.delete("/avatar", this.deleteAvatar.bind(this));
  }

  async addAvatar(request, response) {
    try {
      request.user.avatarUrl = await this.createAvatarHandler.handle(request, response);
      this.profileRepository.updateAvatar(request.user);
      this.firewall.updateToken(request.user, response);
      response.json(request.user);
    } catch (error) {
      console.error(error);
      response.status(500).end(CustomError.toJson(error));
    }
  }

  async deleteAvatar(request, response) {
    try {
      await this.createAvatarHandler.handleDeleteAvatarOnGCloud(request.user.avatarUrl);
      request.user.avatarUrl = "";
      this.firewall.updateToken(request.user, response);
      await this.profileRepository.updateAvatar(request.user);
      response.status(200).end(JSON.stringify(request.user));
    } catch (error) {
      console.error(error);
      response.status(500).end(CustomError.toJson(error));
    }
  }
}

module.exports = AvatarResolver;

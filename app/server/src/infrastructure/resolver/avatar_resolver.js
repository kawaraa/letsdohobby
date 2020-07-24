const path = require("path");
const fs = require("fs");
const Jimp = require("jimp");
const CustomError = require("../../domain/model/custom-error");
const Dimensions = require("../../domain/model/dimensions");

class AvatarResolver {
  constructor(server, firewall, formidable, profileRepository, storageProvider, idGenerator, config) {
    this.server = server;
    this.firewall = firewall;
    this.fileParser = formidable({ keepExtensions: false, multiples: false });
    this.profileRepository = profileRepository;
    this.storageProvider = storageProvider;
    this.idGenerator = idGenerator;
    this.config = config;
  }

  resolve() {
    this.server.use("/avatar", this.firewall.authRequired);
    this.server.post("/avatar", this.addAvatar.bind(this));
    this.server.put("/avatar", this.addAvatar.bind(this));
    this.server.delete("/avatar", this.deleteAvatar.bind(this));
    // this.fileParser.maxFileSize = 10 * 1024 * 1024;
  }

  addAvatar(request, response) {
    this.fileParser.parse(request, async (error, fields, files) => {
      try {
        if (response.finished) return;
        if (error) throw new Error(error);
        const userInfo = await this.handleAddingAvatar(request.user, fields, files);
        this.firewall.updateToken(userInfo, response);
        response.json(userInfo);
      } catch (error) {
        console.log(error);
        response.status(500).end(CustomError.toJson(error));
      }
    });
  }

  getAvatar(request, response) {
    const fileName = request.params.name;
    try {
      const userProfile = this.profileRepository.getProfile(request.body);
      response.json(userProfile);
    } catch (error) {
      response.status(500).end(CustomError.toJson(error));
    }
  }
  async deleteAvatar(request, response) {
    try {
      await this.deleteFileOnGCloud(request.user.avatarUrl);
      request.user.avatarUrl = "";
      this.firewall.updateToken(request.user, response);
      await this.profileRepository.updateAvatar(request.user);
      response.status(200).end(JSON.stringify(request.user));
    } catch (error) {
      console.log(error);
      response.status(500).end(CustomError.toJson(error));
    }
  }
  async handleAddingAvatar(userInfo, fields, files) {
    const dimensions = new Dimensions(fields);
    let filePath = "";

    if (files.avatar && files.avatar.name) {
      const imageExt = /\.(jpg|png|jpeg|gif|bmp)$/i;
      const ext = path.extname(files.avatar.name.toLowerCase());
      if (!imageExt.test(ext)) throw new CustomError(this.config.fileError);
      filePath = files.avatar.path + ext;
      fs.renameSync(files.avatar.path, filePath);
    }

    const newName = `${this.idGenerator() + path.extname(filePath)}`;
    await this.setAvatarDimensions(filePath, newName, dimensions, fields.sameSize === "true");
    await this.deleteFileOnGCloud(userInfo.avatarUrl);
    userInfo.avatarUrl = `${this.config.domain}${newName}`;
    await this.profileRepository.updateAvatar(userInfo);
    return userInfo;
  }

  async setAvatarDimensions(filePath, newName, { width, height, x, y } = dimensions, sameSize, size = 350) {
    if (sameSize && width !== height) {
      size = width > height ? height : width;
      if (width > height) x = (width - height) / 2;
      if (width < height) y = (height - width) / 2;
    }

    return new Promise((resolve, reject) => {
      const storage = this.storageProvider.storage.file(newName).createWriteStream({ resumable: false });
      storage.on("error", reject).on("finish", resolve);

      Jimp.read(filePath)
        .then((img) => img.resize(width, height).crop(x, y, size, size))
        .then((file) =>
          file.getBuffer(file._originalMime, (error, buffer) => {
            if (error) reject(error);
            storage.end(buffer);
          })
        )
        .catch(reject);

      // Jimp.read(filePath)
      //   .then((img) =>
      //     img.resize(width, height).crop(x, y, size, size).write(`${process.cwd()}/user/${newName}`)
      //   )
      //   .then(resolve)
      //   .catch(reject);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });
  }
  deleteFileOnGCloud(filePath) {
    if (!filePath) return;
    // if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return this.storageProvider.storage.file(path.basename(filePath)).delete();
  }
}

module.exports = AvatarResolver;

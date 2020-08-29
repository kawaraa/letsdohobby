const path = require("path");
const fs = require("fs");
const Jimp = require("jimp");
const CustomError = require("../../domain/model/custom-error");
const Dimensions = require("../../domain/model/dimensions");

class CreateAvatarHandler {
  constructor(formidable, storageProvider, idGenerator, config) {
    this.storageProvider = storageProvider;
    this.idGenerator = idGenerator;
    this.formidable = formidable;
    this.validateFile = this.handleFileValidation.bind(this);
    this.onFile = this.handelFile.bind(this);
    this.onField = this.handleField.bind(this);
    this.config = config;
    this.dimensions = {};
    this.avatarUrl = "";
    this.storedFile = false;
  }

  handle(request, response) {
    this.fileParser = this.formidable({ keepExtensions: false, multiples: false });
    this.fileParser.maxFieldsSize = 1 * 1000000; // (1 MB) a MB = 1 million byte, a GB = 1000 MB
    this.fileParser.maxFileSize = 1000 * 1000000; // (1 GB)
    this.fileParser.maxFields = 5;
    this.avatarUrl = request.user.avatarUrl;

    const promise = new Promise((resolve, reject) => {
      this.fileParser.on("error", (error) => {
        if (!response.finished) reject(error);
        this.fileParser = null;
        this.dimensions = {};
        this.avatarUrl = "";
        this.storedFile = false;
      });

      this.fileParser.on("end", () => {
        if (response.finished || !this.storedFile) return;
        resolve(this.avatarUrl);
        this.fileParser = null;
        this.dimensions = {};
        this.avatarUrl = "";
        this.storedFile = false;
      });
    });

    this.fileParser.onPart = this.validateFile;
    this.fileParser.on("field", this.onField);
    this.fileParser.on("file", this.onFile);
    this.fileParser.parse(request);
    return promise;
  }

  handleFileValidation(part) {
    if (!part.filename || !part.mime) return this.fileParser.handlePart(part);
    const imageExt = /\.(jpg|png|jpeg|gif|bmp)$/i;
    const videoExt = /\.(WEBM|MPG|MP2|MP4|MPEG|MPE|MPV|OGG|M4P|M4V|AVI|WMV|MOV|QT|FLV|SWF|AVCHD)$/i;
    const test1 = imageExt.test(path.extname(part.filename.toLowerCase()));
    const test2 = videoExt.test(path.extname(part.filename.toLowerCase()));
    if (!test1 && !test2) return this.fileParser.emit("error", new CustomError(this.config.fileError));
    this.fileParser.handlePart(part);
  }

  async handleField(name, value) {
    this.dimensions[name] = value;
    if (Object.keys(this.dimensions).length < 5) return;
    try {
      this.dimensions = new Dimensions(this.dimensions);
    } catch (error) {
      this.fileParser.emit("error", error);
    }
  }

  async handelFile(name, file) {
    try {
      let newLocalPath = file.path + path.extname(file.name);
      if (fs.existsSync(file.path)) fs.renameSync(file.path, newLocalPath);
      const croppedAvatarUrl = await this.cropAvatar(newLocalPath, this.dimensions);
      if (fs.existsSync(newLocalPath)) fs.unlinkSync(newLocalPath);
      await this.handleDeleteAvatarOnGCloud(this.avatarUrl);
      this.avatarUrl = croppedAvatarUrl;
      this.storedFile = true;
      this.fileParser.emit("end");
    } catch (error) {
      this.fileParser.emit("error", error);
    }
  }

  async cropAvatar(localPath, { width, height, x, y, sameSize } = dimensions, size = 350) {
    const avatarName = "avatar-" + path.basename(localPath);
    if (sameSize && width !== height) {
      size = width > height ? height : width;
      if (width > height) x = (width - height) / 2;
      if (width < height) y = (height - width) / 2;
    }

    const storage = this.storageProvider.storage.file(avatarName).createWriteStream({ resumable: false });

    return new Promise((resolve, reject) => {
      storage.on("error", reject).on("finish", () => resolve(this.config.domain + avatarName));
      Jimp.read(localPath)
        .then((img) => img.resize(width, height).crop(x, y, size, size))
        .then((file) =>
          file.getBuffer(file._originalMime, (error, buffer) => {
            if (error) reject(error);
            storage.end(buffer);
          })
        )
        .catch(reject);
    });
  }

  handleDeleteAvatarOnGCloud(filePath) {
    if (!filePath || filePath.length < 15) return;
    return this.storageProvider.storage.file(path.basename(filePath)).delete();
  }
}

module.exports = CreateAvatarHandler;

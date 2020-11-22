const path = require("path");

const CustomError = require("../../domain/model/custom-error");
const CreatePostCommand = require("../../domain/command/create-post-command");

class CreatePostHandler {
  constructor(formidable, postRepository, storageProvider, idGenerator) {
    this.formidable = formidable;
    this.postRepository = postRepository;
    this.storageProvider = storageProvider;
    this.idGenerator = idGenerator;
    this.onFile = this.handelFile.bind(this);
    this.config = env.createPostHandler;
    this.post = {};
    this.command = {};
    this.filesInProcess = 0;
  }

  handle(request, response) {
    this.fileParser = this.formidable({ keepExtensions: false, multiples: false });
    this.fileParser.maxFieldsSize = 20 * 1000000; // a MB = 1 million byte, a GB = 1000 MB
    this.fileParser.maxFileSize = 10 * 1000 * 1000000;
    this.fileParser.maxFields = 10;
    this.fileParser.onPart = this.onFile;
    this.fileParser.on("field", (name, value) => this.handleField(name, value, request.user));

    const promise = new Promise((resolve, reject) => {
      this.fileParser.on("error", (error) => {
        this.post = {};
        this.command = {};
        this.fileParser = null;
        if (!response.finished) reject(error);
      });
      this.fileParser.on("end", async () => {
        if (response.finished || this.filesInProcess > 0) return;
        try {
          const post = await this.postRepository.createPost(request.user, this.command);
          this.post = {};
          this.command = {};
          this.fileParser = null;
          return resolve(post);
        } catch (error) {
          this.fileParser.emit("error", error);
        }
      });
    });

    this.fileParser.parse(request);
    return promise;
  }

  async handleField(name, value, userInfo) {
    this.post[name] = value;
    if (Object.keys(this.post).length < 5) return;
    try {
      this.command = new CreatePostCommand({
        ...this.post,
        owner: userInfo.id,
        mediaUrls: "",
        locationLat: userInfo.currentLat,
        locationLng: userInfo.currentLng,
      });
    } catch (error) {
      this.fileParser.emit("error", error);
    }
  }

  async handelFile(part) {
    if (!part.filename || !part.mime) return this.fileParser.handlePart(part);
    this.filesInProcess += 1;
    try {
      const imageExt = /\.(jpg|png|jpeg|gif|bmp)$/i;
      const videoExt = /\.(WEBM|MPG|MP2|MP4|MPEG|MPE|MPV|OGG|M4P|M4V|AVI|WMV|MOV|QT|FLV|SWF|AVCHD)$/i;
      const audioExt = /\.(MP3|M4A|FLAC|WAV|WMA|AAC)$/i;
      const test1 = imageExt.test(path.extname(part.filename.toLowerCase()));
      const test2 = videoExt.test(path.extname(part.filename.toLowerCase()));
      const test3 = audioExt.test(path.extname(part.filename.toLowerCase()));
      if (!test1 && !test2 && !test3) throw CustomError(this.config.fileError);

      const fileName = `${this.idGenerator()}${path.extname(part.filename)}`;

      await new Promise((resolve, reject) => {
        // const file = fs.createWriteStream(uploadDir + fileName);
        // part.on("data", (chunk) => {
        //   this.fileParser.pause();
        //   file.write(chunk);
        //   this.fileParser.resume();
        // });
        // part.on("end", () => file.end());
        // file.on("error", reject).on("finish", resolve);
        // this.command.mediaUrls = `http://localhost:8080/user/${fileName},` + this.command.mediaUrls;

        const storage = this.storageProvider.storage.file(fileName).createWriteStream({ resumable: false });
        part.on("data", (chunk) => {
          this.fileParser.pause();
          storage.write(chunk);
          this.fileParser.resume();
        });
        part.on("end", () => storage.end());
        storage.on("error", reject).on("finish", resolve);
      });
      this.command.mediaUrls = `${this.config.domain}${fileName},` + this.command.mediaUrls;

      this.filesInProcess -= 1;
      this.fileParser.emit("end");
    } catch (error) {
      this.fileParser.emit("error", error);
    }
  }
}

module.exports = CreatePostHandler;

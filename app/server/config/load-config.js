module.exports = () => {
  const config = { ...require("./config.json"), ...require("./variable.json"), ...process.env };

  config.publicDir = process.cwd() + config.publicDir;
  config.GCLOUD.keyFilename = __dirname + config.GCLOUD.keyFilename;
  // if(config.NODE_ENV !== "production")

  global.env = config;
};

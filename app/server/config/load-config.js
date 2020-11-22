module.exports = () => {
  const config = { ...require("./config.json"), ...require("./variable.json"), ...process.env };

  config.publicDir = process.cwd() + config.publicDir;

  // if(config.NODE_ENV !== "production")
  global.env = config;
};

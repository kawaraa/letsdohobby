const { readFileSync } = require("fs");

class BaseComponent {
  constructor(path) {
    this.readFileSync = readFileSync;
    this.componentDirectory = path;
  }

  readFile(filename) {
    try {
      const file = this.readFileSync(this.componentDirectory + filename, "UTF8");
      return file;
    } catch (error) {
      console.log("Fails reading file: ", error);
      return "";
    }
  }
  injectComponent(page, data) {
    for (let key in data) {
      page = page.replace("(" + key + ")", data[key]);
    }
    return page;
  }
}

module.exports = BaseComponent;

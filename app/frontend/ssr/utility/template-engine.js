const { readFileSync } = require("fs");

class TemplateEngine {
  constructor() {
    this.fileReader = readFileSync;
    this.compiler = eval;
    this.workDir = process.cwd() + "/frontend/ssr/view/";
  }

  compile(path) {
    return eval(this.fileReader(this.workDir + path, "UTF8"));
  }
  render(path, a, b, c, d) {
    return this.compile(path)(a, b, c, d);
  }
}
module.exports = new TemplateEngine();

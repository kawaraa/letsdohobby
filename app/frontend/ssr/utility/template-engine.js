const { readFileSync } = require("fs");

class TemplateEngine {
  constructor() {
    this.fileReader = readFileSync;
    this.compiler = eval;
  }

  compile(path) {
    return eval(this.fileReader(path, "UTF8"));
  }
  render(path, a, b, c, d) {
    return this.compile(path)(a, b, c, d);
  }
}
module.exports = new TemplateEngine();

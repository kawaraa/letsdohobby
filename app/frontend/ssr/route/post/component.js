const BaseController = require("../../class/base-component");
const navbar = require("../../component/layout/navbar/component");

class Controller extends BaseController {
  constructor(path) {
    super(path);
  }

  render(post) {
    const component = this.readFile("index.html");
    const NAVBAR = navbar.render();

    return this.injectComponent(component, { NAVBAR });
  }
}

module.exports = new Controller(__dirname + "/");

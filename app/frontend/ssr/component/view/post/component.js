const BaseController = require("../../../class/base-component");

class Controller extends BaseController {
  constructor(path) {
    super(path);
  }

  render(posts) {
    const component = this.readFile("post.html");
    return posts.map((post) => this.injectComponent(component, post));
  }
}

module.exports = new Controller(__dirname + "/");

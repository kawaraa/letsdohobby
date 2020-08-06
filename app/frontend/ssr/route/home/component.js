const BaseComponent = require("../../class/base-component");
const navbar = require("../../component/layout/navbar/component");
const post = require("../../component/view/post/component");

class Component extends BaseComponent {
  constructor(path) {
    super(path);
  }

  render(posts) {
    const page = this.readFile("index.html");
    const NAVBAR = navbar.render();
    const POSTS = post.render(posts);

    return this.injectComponent(page, { NAVBAR, POSTS });
  }
}

module.exports = new Component(__dirname + "/");

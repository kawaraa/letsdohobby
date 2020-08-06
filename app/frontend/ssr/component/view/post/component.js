const BaseController = require("../../../class/base-component");

class Controller extends BaseController {
  constructor(path) {
    super(path);
  }

  render(posts) {
    const component = this.readFile("post.html");
    const style = `<style>${this.readFile("style.css")}</style>`;
    const allComponents = posts.map((post) => this.injectComponent(component, post));
    return style + allComponents;
  }
}

module.exports = new Controller(__dirname + "/");

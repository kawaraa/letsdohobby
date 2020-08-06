const BaseComponent = require("../../../class/base-component");

class Component extends BaseComponent {
  constructor(path) {
    super(path);
  }

  render(data) {
    const page = this.readFile("navbar.html");
    const STYLE = `<style>${this.readFile("style.css")}</style>`;

    return STYLE + page;
  }
}

module.exports = new Component(__dirname + "/");

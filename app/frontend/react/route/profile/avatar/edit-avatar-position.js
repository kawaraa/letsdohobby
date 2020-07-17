import React from "react";

class EditAvatarPosition extends React.Component {
  constructor(props) {
    super(props);
    this.getImg = this.handleImgLoad.bind(this);
    this.onZoomIn = this.handleZoomIn.bind(this);
    this.onZoomOut = this.handleZoomOut.bind(this);
    this.onMouseMove = this.handleMouseMove.bind(this);
    this.state = { mouseX: 0, mouseY: 0 };
  }

  handleImgLoad(e) {
    this.parent = document.getElementById("edit-avatar-wrapper");
    this.img = e.target;
    this.img.onmousedown = this.handleAvatarAdjusting.bind(this);
    this.img.onmouseup = this.handleMouseUp.bind(this);
    let { offsetTop, height, offsetLeft, width } = this.img;
    this.img.style.top = 0;
    this.img.style.left = 0;
    this.img.style.width = "";
    this.props.setDimensions({ y: offsetTop, height, x: offsetLeft, width, sameSize: true });
  }

  handleZoomIn() {
    this.img.style.width = this.img.width + 15 + "px";
    const { offsetTop, height, offsetLeft, width } = this.img;
    this.props.setDimensions({ y: offsetTop, height, x: offsetLeft, width, sameSize: false });
  }
  handleZoomOut() {
    this.img.style.top = "0";
    this.img.style.left = "0";

    let { parent, img } = this;

    if (img.width <= parent.offsetWidth || img.height <= parent.offsetHeight) return;
    this.img.style.width = (img.width - 15 <= parent.offsetWidth ? 350 : img.width - 15) + "px";

    let { offsetTop, height, offsetLeft, width } = this.img;
    this.props.setDimensions({ y: offsetTop, height: height, x: offsetLeft, width, sameSize: false });
  }
  handleAvatarAdjusting(e) {
    this.setState({ mouseY: e.offsetY, mouseX: e.offsetX });
    this.img.onmousemove = this.onMouseMove;
  }
  handleMouseUp(e) {
    this.img.onmousemove = null;
  }
  handleMouseMove(e) {
    const { mouseY, mouseX } = this.state;
    const mouse = { yMovedPx: mouseY - e.offsetY, xMovedPx: mouseX - e.offsetX };
    let { parent, img } = this;

    const topMargin = img.offsetTop - mouse.yMovedPx;
    const leftMargin = img.offsetLeft - mouse.xMovedPx;
    const bottomMargin = parent.offsetHeight - img.height;
    const rightMargin = parent.offsetWidth - img.width;

    if (img.width >= parent.offsetWidth && topMargin <= -0 && topMargin >= bottomMargin) {
      this.img.style.top = topMargin + "px";
    }
    if (img.height >= parent.offsetHeight && leftMargin <= -0 && leftMargin >= rightMargin) {
      this.img.style.left = leftMargin + "px";
    }

    const { offsetTop, height, offsetLeft, width } = this.img;
    this.props.setDimensions({ y: offsetTop * -1, height, x: offsetLeft * -1, width, sameSize: false });
  }

  render() {
    const { src } = this.props;

    return (
      <>
        {src && <img src={src} alt="Profile Avatar" id="edit-avatar-img" onLoad={this.getImg} />}

        <span className="edit-avatar zoom in" onClick={this.onZoomIn}>
          +
        </span>
        <span className="edit-avatar zoom out" onClick={this.onZoomOut}>
          -
        </span>
      </>
    );
  }
}

export default EditAvatarPosition;

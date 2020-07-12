import React from "react";
import { config } from "../../../../config/config";
import DotsIcon from "../../../../layout/icon/dots-icon";
import "./options.css";

class UserOptions extends React.Component {
  constructor(props) {
    super(props);
    this.onShow = () => this.setState({ showList: !this.state.showList });
    this.onEdit = this.handleEdit.bind(this);
    this.onShare = this.handleCopyPostLink.bind(this);
    this.config = config("share");
    this.state = { showList: false };
  }

  handleEdit() {
    window.dispatchEvent(new CustomEvent("SHOW_HIDE_UPDATE_POST_FORM", { detail: this.props.i }));
  }
  showMessage(message) {
    window.dispatchEvent(new CustomEvent("SHOW_MESSAGE", { detail: message }));
  }

  async handleCopyPostLink() {
    try {
      await navigator.clipboard.writeText(this.config.url + this.props.post.id);
      this.showMessage("Copied post link");
    } catch (error) {
      this.showMessage("Couldn't copy post link");
    }
  }
  componentDidMount() {
    window.addEventListener("click", ({ target } = e) => {
      const cssClass = target.classNambaseVal || target.className;
      if (!/post dots-icon/gim.test(cssClass)) this.setState({ showList: false });
    });
  }

  render() {
    return (
      <div className="post options-wrapper">
        <DotsIcon onClick={this.onShow} name="post" />

        {this.state.showList && (
          <div className="post options-list" role="list" title="Options list" tabi="0">
            <button onClick={this.onEdit} type="button" className="post options-item top" title="Edit post">
              Edit
            </button>
            <button onClick={this.props.delete} className="post options-item" type="button" title="Delete">
              Delete
            </button>
            <button
              onClick={this.onShare}
              type="button"
              className="post options-item"
              title="Share post or Copy the post link"
            >
              Share
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default UserOptions;

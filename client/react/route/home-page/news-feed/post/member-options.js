import React from "react";
import { config } from "../../../../config/config";
import Request from "../../../../utility/request";
import DotsIcon from "../../../../layout/icon/dots-icon";
import LoadingIcon from "../../../../layout/icon/loading-icon";
import ExclamationMark from "../../../../layout/exclamation-mark";
import "./options.css";

class MemberOptions extends React.Component {
  constructor(props) {
    super(props);
    this.onShow = () => this.setState({ showList: !this.state.showList });
    this.onJoin = this.handleJoinRequest.bind(this);
    this.onCancel = this.handleCancelRequest.bind(this);
    this.onReport = this.handleReportPost.bind(this);
    this.onShare = this.handleCopyPostLink.bind(this);
    this.config = config("options");
    this.state = { loading: false, success: true, showList: false };
  }

  showMessage(message) {
    window.dispatchEvent(new CustomEvent("SHOW_MESSAGE", { detail: message }));
  }

  async handleJoinRequest() {
    const { post } = this.props;
    try {
      this.setState({ loading: true });
      await Request.send(null, this.config.join.url + post.id, this.config.join.method);
      post.requested = true;
      this.setState({ loading: false, success: true });
      window.dispatchEvent(new CustomEvent("UPDATE_POST", { detail: post }));
    } catch (error) {
      this.setState({ success: false });
    }
  }
  async handleCancelRequest() {
    const { post } = this.props;
    try {
      this.setState({ loading: true });
      await Request.send(null, this.config.cancel.url + post.id, this.config.cancel.method);
      post.requested = false;
      this.setState({ loading: false, success: true });
      window.dispatchEvent(new CustomEvent("UPDATE_POST", { detail: post }));
    } catch (error) {
      this.setState({ success: false });
    }
  }
  async handleReportPost() {
    const { url, method } = this.config.report;
    try {
      await Request.send(null, url + this.props.post.id, method);
      this.showMessage("Post has been reported");
    } catch (error) {
      this.showMessage("Couldn't report the post");
    }
  }
  async handleCopyPostLink() {
    try {
      await navigator.clipboard.writeText(this.config.share.link + this.props.post.id);
      this.showMessage("Copied post link");
    } catch (error) {
      this.showMessage("Couldn't copy post link");
    }
  }
  componentDidMount() {
    window.addEventListener("click", ({ target } = e) => {
      const cssClass = target.classNambaseVal || target.className;
      if (!/dots-icon/gim.test(cssClass)) this.setState({ showList: false });
    });
  }

  renderJoinBtn(post) {
    return !post.requested ? (
      <button className="post join-button" onClick={this.onJoin}>
        {this.state.loading && <LoadingIcon />} {!this.state.success && <ExclamationMark />}Join
      </button>
    ) : (
      <button className="post join-button" onClick={this.onCancel}>
        {this.state.loading && <LoadingIcon />} {!this.state.success && <ExclamationMark />}Cancel
      </button>
    );
  }

  render() {
    const { post } = this.props;

    return (
      <div className="post options-wrapper">
        <DotsIcon onClick={this.onShow} name="post" />

        {post.requested !== undefined && this.renderJoinBtn(post)}

        {this.state.showList && (
          <div className="post options-list" role="list" title="Options list" tabindex="0">
            <button
              onClick={this.onReport}
              type="button"
              className="post options-item top"
              title="Report post"
            >
              Report
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

export default MemberOptions;

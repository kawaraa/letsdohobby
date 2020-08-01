import React from "react";
import Request from "../../../../utility/request";
import LoadingIcon from "../../../../layout/icon/loading-icon";
import ExclamationMark from "../../../../layout/exclamation-mark";
import "./media.css";
/**
 * Todo
 * 1- Change the way the big file is loaded to be piped directly the element
 */
export default class Media extends React.Component {
  constructor(props) {
    super(props);
    this.onAction = this.handleAction.bind(this);
    this.imageExt = /\.(jpg|png|jpeg|gif|bmp)$/i;
    this.audioExt = /\.(MP3|M4A|FLAC|WAV|WMA|AAC)$/i;
    this.state = { loading: false, success: true, fileUrl: null };
  }

  handleAction(action) {
    if (action === "retry") this.loadVideo();
  }
  async loadVideo() {
    try {
      const blob = await Request.fetch(this.props.url, "GET", "blob");
      const fileUrl = (URL || webkitURL).createObjectURL(blob);
      this.setState({ fileUrl, success: true });
    } catch (error) {
      this.setState({ success: false });
    }
  }
  componentDidMount() {
    if (this.imageExt.test(this.props.url)) return;
    this.loadVideo();
  }

  render() {
    const { loading, success, fileUrl } = this.state;
    if (loading) return <LoadingIcon name="media box" color="#7b95e0" />;
    if (!success) return <ExclamationMark listener={this.onAction} name="media box" />;

    const img = <img src={this.props.url} className="media image no-line" alt="Post photo" tabindex="0" />;
    const audio = (
      <video src={fileUrl} controls className="media video no-line" alt="Post video" tabindex="0"></video>
    );

    return <div className="media box">{this.imageExt.test(this.props.url) ? img : audio}</div>;
  }
}

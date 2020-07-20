import React from "react";
import { config } from "../../config/config";
import Request from "../../utility/request";
import CustomDate from "../../utility/custom-date";
import LoadingIcon from "../icon/loading-icon";
import ExclamationMark from "../exclamation-mark";

import "./notification-item.css";

class NotificationItem extends React.Component {
  constructor(props) {
    super(props);
    this.config = config("notificationItem");
    this.onAcceptJoinRequest = this.handleAcceptJoinRequest.bind(this);
    this.onRejectJoinRequest = this.handleRejectJoinRequest.bind(this);
    this.state = { loading: false, success: true };
  }

  async handleAcceptJoinRequest() {
    const query = `?notification_id=${this.props.notification.id}&localDate=${CustomDate.toString(
      new Date()
    )}`;
    try {
      this.setState({ loading: true });
      await Request.fetch(this.config.accept.url + query, this.config.accept.method);
      this.props.removeNotification(this.props.notification.id);
    } catch (error) {
      this.setState({ loading: false, success: false });
    }
  }
  async handleRejectJoinRequest() {
    const query = `?notification_id=${this.props.notification.id}&localDate=${CustomDate.toString(
      new Date()
    )}`;
    try {
      this.setState({ loading: true });
      await Request.fetch(this.config.reject.url + query, this.config.reject.method);
      this.props.removeNotification(this.props.notification.id);
    } catch (error) {
      this.setState({ loading: false, success: false });
    }
  }

  render() {
    const { notification } = this.props;
    const { loading, success } = this.state;
    const cssClass = notification.unseen ? "new" : "";
    const text = notification.text.split("]");

    return (
      <li className={"notification item " + cssClass}>
        <p className="notification text">
          <strong className="notification subject">{text[0]}</strong>
          {text[1]} <strong className="notification object">{text[2]}</strong>
          {text[3] ? text[3] : ""}
        </p>

        {loading && <LoadingIcon color="#7b95e0" />}
        {!success && <ExclamationMark />}

        <button className="notification btn" onClick={this.onAcceptJoinRequest}>
          Accept
        </button>
        <button className="notification btn" onClick={this.onRejectJoinRequest}>
          Reject
        </button>
      </li>
    );
  }
}
export default NotificationItem;

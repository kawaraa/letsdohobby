import React, { useState } from "react";
import { getConfig } from "../../config/config";
import Request from "../../utility/request";
import CustomDate from "../../utility/custom-date";
import LoadingIcon from "../icon/loading-icon";
import ExclamationMark from "../exclamation-mark";
import "./notification-item.css";

const NotificationItem = ({ id, text, unseen, removeNotification }) => {
  const config = getConfig("notificationItem");
  const [{ loading, success }, setState] = useState({ loading: false, success: true });
  text = text.split("]");

  const handleAcceptJoinRequest = async () => {
    const query = `?notification_id=${id}&localDate=${CustomDate.toString(new Date())}`;
    try {
      setState({ loading: true, success: true });
      await Request.fetch(config.accept.url + query, config.accept.method);
      removeNotification(id);
    } catch (error) {
      setState({ loading: false, success: false });
    }
  };
  const handleRejectJoinRequest = async () => {
    const query = `?notification_id=${id}&localDate=${CustomDate.toString(new Date())}`;
    try {
      setState({ loading: true, success: true });
      await Request.fetch(config.reject.url + query, config.reject.method);
      removeNotification(id);
    } catch (error) {
      setState({ loading: false, success: false });
    }
  };

  return (
    <li className={"notification item " + (unseen ? "new" : "")}>
      <p className="notification text">
        <strong className="notification subject">{text[0]}</strong>
        {text[1]} <strong className="notification object">{text[2]}</strong>
        {text[3] ? text[3] : ""}
      </p>

      {loading && <LoadingIcon color="#7b95e0" />}
      {!success && <ExclamationMark />}

      <button className="notification btn" onClick={handleAcceptJoinRequest}>
        Accept
      </button>
      <button className="notification btn" onClick={handleRejectJoinRequest}>
        Reject
      </button>
    </li>
  );
};
export default NotificationItem;

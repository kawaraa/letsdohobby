import React from "react";
import { getConfig } from "../../config/config";
import Request from "../../utility/request";
import NotificationItem from "./notification-item";
import LoadingIcon from "../icon/loading-icon";
import "./notification-list.css";

class NotificationList extends React.Component {
  constructor(props) {
    super(props);
    this.config = getConfig("notification");
    this.onRemoveNotification = this.handleRemoveNotification.bind(this);
    this.state = { loading: true, error: "", notifications: [] };
  }

  handleRemoveNotification(id) {
    const { notifications } = this.state;
    this.setState({ notifications: notifications.filter((not) => not.id !== id) });
  }
  async componentDidMount() {
    try {
      const notifications = await Request.fetch(this.config.list.url);
      this.setState({ notifications, error: "", loading: false });
      this.props.markAsSeen();
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  }

  render() {
    const { notifications, loading, error } = this.state;
    let content = notifications.map((not, i) => (
      <NotificationItem notification={not} key={i} removeNotification={this.onRemoveNotification} />
    ));

    if (!notifications[0]) content = <li className="notification no-items">No notifications</li>;
    if (error) content = <li className="notification error">{error}</li>;
    if (loading) content = <LoadingIcon name="notification" color="#7b95e0" />;

    return <ul className="notification list">{content}</ul>;
  }
}
export default NotificationList;

import React from "react";
import Request from "../../utility/request";
import { config } from "../../config/config";
import NotificationList from "./notification-list";
import "./notification.css";

class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.config = config("notification");
    this.markAsSeen = this.onSeeNotifications.bind(this);
    this.state = { showNotificationList: false, unseenNotifications: [] };
  }

  onSeeNotifications() {
    this.setState({ unseenNotifications: [] });
  }
  onAddNewNotification(e) {
    const { unseenNotifications } = this.state;
    const index = unseenNotifications.findIndex((notification) => notification.id === e.detail.id);
    if (index < 0) unseenNotifications.push(e.detail);
    this.setState({ unseenNotifications });
  }
  onRemoveNotification({ detail } = e) {
    const nots = this.state.unseenNotifications.filter((notification) => notification.id !== detail.id);
    this.setState({ unseenNotifications: nots });
  }

  async componentDidMount() {
    window.addEventListener("click", ({ target } = e) => {
      const cssClass = target.classNambaseVal || target.className;
      if (!/notification-button/.test(cssClass)) return this.setState({ showNotificationList: false });
      this.setState({ showNotificationList: !this.state.showNotificationList });
    });
    window.addEventListener("ADD_NOTIFICATION", this.onAddNewNotification.bind(this));
    window.addEventListener("REMOVE_NOTIFICATION", this.onRemoveNotification.bind(this));
    try {
      const unseenNotifications = await Request.fetch(this.config.unseen.url);
      this.setState({ unseenNotifications });
    } catch (error) {
      this.setState({ unseenNotifications: [] });
    }
  }

  render() {
    const { showNotificationList, unseenNotifications } = this.state;
    const nots = unseenNotifications.length > 0;
    return (
      <div className="nav-icon wrapper notification">
        <img src="/image/notification.svg" alt="Notification icon" className="nav-icon notification img" />
        {nots && <span className="notification unseen-counter">{unseenNotifications.length}</span>}
        {showNotificationList && <NotificationList markAsSeen={this.markAsSeen} />}
        <button type="button" className="notification-button no-line"></button>
      </div>
    );
  }
}
export default Notification;

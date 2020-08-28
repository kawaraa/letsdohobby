import React, { useContext, useState, useEffect } from "react";
import { getConfig } from "../../config/config";
import { AppContext } from "../../store/app-store";
import NotificationItem from "./notification-item";
import LoadingIcon from "../icon/loading-icon";
import "./notification-list.css";

const NotificationList = (props) => {
  const config = getConfig("notification");
  const [notifications, setNotifications] = useState([]);
  const [{ loading, error }, setState] = useState({ loading: true, error: "" });
  const { Request, setUnseenNotifications } = useContext(AppContext);

  const remove = (id) => setNotifications(notifications.filter((not) => not.id !== id));

  const componentDidMount = async () => {
    try {
      const notifications = await Request.fetch(config.list.url);
      setNotifications(notifications);
      setState({ error: "", loading: false });
      setUnseenNotifications([]);
    } catch (error) {
      setState({ error: error.message, loading: false });
    }
  };

  useEffect(() => {
    componentDidMount();
  }, []);

  let content = notifications[0] ? (
    notifications.map((not, i) => <NotificationItem {...not} key={i} removeNotification={remove} />)
  ) : (
    <li className="notification no-items">No notifications</li>
  );

  if (error) content = <li className="notification error">{error}</li>;
  if (loading) content = <LoadingIcon name="notification" color="#7b95e0" />;

  return <ul className="notification list">{content}</ul>;
};
export default NotificationList;

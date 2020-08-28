import React, { useState, useEffect, useContext } from "react";
import { getConfig } from "../../config/config";
import { AppContext } from "../../store/app-store";
import NotificationList from "./notification-list";
import "./notification.css";

const Notification = (props) => {
  const config = getConfig("notification");
  const [showNotificationList, setShowNotificationList] = useState(false);
  const { Request, unseenNotifications, setUnseenNotifications } = useContext(AppContext);
  const unseenNots = unseenNotifications.length;

  useEffect(() => {
    Request.fetch(config.unseen.url)
      .then((unseenNotifications) => setUnseenNotifications(unseenNotifications))
      .catch((error) => setUnseenNotifications([]));
    window.addEventListener("click", ({ target: { className } }) => {
      if (!/notification-button/.test(className)) setShowNotificationList(false);
    });
  }, []);

  return (
    <div className="nav-icon wrapper notification">
      <img src="/image/notification.svg" alt="Notification icon" className="nav-icon notification img" />
      {unseenNots > 0 && <span className="notification unseen-counter">{unseenNots}</span>}
      {showNotificationList && <NotificationList />}
      <button
        type="button"
        className="notification-button no-line"
        onClick={() => setShowNotificationList(!showNotificationList)}
      ></button>
    </div>
  );
};

export default Notification;

import React, { createContext, useState } from "react";
import Request from "../utility/request";

export const AppContext = createContext();

export default (props) => {
  const [user, setUser] = useState({});
  const [location, setLocation] = useState({ latitude: 0, longitude: 0, error: "" });
  const [showMessage, setShowMessage] = useState("");
  const [conversations, setConversations] = useState([]);
  const [connected, setConnected] = useState(false);
  const [showNotificationList, setShowNotificationList] = useState(false);
  const [unseenNotifications, setUnseenNotifications] = useState([]);
  const [unseenChats, setUnseenChats] = useState([]);

  const openConversation = (conversation) => {
    const index = conversations.findIndex((con) => con.id === conversation.id);
    if (index < 0) setConversations([...conversations, conversation]);
  };

  const closeConversation = (id) => {
    setConversations(conversations.filter((con) => con.id !== id));
  };

  const popMessage = (message) => {
    setShowMessage(message);
    setTimeout(() => setShowMessage(""), 2000);
  };

  const addNotification = (notification) => {
    const index = unseenNotifications.findIndex((note) => note.id === notification.id);
    if (index < 0) setUnseenNotifications([...unseenNotifications, notification]);
  };
  const removeNotification = (id) => {
    setUnseenNotifications(unseenNotifications.filter((notification) => notification.id !== id));
  };

  const addUnseenChat = (chat) => {
    if (unseenChats.findIndex((ch) => ch.id === chat.id) < 0) setUnseenChats([...unseenChats, chat]);
  };
  const removeUnseenChat = (id) => {
    setUnseenChats(unseenChats.filter((ch) => ch.id !== id));
  };

  const state = {
    user,
    setUser,
    location,
    showMessage,
    popMessage,
    Request,
    location,
    setLocation,
    conversations,
    openConversation,
    closeConversation,
    connected,
    setConnected,
    showNotificationList,
    // setShowNotificationList,
    unseenNotifications,
    addNotification,
    removeNotification,
    unseenChats,
    setUnseenChats,
    addUnseenChat,
    removeUnseenChat,
  };

  return <AppContext.Provider value={state}>{props.children}</AppContext.Provider>;
};

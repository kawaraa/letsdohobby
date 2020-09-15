import React, { createContext, useState, useEffect } from "react";
import Request from "../utility/request";
import { Validator } from "k-utilities";

export const AppContext = createContext();

export default (props) => {
  const [progress, setProgress] = useState({ loading: false, error: "" });
  const [percentComplete, setPercentComplete] = useState(0);
  const [user, setUser] = useState({});
  const [location, setLocation] = useState({ latitude: 0, longitude: 0, error: "" });
  const [worker, setWorker] = useState(null);
  const [showMessage, setShowMessage] = useState("");
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState("");
  const [conversations, setConversations] = useState([]);
  const [receivedMessage, setReceivedMessage] = useState({});
  const [connected, setConnected] = useState(true);
  const [unseenNotifications, setUnseenNotifications] = useState([]);
  const [unseenChats, setUnseenChats] = useState([]);

  const [profile, setProfile] = useState({});
  const [editingField, setEditingField] = useState("");

  const updateProgress = (state) => setProgress({ ...progress, ...state });

  const addPost = (post) => setPosts([post, ...posts]); // posts.splice(0, 0, detail);
  const updatePost = (post) => {
    const index = posts.findIndex((p) => p.id === post.id);
    if (index > -1) Object.keys(posts[index]).forEach((k) => (posts[index][k] = post[k]));
    setPosts(posts);
  };
  const removePost = (id) => setPosts(posts.filter((post) => post.id !== id));

  const popMessage = (message) => {
    setShowMessage(message);
    setTimeout(() => setShowMessage(""), 2000);
  };

  const openConversation = (conversation) => {
    const index = conversations.findIndex((con) => con.id === conversation.id);
    removeUnseenChat(conversation.id);
    if (index > -1) return;
    conversation.messages = [];
    setConversations([...conversations, conversation]);
  };
  const closeConversation = (id) => {
    setConversations(conversations.filter((con) => con.id !== id));
  };
  const updateConversationMessages = (conversation) => {
    const conversationsCopy = [...conversations];
    conversationsCopy.forEach((con) => {
      if (con.id === conversation.id) con.messages = conversation.messages;
    });
    setConversations(conversationsCopy);
  };
  useEffect(() => {
    const conversationsCopy = [...conversations];
    const index = conversationsCopy.findIndex((conversation) => conversation.id === receivedMessage.chatId);
    if (index < 0) setUnseenChats([...unseenChats, { id: receivedMessage.chatId }]);
    else {
      conversationsCopy[index].messages.unshift(receivedMessage);
      setConversations(conversationsCopy);
    }
  }, [receivedMessage]);

  const addNotification = (notification) => {
    const index = unseenNotifications.findIndex((note) => note.id === notification.id);
    if (index < 0) setUnseenNotifications([...unseenNotifications, notification]);
  };
  const removeNotification = (notification) => {
    setUnseenNotifications(unseenNotifications.filter((not) => not.id !== notification.id));
  };
  const removeUnseenChat = (id) => setUnseenChats(unseenChats.filter((chat) => chat.id !== id));

  const requestNotificationPermission = () => {
    const error = "Notifications are not supported";
    return new Promise((resolve, reject) => {
      if (!Notification || typeof Notification.requestPermission !== "function") reject(error);
      if (Notification.permission === "granted") return resolve(Notification.permission);
      try {
        Notification.requestPermission().then(resolve).catch(reject);
      } catch (error) {
        // Safari doesn't return a promise for requestPermissions and it throws a Error. instead it takes a callback.
        Notification.requestPermission((res) => (res ? resolve(res) : reject(res)));
      }
    });
  };

  const state = {
    Request,
    Validator,
    progress,
    updateProgress,
    percentComplete,
    setPercentComplete,
    user,
    setUser,
    location,
    setLocation,
    worker,
    setWorker,
    requestNotificationPermission,
    showMessage,
    popMessage,
    posts,
    setPosts,
    addPost,
    updatePost,
    removePost,
    editingPost,
    setEditingPost,
    conversations,
    openConversation,
    closeConversation,
    updateConversationMessages,
    receivedMessage,
    setReceivedMessage,
    connected,
    setConnected,
    unseenNotifications,
    setUnseenNotifications,
    addNotification,
    removeNotification,
    unseenChats,
    setUnseenChats,
    removeUnseenChat,
    editingField,
    setEditingField,
    profile,
    setProfile,
  };

  return <AppContext.Provider value={state}>{props.children}</AppContext.Provider>;
};

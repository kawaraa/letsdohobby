import React, { createContext, useState } from "react";
import Request from "../utility/request";

export const AppContext = createContext();

export default (props) => {
  const [progress, setProgress] = useState({ loading: false, error: "" });
  const [percentComplete, setPercentComplete] = useState(0);
  const [user, setUser] = useState({});
  const [location, setLocation] = useState({ latitude: 0, longitude: 0, error: "" });
  const [showMessage, setShowMessage] = useState("");
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState("");
  const [conversations, setConversations] = useState([]);
  const [connected, setConnected] = useState(false);
  const [unseenNotifications, setUnseenNotifications] = useState([]);
  const [unseenChats, setUnseenChats] = useState([]);

  const [profile, setProfile] = useState({});
  const [editingField, setEditingField] = useState("");

  const updateProgress = (state) => setProgress({ ...progress, ...state });

  const addPost = (post) => setPosts([post, ...posts]);
  // posts.splice(0, 0, detail);
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
    if (index < 0) setConversations([...conversations, conversation]);
  };
  const closeConversation = (id) => {
    setConversations(conversations.filter((con) => con.id !== id));
    removeUnseenChat(id);
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
  const removeUnseenChat = (id) => setUnseenChats(unseenChats.filter((ch) => ch.id !== id));

  const state = {
    Request,
    progress,
    updateProgress,
    percentComplete,
    setPercentComplete,
    user,
    setUser,
    location,
    setLocation,
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
    connected,
    setConnected,
    unseenNotifications,
    setUnseenNotifications,
    addNotification,
    removeNotification,
    unseenChats,
    setUnseenChats,
    addUnseenChat,
    removeUnseenChat,
    editingField,
    setEditingField,
    profile,
    setProfile,
  };

  return <AppContext.Provider value={state}>{props.children}</AppContext.Provider>;
};

import React, { useEffect, useState } from "react";
import { getConfig } from "../../config/config";
import Request from "../../utility/request";
import Chat from "./chat";
import LoadingIcon from "../icon/loading-icon";
import "./chat-list.css";

const ChatList = (props) => {
  const config = getConfig("chatList");
  const [state, setState] = useState({ chats: [], loading: true, error: "" });

  useEffect(() => {
    (async () => {
      try {
        const chats = await Request.fetch(config.url);
        setState({ chats, loading: false, error: "" });
      } catch (error) {
        setState({ error: error.message, loading: false, chats: [] });
      }
    })();
  }, []);

  const { loading, error, chats } = state;

  const resultMessage = <li className="chat no-items">No notifications</li>;
  let content = chats[0] ? chats.map((chat, i) => <Chat chat={chat} key={i} />) : resultMessage;

  if (error) content = <li className="chat error">{error}</li>;
  if (loading) content = <LoadingIcon name="chat" color="#7b95e0" />;

  return <ul className="chat list">{content}</ul>;
};
export default ChatList;

import React, { useState, useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";
import { getConfig } from "../../config/config";
import { AppContext } from "../../store/app-store";
import ChatList from "./chat-list";
import "./messenger.css";

const Messenger = (props) => {
  const config = getConfig("messenger");
  const [showChatList, setShowChatList] = useState(false);
  const { Request, Validator, unseenChats, setUnseenChats } = useContext(AppContext);

  useEffect(() => {
    window.addEventListener("click", ({ target: { className } }) => {
      if (!/messenger-button/.test(className)) setShowChatList(false);
    });
    Request.fetch(config.url)
      .then((unseenChats) => setUnseenChats(unseenChats))
      .catch((err) => setUnseenChats([]));

    const data = Validator.parseUREncoded(props.location.search);
    if (data.group) setShowChatList(true);
  }, []);

  return (
    <div className="nav-icon wrapper messenger">
      <img src="/image/messenger.svg" alt="Messenger icon" className="nav-icon messenger img" />
      {unseenChats.length > 0 && <span className="messenger unseen-counter">{unseenChats.length}</span>}
      {showChatList && <ChatList />}
      <button
        type="button"
        className="messenger-button no-line"
        onClick={() => setShowChatList(!showChatList)}></button>
    </div>
  );
};
export default withRouter(Messenger);

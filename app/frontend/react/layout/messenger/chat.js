import React, { useContext } from "react";
import { AppContext } from "../../store/app-store";
import CustomDate from "../../utility/custom-date";
import "./chat.css";

export default ({ chat } = props) => {
  const { openConversation } = useContext(AppContext);

  return (
    <li className={"chat-list item"} onClick={() => openConversation(chat)}>
      <h2 className="chat name">{chat.activity}</h2>
      <span className="chat members">
        <span className="chat members-counter">{chat.members}</span>
        <img src="/image/members.svg" alt="Chat members" className="chat members-img" />
      </span>
      <p className="chat date">{CustomDate.toText(chat.startAt)}</p>

      {chat.unseenMessages > 0 && (
        <p className="chat messages">
          <span className="chat unseen-counter">{chat.unseenMessages}</span> New messages
        </p>
      )}
    </li>
  );
};

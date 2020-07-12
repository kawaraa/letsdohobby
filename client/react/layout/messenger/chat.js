import React from "react";
import CustomDate from "../../utility/custom-date";
import MemberSvg from "../icon/member-icon";
import "./chat.css";

export default ({ chat } = props) => {
  const showChat = (e) => window.dispatchEvent(new CustomEvent("OPEN_CONVERSATION", { detail: chat }));

  return (
    <li className={"chat-list item"} onClick={showChat}>
      <h2 className="chat name">{chat.activity}</h2>
      <span className="chat members">
        <span className="chat members-counter">{chat.members}</span> <MemberSvg name="chat" />
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

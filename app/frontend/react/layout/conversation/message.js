import React, { useContext } from "react";
import CustomDate from "../../utility/custom-date";
import "./message.css";

const Message = ({ owner, content, createdAt, type, isOwner }) => {
  const cssClass = isOwner ? "right" : "left";

  if (type !== "normal") {
    const text = content.split(",");
    return (
      <li className="message-card info">
        <p className="info text">
          <strong className="info name">{text[0]}</strong>
          {text[1]}
          <strong className="info name">{text[2]}</strong>
        </p>
        <span className="info date">{CustomDate.toText(createdAt)}</span>
      </li>
    );
  }
  return (
    <li className={"message-card no-line " + cssClass} title="Message card" tabindex="0">
      {!isOwner && (
        <img
          src={owner.avatarUrl || "/image/avatar.svg"}
          alt="Message owner avatar"
          className="message-owner avatar img no-line"
        />
      )}
      <span className="message-owner name">{isOwner ? "Me" : owner.name}</span>
      <span className="message date">{CustomDate.toText(createdAt)}</span>
      <p className="message text">{content}</p>
    </li>
  );
};

export default Message;

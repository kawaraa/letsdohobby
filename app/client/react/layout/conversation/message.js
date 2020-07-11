import React, { Component } from "react";
import CustomDate from "../../utility/custom-date";
import Avatar from "../icon/avatar";
import "./message.css";

class Message extends Component {
  render() {
    const { owner, content, createdAt, type } = this.props.message;

    const isOwner = owner.id === window.user.id;
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
        {!isOwner && <Avatar src={owner.avatarUrl} name="message-owner" />}
        <span className="message-owner name">{isOwner ? "Me" : owner.name}</span>
        <span className="message date">{CustomDate.toText(createdAt)}</span>
        <p className="message text">{content}</p>
      </li>
    );
  }
}

export default Message;

import React from "react";
import Conversation from "./conversation";
import "./conversations.css";

export default ({ conversations }) => {
  const type = (receiver) => {
    window.socket.emit("USER_TYPE", { receiver });
    setTimeout(() => window.socket.emit("USER_STOP_TYPING", { receiver }), 1500);
  };

  return (
    <div className="conversations outer-container">
      <div className="conversations container">
        {conversations.map((conversation) => (
          <Conversation conversation={conversation} type={type} />
        ))}
        <div className="conversations right-margin"></div>
      </div>
    </div>
  );
};

import React from "react";
import Conversation from "./conversation";
import "./conversations.css";

export default ({ conversations }) => {
  const type = (receiver) => window.socket.emit("USER_TYPE", { receiver });
  const stopTyping = (receiver) =>
    setTimeout(() => window.socket.emit("USER_STOP_TYPING", { receiver }), 1500);

  return (
    <div className="conversations outer-container">
      <div className="conversations container">
        {conversations.map((conversation) => (
          <Conversation {...conversation} type={type} stopTyping={stopTyping} />
        ))}
        <div className="conversations right-margin"></div>
      </div>
    </div>
  );
};

import React from "react";
import Conversation from "./conversation";
import "./conversations.css";

export default ({ conversations } = props) => {
  if (!conversations[0]) return "";

  return (
    <div className="conversations outer-container">
      <div className="conversations container">
        {conversations.map((conversation) => (
          <Conversation {...conversation} />
        ))}
        <div className="conversations right-margin"></div>
      </div>
    </div>
  );
};

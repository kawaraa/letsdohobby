import React, { Component, useContext, useState, useEffect } from "react";
import { Link, NavLink, withRouter } from "react-router-dom";
import { getConfig } from "../../config/config";
import { AppContext } from "../../store/app-store";
import CustomDate from "../../utility/custom-date";
import Message from "./message";

const Conversation = ({ id, activity, startAt, receiver, type, stopTyping }) => {
  const config = getConfig("conversation");
  const { user, Request, closeConversation, removeUnseenChat } = useContext(AppContext);

  // const [{ loading, error }, setState] = useState({ loading: true, error: "" });
  const [messages, setMessages] = useState([]);
  const [{ text, textareaHeight }, setTextState] = useState({ text: "", textareaHeight: 35 });

  const handleChange = (e) => {
    type(receiver);
    stopTyping(receiver);
    let height = textareaHeight;
    height = e.target.value.length >= 35 ? e.target.value.length : 35;
    height = height < 120 ? height : 120;
    setTextState({ text: e.target.value, textareaHeight: height });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { url, method } = config.createMessage;
      const createdAt = CustomDate.toString(new Date());
      const msg = { chatId: id, content: text, createdAt, type: "normal" };
      const message = await Request.send(msg, url, method);
      setMessages([message, ...messages]);
      // setState({ loading: false, error: "" });
      setTextState({ text: "", textareaHeight: 35 });
      e.target.reset();
      removeUnseenChat(id);
    } catch (error) {
      // setState({ loading: true, error: error.message });
    }
  };

  const addNewMessage = (e) => setMessages([e.detail, ...messages]);

  useEffect(() => {
    window.addEventListener("NEW_MESSAGE", addNewMessage);
    Request.fetch(config.getMessages.url + id)
      .then((messages) => setMessages(messages) + removeUnseenChat(id))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="conversation wrapper">
      <div className="conversation header">
        <Link className="conversation activity" to={"/posts/" + id}>
          {activity}
        </Link>

        <img
          src="/image/triangle-right-arrow.svg"
          alt="Pointing to"
          className="conversation triangle-right-arrow"
        />
        <p className="conversation date">{CustomDate.toText(startAt)}</p>

        <img
          src="/image/x-icon.svg"
          alt="Close conversation button"
          className="conversation x-icon img"
          onClick={() => closeConversation(id)}
        />
      </div>

      <ul className="conversations messages">
        {messages[0] &&
          messages.map((msg, i) => <Message {...msg} key={i} isOwner={msg.owner.id === user.id} />)}
      </ul>

      <form className="conversation form" onChange={handleChange} onSubmit={handleSubmit}>
        <div className="conversation textarea-field">
          <textarea
            style={{ height: textareaHeight + "px" }}
            className="conversation textarea"
            type="text"
            name="message"
            placeholder="message"
            required
          />
        </div>
        <button className="conversation send-btn" type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

export default Conversation;

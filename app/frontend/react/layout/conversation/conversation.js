import React, { useContext, useState, useEffect } from "react";
import { Link, NavLink, withRouter } from "react-router-dom";
import { getConfig } from "../../config/config";
import { AppContext } from "../../store/app-store";
import CustomDate from "../../utility/custom-date";
import LoadingIcon from "../icon/loading-icon";
import CustomMessage from "../custom-message";
import Message from "./message";
const config = getConfig("conversation");

const Conversation = ({ conversation }) => {
  const { user, Request, closeConversation, updateConversationMessages } = useContext(AppContext);
  const { id, activity, startAt, messages, receiver, type } = conversation;

  const [{ loading, error }, setState] = useState({ loading: true, error: "" });
  const [{ text, textareaHeight }, setTextState] = useState({ text: "", textareaHeight: 35 });

  const handleChange = (e) => {
    // type(receiver);
    let height = textareaHeight;
    height = e.target.value.length >= 35 ? e.target.value.length : 35;
    height = height < 120 ? height : 120;
    setTextState({ text: e.target.value, textareaHeight: height });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const form = e.target;
      const msg = { chatId: id, content: text, createdAt: CustomDate.toString(new Date()), type: "normal" };
      const message = await Request.send(msg, config.createMessage.url, config.createMessage.method);
      form.reset();
      setTextState({ text: "", textareaHeight: 35 });
      updateProgress({ error: "" });
      const conversationCopy = { ...conversation };
      conversationCopy.messages.unshift(message);
      updateConversationMessages(conversationCopy);
    } catch (error) {
      updateProgress({ error: config.createMessage.error });
    }
  };

  const fetchMessages = async () => {
    try {
      const messages = await Request.fetch(config.getMessages.url + id);
      updateConversationMessages({ ...conversation, messages });
      setState({ loading: false, error: "" });
    } catch (error) {
      setState({ loading: true, error: error.message });
    }
  };

  useEffect(() => {
    fetchMessages();
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
        {loading && <LoadingIcon />}
        {error && <CustomMessage text={config.getMessages.error} name="error" />}
        {messages[0] &&
          messages.map((msg, i) => <Message {...msg} key={i} isOwner={msg.owner.id === user.id} />)}
      </ul>

      <form className="conversation form" onChange={handleChange} onSubmit={handleSubmit}>
        <div className="conversation textarea-field">
          <textarea
            type="text"
            style={{ height: textareaHeight + "px" }}
            className="conversation textarea"
            name="message"
            placeholder="Your Message"
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

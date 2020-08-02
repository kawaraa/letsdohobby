import React, { Component } from "react";
import { Link, NavLink, withRouter } from "react-router-dom";
import Request from "../../utility/request";
import { config } from "../../config/config";
import CustomDate from "../../utility/custom-date";
import XIcon from "../icon/x-icon";
import Message from "./message";

class conversation extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.handleChange.bind(this);
    this.onSubmit = this.handleSubmit.bind(this);
    this.onClose = this.handleClose.bind(this);
    this.config = config("conversation");
    this.state = { messages: [], loading: true, error: "", text: "", textareaHeight: 35 };
  }
  type() {
    this.props.socket.emit("USER_TYPE", { receiver: this.props.chat.receiver });
  }
  stopTyping() {
    const { receiver } = this.props.chat;
    setTimeout(() => this.props.socket.emit("USER_STOP_TYPING", { receiver }), 1500);
  }
  handleChange(e) {
    // this.type();
    // this.stopTyping();
    let { text, textareaHeight } = this.state;
    textareaHeight = e.target.value.length >= 35 ? e.target.value.length : 35;
    textareaHeight = textareaHeight < 120 ? textareaHeight : 120;
    this.setState({ text: e.target.value, textareaHeight });
  }
  async handleSubmit(e) {
    try {
      e.preventDefault();
      const form = e.target;
      const { url, method } = this.config.createMessage;
      const { messages, text } = this.state;
      const createdAt = CustomDate.toString(new Date());
      const msg = { chatId: this.props.id, content: text, createdAt, type: "normal" };
      const message = await Request.send(msg, url, method);
      messages.unshift(message);
      this.setState({ messages, error: "", textareaHeight: 35 });
      form.reset();
      window.dispatchEvent(new CustomEvent("MARK_CHAT_AS_SEEN", { detail: { id: this.props.id } }));
    } catch (error) {
      this.setState({ error: error.message });
      console.log(error);
    }
  }
  handleClose() {
    window.dispatchEvent(new CustomEvent("CLOSE_CONVERSATION", { detail: this.props.id }));
  }

  addNewMessage({ detail } = e) {
    const { messages } = this.state;
    messages.unshift(detail);
    this.setState({ messages });
  }

  async componentDidMount() {
    window.addEventListener("NEW_MESSAGE", this.addNewMessage.bind(this));
    try {
      const messages = await Request.fetch(this.config.getMessages.url + this.props.id);
      this.setState({ messages });
      window.dispatchEvent(new CustomEvent("MARK_CHAT_AS_SEEN", { detail: this.props.id }));
    } catch (error) {
      console.log("Messages Error: ", error);
    }
  }

  render() {
    const { id, activity, startAt, close } = this.props;
    const { messages, textareaHeight } = this.state;

    return (
      <div className="conversation wrapper">
        <div className="conversation header">
          <Link className="conversation activity" to={"/posts/" + id}>
            {activity}
          </Link>
          <svg viewBox="0 0 400 400" className="conversation arrow-svg">
            <path
              d="m1.14768,2.02114l396.71556,198.9821l-396.13384,197.85384l-0.58172,-396.83594z"
              className="conversation arrow svg-stroke"
            />
          </svg>
          <p className="conversation date">{CustomDate.toText(startAt)}</p>
          <XIcon name="conversation" onClick={this.onClose} />
        </div>

        <ul className="conversations messages">
          {messages[0] && messages.map((msg, i) => <Message message={msg} key={i} />)}
        </ul>

        <form className="conversation form" onChange={this.onChange} onSubmit={this.onSubmit}>
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
  }
}

export default conversation;

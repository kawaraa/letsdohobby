import React from "react";
import Request from "../../utility/request";
import { config } from "../../config/config";
import MessengerIcon from "./messenger-icon";
import ChatList from "./chat-list";
import "./messenger.css";

class Messenger extends React.Component {
  constructor(props) {
    super(props);
    this.config = config("messenger");
    this.state = { showChatList: false, unseenChats: [] };
  }

  addUnseenChat(e) {
    const { unseenChats } = this.state;
    if (unseenChats.findIndex((chat) => chat.id === e.detail.id) < 0) unseenChats.push(e.detail);
    this.setState({ unseenChats });
  }
  removeUnseenChat(e) {
    const { unseenChats } = this.state;
    const chats = unseenChats.filter((chat) => chat.id !== e.detail.id);
    this.setState({ unseenChats: chats });
  }

  async componentDidMount() {
    window.addEventListener("click", ({ target } = e) => {
      const cssClass = target.classNambaseVal || target.className;
      if (!/messenger-button/.test(cssClass)) return this.setState({ showChatList: false });
      this.setState({ showChatList: !this.state.showChatList });
    });
    window.addEventListener("NEW_UNSEEN_CHAT", this.addUnseenChat.bind(this));
    window.addEventListener("OPEN_CONVERSATION", this.removeUnseenChat.bind(this));
    window.addEventListener("MARK_CHAT_AS_SEEN", this.removeUnseenChat.bind(this));
    try {
      const unseenChats = await Request.fetch(this.config.url);
      this.setState({ unseenChats });
    } catch (error) {
      this.setState({ unseenChats: [] });
    }
  }

  render() {
    const { showChatList, unseenChats } = this.state;

    return (
      <div className="nav-icon wrapper messenger">
        <MessengerIcon />
        {unseenChats.length > 0 && <span className="messenger unseen-counter">{unseenChats.length}</span>}
        {showChatList && <ChatList />}
        <button type="button" className="messenger-button no-line"></button>
      </div>
    );
  }
}
export default Messenger;

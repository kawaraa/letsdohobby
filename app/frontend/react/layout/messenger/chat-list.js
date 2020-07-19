import React from "react";
import { config } from "../../config/config";
import Request from "../../utility/request";
import Chat from "./chat";
import LoadingIcon from "../icon/loading-icon";
import "./chat-list.css";

class ChatList extends React.Component {
  constructor(props) {
    super(props);
    this.config = config("chatList");
    this.state = { loading: true, error: "", chats: [] };
  }

  async componentDidMount() {
    try {
      console.log("URL: ", this.config);
      const chats = await Request.fetch(this.config.url);
      this.setState({ chats, error: "", loading: false });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  }

  render() {
    const { loading, error, chats } = this.state;
    let content = chats.map((chat, i) => <Chat chat={chat} key={i} />);

    if (!chats[0]) content = <li className="chat no-items">No notifications</li>;
    if (error) content = <li className="chat error">{error}</li>;
    if (loading) content = <LoadingIcon name="chat" color="#7b95e0" />;

    return <ul className="chat list">{content}</ul>;
  }
}
export default ChatList;

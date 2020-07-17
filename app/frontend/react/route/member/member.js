import React from "react";
import { config } from "../../config/config";
import Request from "../../utility/request";
import "./member.css";

class Member extends React.Component {
  constructor() {
    super();
    this.config = config("memberProfile");
    this.state = {};
  }

  async componentDidMount() {
    console.log(this.props.match.params.id);
    try {
      const member = await Request.fetch(this.config.url + this.props.match.params.id);
      this.setState({ member, loading: false });
    } catch (error) {
      this.setState({ message: error.message, loading: false });
    }
  }
  render() {
    if (!this.state.member) return "";
    const { displayName, avatarUrl, gender, birthday, about } = this.state.member;
    const initials = <span className={"user initials"}>{displayName[0]}</span>;
    const avatar = <img src={avatarUrl} alt="Profile Avatar" className="user avatar-img" />;

    return (
      <div>
        <div className="member container">{avatarUrl ? avatar : initials}</div>
        <Avatar src={member.avatarUrl} name="member profile" />
        <p className="member full-name">{displayName}</p>
        <div className="user_info">
          <p className="field_name">Gender</p>
          <span className="field_content">{gender || "Not specified"}</span>
        </div>
        <div className="user_info">
          <p className="field_name">Birthday</p>
          <span className="field_content">{birthday || "Not specified"}</span>
        </div>
        <div className="user_info">
          <p className="field_name">About</p>
          <p className="field_content">{about || "Not specified"}</p>
        </div>
      </div>
    );
  }
}

export default Member;

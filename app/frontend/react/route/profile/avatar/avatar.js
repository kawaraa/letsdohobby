import React from "react";
import { getConfig } from "../../../config/config";
import Request from "../../../utility/request";
import "./avatar.css";

export default class ProfileAvatar extends React.Component {
  constructor(props) {
    super(props);
    this.onDelete = this.handleDelete.bind(this);
    this.config = config("deleteAvatar");
    this.state = { error: "" };
  }

  async handleDelete() {
    try {
      const user = await Request.send(null, this.config.url, this.config.method);
      window.dispatchEvent(new CustomEvent("UPDATE_APP", { detail: { user } }));
    } catch (error) {
      console.log(error);
      this.setState({ error: error.message });
    }
  }
  render() {
    const { displayName, avatarUrl } = window.user;
    const { error } = this.state;
    const initials = <span className="avatar initials">{displayName[0]}</span>;
    const avatar = <img src={avatarUrl} alt="Profile Avatar" className="profile avatar-img" />;

    return (
      <div className="profile avatar wrapper">
        {error && (
          <p className="avatar error" title="Deleting avatar Error message">
            {error}
          </p>
        )}
        {avatarUrl ? avatar : initials}
        <div className="avatar btns">
          {avatarUrl && (
            <button type="button" onClick={this.onDelete} title="Delete avatar" className="delete no-line">
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={() => this.props.changeMode({ editField: "avatar" })}
            title="Edit avatar"
            className="edit no-line"
            style={{ textAlign: avatarUrl ? "left" : "center" }}
          >
            Edit
          </button>
        </div>
      </div>
    );
  }
}

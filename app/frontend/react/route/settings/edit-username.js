import React from "react";
import { config } from "../../config/config";
import Request from "../../utility/request";
import LoadingIcon from "../../layout/icon/loading-icon";

class EditEmail extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.handleSubmit.bind(this);
    this.config = config("updateUsername");
    this.state = { error: "" };
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { username, psw } = e.target;
    try {
      this.setState({ loading: true });
      await Request.send({ username: username.value, psw: psw.value }, this.config.url);
      window.user.username = username.value;
      window.dispatchEvent(new CustomEvent("UPDATE_APP", { detail: { user: window.user } }));
      this.handleCancel();
    } catch (error) {
      this.setState({ loading: false, error: error.message });
    }
  }

  render() {
    const { loading, error } = this.state;
    const n = window.user.username;

    return (
      <form onSubmit={this.onSubmit} className="account edit-form">
        <img
          src="/image/x-icon.svg"
          alt="Close edit username form button"
          className="account x-icon img"
          onClick={() => this.props.changeMode({ editField: "" })}
        />
        <input type="text" name="username" defaultValue={n} placeholder="Email/Phone" className="f no-line" />
        <input type="password" name="psw" placeholder="Confirm Password" required className="l no-line" />

        <button type="submit" className="no-line">
          {loading && <LoadingIcon />}
          Save
        </button>
        {error && <CustomMessage text={error} name="error" />}
      </form>
    );
  }
}

export default EditEmail;

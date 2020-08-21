import React from "react";
import { getConfig } from "../../../config/config";
import Request from "../../../utility/request";
import LoadingScreen from "../../../layout/icon/loading-screen";
import CustomMessage from "../../../layout/custom-message";
import "./full-name-field.css";

class EditFullName extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.handleSubmit.bind(this);
    this.config = config("updateFullName");
    this.state = { loading: false, error: "" };
  }

  async handleSubmit(e) {
    e.preventDefault();
    try {
      const { profile } = this.props;
      const fullName = { firstName: e.target.firstName.value, lastName: e.target.lastName.value };
      this.setState({ loading: true });
      const user = await Request.send(fullName, this.config.url);
      window.user = user;
      profile.displayName = user.displayName;
      profile.firstName = fullName.firstName;
      profile.lastName = fullName.lastName;
      this.props.changeMode({ editField: "", profile });
    } catch (error) {
      this.setState({ loading: false, error: error.message });
    }
  }

  render() {
    const { loading, error } = this.state;
    if (loading) return <LoadingScreen />;
    const { profile, changeMode } = this.props;
    const f = profile.firstName,
      l = profile.lastName;

    return (
      <form className="full-name edit-form" onSubmit={this.onSubmit}>
        <img
          src="/image/x-icon.svg"
          alt="Close edit full name form button"
          className="full-name x-icon img"
          onClick={() => changeMode({ editField: "" })}
        />

        <input type="text" name="firstName" defaultValue={f} placeholder="First Name" className="f no-line" />
        <input type="text" name="lastName" defaultValue={l} placeholder="Last Name" className="l no-line" />
        <button type="submit" className="no-line">
          Save
        </button>
        {error && <CustomMessage text={error} name="error" />}
      </form>
    );
  }
}

export default EditFullName;

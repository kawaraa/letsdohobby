import React from "react";
import { config } from "../../../config/config";
import Request from "../../../utility/request";
import LoadingScreen from "../../../layout/icon/loading-screen";
import CustomMessage from "../../../layout/custom-message";
import "./about.css";

class EditAbout extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.handleSubmit.bind(this);
    this.config = config("updateAbout");
    this.state = { loading: false, error: "" };
  }

  async handleSubmit(e) {
    e.preventDefault();
    try {
      const p = { about: e.target.about.value };
      this.setState({ loading: true });
      const profile = await Request.send(p, this.config.url);
      this.props.changeMode({ editField: "", profile });
    } catch (error) {
      this.setState({ loading: false, error: error.message });
    }
  }

  render() {
    const { loading, error } = this.state;
    if (loading) return <LoadingScreen />;
    const { profile, changeMode } = this.props;

    return (
      <form className="profile edit-about" onSubmit={this.submit}>
        <textarea name="about" defaultValue={profile.about} placeholder="About me" className="no-line" />

        <div className="edit-about btns">
          <button type="submit">Save</button>
          <button type="button" onClick={() => changeMode({ editField: "" })}>
            Cancel
          </button>
        </div>

        {error && <CustomMessage text={error} name="error" />}
      </form>
    );
  }
}

export default EditAbout;

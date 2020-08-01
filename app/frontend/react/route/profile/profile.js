import React from "react";
import { config } from "../../config/config";
import Request from "../../utility/request";
import Avatar from "./avatar/avatar";
import EditAvatar from "./avatar/edit-avatar";
import FullNameField from "./name/full-name-field";
import EditFullName from "./name/edit-full-name";
import AboutField from "./about/about-field";
import EditAbout from "./about/edit-about";
import { Activities } from "./activities/activities";
import EditActivities from "./activities/edit-activities";
import LoadingScreen from "../../layout/icon/loading-screen";
import CustomMessage from "../../layout/custom-message";
import "./profile.css";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.changeMode = this.handleUpdateState.bind(this);
    this.config = config("getProfile");
    this.state = { loading: true, error: "", profile: null, editField: "" };
  }

  handleUpdateState(data) {
    this.setState(data);
  }
  async componentDidMount() {
    try {
      const profile = await Request.fetch(this.config.url);
      this.setState({ profile, loading: false });
    } catch (error) {
      this.setState({ message: error.message, loading: false });
    }
  }

  render() {
    if (this.state.loading) return "Loading...";
    const { loading, error, profile, editField } = this.state;
    if (loading) return <LoadingScreen />;
    if (error) return <CustomMessage text={error} name="error" />;
    const nameProps = { profile, changeMode: this.changeMode };
    const actProps = { activities: profile.activities, changeMode: this.changeMode };
    const editAvatar = editField === "avatar";
    const editName = editField === "name";
    const editAbout = editField === "about";

    return (
      <div className="outer-container">
        <div className="profile container">
          {editAvatar ? <EditAvatar changeMode={this.changeMode} /> : <Avatar changeMode={this.changeMode} />}
          {editName ? <EditFullName {...nameProps} /> : <FullNameField changeMode={this.changeMode} />}
          {editAbout ? <EditAbout {...nameProps} /> : <AboutField {...nameProps} />}

          <div className="profile custom-field">
            <h4 className="title">Gender</h4>
            <p className="content">{profile.gender}</p>
          </div>
          <div className="profile custom-field">
            <h4 className="title">Birthday</h4>
            <p className="content">{profile.birthday || "Not specified"}</p>
          </div>

          {editField === "activity" ? <EditActivities {...actProps} /> : <Activities {...actProps} />}
        </div>
      </div>
    );
  }
}

export default Profile;

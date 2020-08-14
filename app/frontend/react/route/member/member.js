import React from "react";
import { config } from "../../config/config";
import Request from "../../utility/request";
import { ActivityList } from "../profile/activities/activities";
import LoadingScreen from "../../layout/icon/loading-screen";
import CustomMessage from "../../layout/custom-message";
import "./member.css";

class Member extends React.Component {
  constructor() {
    super();
    this.config = config("memberProfile");
    this.state = { loading: true, error: "" };
  }

  async componentDidMount() {
    try {
      this.setState({ loading: true });
      const member = await Request.fetch(this.config.url + this.props.match.params.id);
      this.setState({ ...member, loading: false });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  }
  render() {
    const { loading, error, displayName, avatarUrl, gender, birthday, about, activities } = this.state;
    if (loading) return <LoadingScreen />;
    if (error) return <CustomMessage text={error} name="error" />;
    const initials = <span className="avatar initials">{displayName[0]}</span>;
    const avatar = <img src={avatarUrl} alt="Profile Avatar" className="member avatar-img" />;

    return (
      <div className="outer-container">
        <div className="profile container">
          <div className="profile avatar wrapper"> {avatarUrl ? avatar : initials}</div>

          <h1 className="member full-name">{displayName}</h1>

          <div className="profile custom-field">
            <h4 className="title">About</h4>
            <p className="content">{about}</p>
          </div>

          <div className="profile custom-field">
            <h4 className="title">Gender</h4>
            <p className="content">{gender}</p>
          </div>

          <div className="profile custom-field">
            <h4 className="title">Birthday</h4>
            <p className="content">{birthday}</p>
          </div>

          <div className="profile activities custom-field">
            <h4 className="title">Activities</h4>
            {activities[0] && <ActivityList activities={activities} />}
          </div>
        </div>
      </div>
    );
  }
}

export default Member;

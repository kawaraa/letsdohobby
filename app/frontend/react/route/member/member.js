import React, { useState, useEffect } from "react";
import { getConfig } from "../../config/config";
import Request from "../../utility/request";
import { ActivityList } from "../profile/activities/activities";
import LoadingScreen from "../../layout/icon/loading-screen";
import CustomMessage from "../../layout/custom-message";
import "./member.css";

const Member = (props) => {
  const config = getConfig("memberProfile");
  const [{ loading, error }, setState] = useState({ loading: true, error: "" });
  const [member, setMember] = useState({});

  const componentDidMount = async () => {
    try {
      const member = await Request.fetch(config.url + props.match.params.id);
      setMember(member);
      setState({ loading: false, error: "" });
    } catch (error) {
      setState({ loading: false, error: error.message });
    }
  };

  useEffect(() => {
    componentDidMount();
  }, []);

  if (loading) return <LoadingScreen />;
  if (error) return <CustomMessage text={error} name="error" />;

  const initials = <span className="avatar initials">{member.displayName[0]}</span>;
  const avatar = <img src={member.avatarUrl} alt="Profile Avatar" className="member avatar-img" />;

  return (
    <div className="outer-container">
      <div className="profile container">
        <div className="profile avatar wrapper"> {member.avatarUrl ? avatar : initials}</div>

        <h1 className="member full-name">{member.displayName}</h1>

        <div className="profile custom-field">
          <h4 className="title">About</h4>
          <p className="content">{member.about}</p>
        </div>

        <div className="profile custom-field">
          <h4 className="title">Gender</h4>
          <p className="content">{member.gender}</p>
        </div>

        <div className="profile custom-field">
          <h4 className="title">Birthday</h4>
          <p className="content">{member.birthday}</p>
        </div>

        <div className="profile activities custom-field">
          <h4 className="title">Activities</h4>
          {member.activities[0] && <ActivityList activities={member.activities} />}
        </div>
      </div>
    </div>
  );
};

export default Member;

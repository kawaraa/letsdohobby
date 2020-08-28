import React, { useContext, useState, useEffect } from "react";
import Request from "../../utility/request";
import { getConfig } from "../../config/config";
import { ProfileContext } from "../../store/profile-store";
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

const Profile = (props) => {
  const config = getConfig("getProfile");
  const { profile, setProfile, editingField, setEditingField } = useContext(ProfileContext);
  const [{ loading, error }, setState] = useState({ loading: true, error: "" });
  const setMode = (fieldName) => setEditingField(fieldName);

  const componentDidMount = async () => {
    try {
      const profile = await Request.fetch(config.url);
      setProfile(profile);
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

  const properties = { activities: profile.activities, setMode };

  return (
    <div className="outer-container">
      <div className="profile container">
        {editingField === "avatar" ? <EditAvatar setMode={setMode} /> : <Avatar setMode={setMode} />}
        {editingField === "name" ? <EditFullName /> : <FullNameField />}
        {editingField === "about" ? <EditAbout /> : <AboutField />}

        <div className="profile custom-field">
          <h4 className="title">Gender</h4>
          <p className="content">{profile.gender}</p>
        </div>
        <div className="profile custom-field">
          <h4 className="title">Birthday</h4>
          <p className="content">{profile.birthday || "Not specified"}</p>
        </div>

        {editingField === "activity" ? <EditActivities /> : <Activities {...properties} />}
      </div>
    </div>
  );
};

export default Profile;

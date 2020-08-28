import React, { useContext, useState } from "react";
import { getConfig } from "../../../config/config";
import { AppContext } from "../../../store/app-store";
import { ProfileContext } from "../../../store/profile-store";
import LoadingScreen from "../../../layout/icon/loading-screen";
import CustomMessage from "../../../layout/custom-message";
import "./full-name-field.css";

const EditFullName = (props) => {
  const config = getConfig("updateFullName");
  const { Request, setUser } = useContext(AppContext);
  const { profile, setProfile, setEditingField } = useContext(ProfileContext);
  const [{ loading, error }, setState] = useState({ loading: false, error: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fullName = { firstName: e.target.firstName.value, lastName: e.target.lastName.value };
      setState({ loading: true, error: "" });
      const user = await Request.send(fullName, config.url);
      profile.displayName = user.displayName;
      profile.firstName = fullName.firstName;
      profile.lastName = fullName.lastName;
      setProfile(profile);
      setUser(user);
      setState({ loading: false, error: "" });
      setEditingField("");
    } catch (error) {
      setState({ loading: false, error: error.message });
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <form className="full-name edit-form" onSubmit={handleSubmit}>
      <img
        src="/image/x-icon.svg"
        alt="Close edit full name form button"
        className="full-name x-icon img"
        onClick={() => setEditingField("")}
      />

      <input
        type="text"
        name="firstName"
        defaultValue={profile.firstName}
        placeholder="First Name"
        className="f no-line"
      />
      <input
        type="text"
        name="lastName"
        defaultValue={profile.lastName}
        placeholder="Last Name"
        className="l no-line"
      />
      <button type="submit" className="no-line">
        Save
      </button>
      {error && <CustomMessage text={error} name="error" />}
    </form>
  );
};

export default EditFullName;

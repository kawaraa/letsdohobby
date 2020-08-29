import React, { useContext } from "react";
import { getConfig } from "../../../config/config";
import { AppContext } from "../../../store/app-store";
import "./full-name-field.css";

const EditFullName = (props) => {
  const config = getConfig("updateFullName");
  const { Request, setUser, updateProgress, profile, setProfile, setEditingField } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fullName = { firstName: e.target.firstName.value, lastName: e.target.lastName.value };
      updateProgress({ loading: true });
      const user = await Request.send(fullName, config.url);
      profile.displayName = user.displayName;
      profile.firstName = fullName.firstName;
      profile.lastName = fullName.lastName;
      setProfile(profile);
      setUser(user);
      setEditingField("");
      updateProgress({ loading: false, error: "" });
    } catch (error) {
      updateProgress({ loading: false, error: error.message });
    }
  };

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
    </form>
  );
};

export default EditFullName;

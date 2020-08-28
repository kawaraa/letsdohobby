import React, { useContext, useState } from "react";
import { getConfig } from "../../../config/config";
import { AppContext } from "../../../store/app-store";
import { ProfileContext } from "../../../store/profile-store";
import "./about.css";

const EditAbout = (props) => {
  const config = getConfig("updateAbout");
  const { Request, updateProgress } = useContext(AppContext);
  const { profile, setProfile, setEditingField } = useContext(ProfileContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      updateProgress({ loading: true });
      const profile = await Request.send({ about: e.target.about.value }, config.url);
      setProfile(profile);
      setEditingField("");
      updateProgress({ loading: false, error: "" });
    } catch (error) {
      updateProgress({ loading: false, error: error.message });
    }
  };

  return (
    <form className="profile edit-about" onSubmit={handleSubmit}>
      <textarea name="about" defaultValue={profile.about} placeholder="About me" className="no-line" />

      <div className="edit-about btns">
        <button type="submit">Save</button>
        <button type="button" onClick={() => setEditingField("")}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditAbout;

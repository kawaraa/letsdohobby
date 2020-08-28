import React, { useContext, useState } from "react";
import { getConfig } from "../../../config/config";
import { AppContext } from "../../../store/app-store";
import { ProfileContext } from "../../../store/profile-store";
import CustomMessage from "../../../layout/custom-message";
import "./about.css";

const EditAbout = (props) => {
  const config = getConfig("updateAbout");
  const { Request, updateProgress } = useContext(AppContext);
  const { profile, setProfile, setEditingField } = useContext(ProfileContext);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      updateProgress({ loading: true });
      const profile = await Request.send({ about: e.target.about.value }, config.url);
      setProfile(profile);
      setEditingField("");
      updateProgress({ loading: false });
    } catch (error) {
      updateProgress({ loading: false });
      setError(error.message);
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

      {error && <CustomMessage text={error} name="error" />}
    </form>
  );
};

export default EditAbout;

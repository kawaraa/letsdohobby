import React, { useContext } from "react";
import { ProfileContext } from "../../../store/profile-store";

export default function (props) {
  const { profile, setEditingField } = useContext(ProfileContext);

  return (
    <div className="profile custom-field">
      <h4 className="title">About</h4>
      <p className="content">{profile.about || "Not specified"}</p>
      <button type="button" onClick={() => setEditingField("about")} className="no-line">
        Edit
      </button>
    </div>
  );
}

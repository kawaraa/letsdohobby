import React, { useContext } from "react";
import { ProfileContext } from "../../../store/profile-store";
import "./full-name-field.css";

export default function (props) {
  const { profile, setEditingField } = useContext(ProfileContext);

  return (
    <div className="profile full-name">
      <h1 className="full-name title">{profile.displayName}</h1>
      <img
        onClick={() => setEditingField("name")}
        src="/image/pen.svg"
        alt="Edit icon"
        className="full-name edit-icon no-line"
      />
    </div>
  );
}

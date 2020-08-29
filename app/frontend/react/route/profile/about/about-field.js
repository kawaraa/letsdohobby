import React, { useContext } from "react";
import { AppContext } from "../../../store/app-store";

export default function (props) {
  const { profile, setEditingField } = useContext(AppContext);

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

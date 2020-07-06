import React from "react";

export default function ({ profile, changeMode } = props) {
  return (
    <div className="profile custom-field">
      <h4 className="title">About</h4>
      <p className="content">{profile.about || "Not specified"}</p>
      <button type="button" onClick={() => changeMode({ editField: "about" })} className="no-line">
        Update
      </button>
    </div>
  );
}

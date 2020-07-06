import React from "react";
import EditIcon from "../../../layout/icon/edit-icon";
import "./full-name-field.css";

export default function ({ changeMode } = props) {
  return (
    <div className="profile full-name">
      <h1 className="full-name title">{window.user.displayName}</h1>
      <EditIcon onClick={() => changeMode({ editField: "name" })} name="full-name" />
    </div>
  );
}

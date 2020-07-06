import React from "react";

export const UsernameField = (props) => {
  return (
    <div className="account custom-field">
      <h4 className="title">Email</h4>
      <p className="content">{window.user.username}</p>
      <button type="button" onClick={() => props.changeMode({ editField: "username" })} className="no-line">
        Update
      </button>
    </div>
  );
};
export const PswField = (props) => {
  return (
    <div className="account custom-field">
      <h4 className="title">Password</h4>
      <p className="content">******</p>
      <button type="button" onClick={() => props.changeMode({ editField: "psw" })} className="no-line">
        Update
      </button>
    </div>
  );
};

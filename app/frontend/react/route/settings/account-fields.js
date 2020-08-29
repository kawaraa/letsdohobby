import React from "react";

export const UsernameField = ({ user, setEditingField }) => {
  return (
    <div className="account custom-field">
      <h4 className="title">Email</h4>
      <p className="content">{user.username}</p>
      <button type="button" onClick={() => setEditingField("username")} className="no-line">
        Update
      </button>
    </div>
  );
};

export const PswField = ({ setEditingField }) => {
  return (
    <div className="account custom-field">
      <h4 className="title">Password</h4>
      <p className="content">******</p>
      <button type="button" onClick={() => setEditingField("psw")} className="no-line">
        Update
      </button>
    </div>
  );
};

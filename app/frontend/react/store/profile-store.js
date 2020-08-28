import React, { createContext, useState } from "react";

export const ProfileContext = createContext();

export default (props) => {
  const [profile, setProfile] = useState({});
  const [editingField, setEditingField] = useState("");

  const state = {
    editingField,
    setEditingField,
    profile,
    setProfile,
  };

  return <ProfileContext.Provider value={state}>{props.children}</ProfileContext.Provider>;
};

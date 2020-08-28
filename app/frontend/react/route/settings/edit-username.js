import React, { useContext, useState } from "react";
import { getConfig } from "../../config/config";
import { AppContext } from "../../store/app-store";
import { ProfileContext } from "../../store/profile-store";
import LoadingIcon from "../../layout/icon/loading-icon";

const EditEmail = (props) => {
  const config = getConfig("updateUsername");
  const { Request, user, setUser, updateProgress } = useContext(AppContext);
  const { setEditingField } = useContext(ProfileContext);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, psw } = e.target;
    try {
      setLoading(true);
      await Request.send({ username: username.value, psw: psw.value }, config.url);
      user.username = username.value;
      updateProgress({ error: "" });
      setUser(user);
      setLoading(false);
      setEditingField("");
    } catch (error) {
      setLoading(false);
      updateProgress({ error: error.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="account edit-form">
      <img
        src="/image/x-icon.svg"
        alt="Close edit username form button"
        className="account x-icon img"
        onClick={() => setEditingField("")}
      />
      <input
        type="text"
        name="username"
        defaultValue={user.username}
        placeholder="Email/Phone"
        className="f no-line"
      />
      <input type="password" name="psw" placeholder="Confirm Password" required className="l no-line" />

      <button type="submit" className="no-line">
        {loading && <LoadingIcon />}
        Save
      </button>
    </form>
  );
};

export default EditEmail;

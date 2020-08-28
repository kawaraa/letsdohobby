import React, { useContext, useState } from "react";
import { getConfig } from "../../config/config";
import { AppContext } from "../../store/app-store";
import { ProfileContext } from "../../store/profile-store";
import LoadingIcon from "../../layout/icon/loading-icon";

const EditPSW = (props) => {
  const config = getConfig("updatePsw");
  const { Request, updateProgress } = useContext(AppContext);
  const { setEditingField } = useContext(ProfileContext);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { psw, newPsw, confirmNewPsw } = e.target;
    try {
      if (newPsw.value !== confirmNewPsw.value) throw new Error("Password doesn't match");
      setLoading(true);
      await Request.send({ psw: psw.value, newPsw: newPsw.value }, config.url);
      updateProgress({ error: "" });
      setLoading(false);
      setEditingField("");
    } catch (error) {
      updateProgress({ error: error.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="account psw edit-form">
      <img
        src="/image/x-icon.svg"
        alt="Close edit password form button"
        className="account x-icon img"
        onClick={() => setEditingField("")}
      />

      <input type="password" name="psw" placeholder="Password" required className="f no-line" />
      <input type="password" name="newPsw" placeholder="New Password" required className="no-line" />
      <input
        type="password"
        name="confirmNewPsw"
        placeholder="Confirm New Password"
        required
        className="l no-line"
      />
      <button type="submit" className="no-line">
        {loading && <LoadingIcon />}
        Save
      </button>
    </form>
  );
};

export default EditPSW;

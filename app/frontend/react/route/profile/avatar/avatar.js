import React, { useContext, useState } from "react";
import { getConfig } from "../../../config/config";
import { AppContext } from "../../../store/app-store";
import CustomMessage from "../../../layout/custom-message";
import "./avatar.css";

const ProfileAvatar = ({ setMode }) => {
  const config = getConfig("deleteAvatar");
  const { Request, user, setUser } = useContext(AppContext);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    try {
      const user = await Request.send(null, config.url, config.method);
      setError("");
      setUser(user);
    } catch (error) {
      setError(error.message);
    }
  };

  const initials = <span className="avatar initials">{user.displayName[0]}</span>;
  const avatar = <img src={user.avatarUrl} alt="Profile Avatar" className="profile avatar-img" />;

  return (
    <div className="profile avatar wrapper">
      {error && <CustomMessage name="avatar error" text={error} listener={() => setError("")} />}

      {user.avatarUrl ? avatar : initials}

      <div className="avatar btns">
        {user.avatarUrl && (
          <button type="button" onClick={handleDelete} title="Delete avatar" className="delete no-line">
            Delete
          </button>
        )}
        <button
          type="button"
          onClick={() => setMode("avatar")}
          title="Edit avatar"
          className="edit no-line"
          style={{ textAlign: user.avatarUrl ? "left" : "center" }}>
          Edit
        </button>
      </div>
    </div>
  );
};
export default ProfileAvatar;

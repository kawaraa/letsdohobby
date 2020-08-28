import React, { useState, useContext } from "react";
import { getConfig } from "../../../config/config";
import { AppContext } from "../../../store/app-store";
import EditAvatarPosition from "./edit-avatar-position";
import LoadingIcon from "../../../layout/icon/loading-icon";
import CustomMessage from "../../../layout/custom-message";
import "./edit-avatar.css";

const EditAvatar = ({ setMode }) => {
  const config = getConfig("updateAvatar");
  const { Request, setUser } = useContext(AppContext);
  const [{ loading, error }, setState] = useState({ loading: false, error: "" });
  const [uploadedAvatarUrl, setUploadedAvatarUrl] = useState("");
  const [percentComplete, setPercentComplete] = useState(0);
  const [dimensions, setDimensions] = useState({ x: 0, height: 0, y: 0, width: 0, sameSize: true });

  const handleChange = (e) => {
    setState({ loading: true, error: "" });
    const reader = new FileReader();
    reader.onload = () => setUploadedAvatarUrl(reader.result) + setState({ loading: false, error: "" });
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const xhr = new Request.MultipartRequest();
    Object.keys(dimensions).forEach((key) => form.append(key, dimensions[key]));

    xhr.on("progress", (percentComplete) => setPercentComplete(percentComplete));
    xhr.on("end", (e) => {
      setUser(e.detail);
      setMode("");
      if (!uploadedAvatarUrl) location.reload();
    });
    xhr.on("error", (e) => setState({ loading: false, error: e.detail.message }));
    xhr.uploadForm(form, config.url);

    setState({ loading: true, error: "" }) + setPercentComplete(0);
  };

  return (
    <form className="edit-avatar container" onSubmit={handleSubmit} onChange={handleChange}>
      <div id="edit-avatar-wrapper">
        <EditAvatarPosition setDimensions={setDimensions} src={uploadedAvatarUrl} />
        <label for="upload-avatar" className="no-line" title="Upload new avatar" tabindex="0">
          Upload
          <input type="file" name="avatar" accept="image/*" id="upload-avatar" />
        </label>
        {loading && (
          <div className="edit-avatar loader">
            <LoadingIcon name="edit-avatar" color="#7b95e0" />
            <div className="edit-avatar progress">{percentComplete.toFixed() + "%"}</div>
          </div>
        )}
      </div>

      {error && <CustomMessage text={error} name="error" />}

      <button
        type="submit"
        className={"edit-avatar btn no-line " + (uploadedAvatarUrl ? "" : "disabled")}
        disabled={uploadedAvatarUrl ? false : true}>
        Save
      </button>
      <button onClick={() => setMode("")} type="button" className="edit-avatar btn no-line">
        Cancel
      </button>
    </form>
  );
};

export default EditAvatar;

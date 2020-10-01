import React, { useState, useContext } from "react";
import { getConfig } from "../../../config/config";
import { AppContext } from "../../../store/app-store";
import CustomDate from "../../../utility/custom-date";
import DateAndTimeField from "./date-and-time-field";
import FilePreview from "./file-preview";
import "./create-post-form.css";

const CreatePostForm = (props) => {
  const config = getConfig("createPostForm");
  const { Request, user, updateProgress, setPercentComplete, addPost } = useContext(AppContext);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [state, setState] = useState({ activity: "activity", description: "" });
  const selectedActivity = new RegExp(state.activity, "gi");

  const handleChange = ({ target: { files, name, value } }) => {
    if (!files || !files[0]) return setState({ ...state, [name]: value });
    setUploadedFiles(uploadedFiles.concat([files[0]]));
  };

  const handleRemoveFile = (name) => {
    setUploadedFiles(uploadedFiles.filter((file) => file.name !== name));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const xhr = new Request.MultipartRequest();
    const form = new FormData(e.nativeEvent.target);
    const startAt = new Date();

    startAt.setMonth(form.get("month") - 1);
    startAt.setDate(form.get("day"));
    startAt.setHours(form.get("hour"));
    startAt.setMinutes(form.get("minute"));

    form.append("createdAt", CustomDate.toString(new Date()));
    form.set("startAt", CustomDate.toString(startAt));
    uploadedFiles.forEach((file, i) => form.set("media" + i, file));
    form.delete("month") || form.delete("day") || form.delete("hour") || form.delete("minute");
    form.delete("photoVideo") || form.delete("audio");

    xhr.on("progress", (percentComplete) => setPercentComplete(percentComplete.toFixed()));
    xhr.on("end", ({ detail }) => {
      addPost(detail);
      props.closeForm();
      updateProgress({ loading: false, error: "" });
    });
    xhr.on("error", (e) => updateProgress({ loading: false, error: e.detail.message }));
    xhr.uploadForm(form, config.url);
    updateProgress({ loading: true });
  };

  const getSelectOptionsForParticipants = (option = []) => {
    for (let i = 1; i < config.participants; i += 1) option.push(<option value={i}>{i}</option>);
    return option;
  };

  const isActivity = config.activities.find((act) => selectedActivity.test(act));
  const cssClass = state.description.length > 30 && isActivity ? "" : "disabled";
  const activityOptions = config.activities.map((activity) => <option value={activity}>{activity}</option>);

  return (
    <div className="create-post-container">
      <div className="create-post-inner">
        <form
          onChange={handleChange}
          onSubmit={handleSubmit}
          className="create-post form no-line"
          title="Create post"
          tabIndex="0">
          <h3 className="create-post title no-line" tabIndex="0">
            Create Post
          </h3>

          <img
            src="/image/x-icon.svg"
            alt="Close create post form button"
            className="create-post x-icon img"
            tabIndex="0"
          />

          <div className="create-post user-info">
            <img
              src={user.avatarUrl || "/image/avatar.svg"}
              alt="My Avatar"
              className="create-post avatar img no-line"
            />

            <span className="create-post user-name no-line" title="User name" tabIndex="0">
              {user.displayName}
            </span>
          </div>

          <div className="create-post selects">
            <select name="activity" required className="no-line" title="Activity">
              <option value="activity" selected>
                Activity
              </option>
              {activityOptions}
            </select>

            <select name="participants" required className="no-line" title="Number of participants">
              <option value="0" selected>
                Participants
              </option>
              {getSelectOptionsForParticipants()}
            </select>
            <DateAndTimeField date={new Date(Date.now() + 1000 * 60 * 60)} />
          </div>

          <div className="create-post inputs">
            <div className="create-post description">
              <textarea
                name="description"
                minlength="30"
                maxlength="1500"
                placeholder="Describe how your plan will look like"
                required
                className="create-post textarea no-line"
                title="Description"></textarea>
            </div>
            {uploadedFiles[0] && (
              <div className="create-post uploaded">
                {uploadedFiles.map((file) => (
                  <FilePreview file={file} remove={handleRemoveFile} />
                ))}
              </div>
            )}
          </div>

          <div className="create-post media no-line" title="Media inputs" tabIndex="0">
            <p className="create-post media-title">Add to your post</p>
            <label
              for="photo"
              className="create-post media-label no-line"
              title="Upload photo/video"
              tabIndex="0">
              <img src="/image/media-image-icon.png" className="create-post media-img" />
              <input type="file" name="photoVideo" accept="image/*, video/*" id="photo" />
            </label>
          </div>

          <button
            type="submit"
            disabled={cssClass === "disabled"}
            className={"create-post submit no-line " + cssClass}
            title="Create post">
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostForm;

import React from "react";
import { config } from "../../../config/config";
import Request from "../../../utility/request";
import CustomDate from "../../../utility/custom-date";
import XIcon from "../../../layout/icon/x-icon";
import Avatar from "../../../layout/icon/avatar";
import DateAndTimeField from "./date-and-time-field";
import FilePreview from "./file-preview";
import LoadingScreen from "../../../layout/icon/loading-screen";
import CustomMessage from "../../../layout/custom-message";
import "./create-post-form.css";

class CreatePostForm extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.handleChange.bind(this);
    this.onSubmit = this.handleSubmit.bind(this);
    this.removeFile = this.handleRemoveFile.bind(this);
    this.config = config("createPostForm");
    this.state = {
      loading: false,
      error: "",
      percentComplete: 0,
      files: [],
      description: "",
      activity: "activity",
    };
  }

  handleChange({ target } = e) {
    if (!target.files || !target.files[0]) return this.setState({ [target.name]: target.value });
    this.setState({ files: this.state.files.concat([target.files[0]]) });
    target.value = "";
  }

  handleRemoveFile(name) {
    this.setState({ files: this.state.files.filter((file) => file.name !== name) });
  }
  handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.nativeEvent.target);
    const select = new RegExp(e.target.activity.value, "gi");
    const startAt = new Date();

    if (!this.config.activities.find((act) => select.test(act))) {
      return this.setState({ error: "Please select activity" });
    }
    startAt.setMonth(form.get("month") - 1);
    startAt.setDate(form.get("day"));
    startAt.setHours(form.get("hour"));
    startAt.setMinutes(form.get("minute"));

    form.append("createdAt", CustomDate.toString(new Date()));
    form.set("startAt", CustomDate.toString(startAt));
    this.state.files.forEach((file, i) => form.set("media" + i, file));
    form.delete("month") || form.delete("day") || form.delete("hour") || form.delete("minute");
    form.delete("photoVideo") || form.delete("audio");

    const xhr = new Request.MultipartRequest();
    xhr.on("progress", (percentComplete) => this.setState({ percentComplete }));
    xhr.on("end", (e) => {
      window.dispatchEvent(new CustomEvent("ADD_NEW_POST", { detail: e.detail }));
      this.props.closeForm();
    });
    xhr.on("error", (e) => this.setState({ loading: false, error: e.detail.message }));
    xhr.uploadForm(form, this.config.url);
    this.setState({ loading: true });
  }

  getSelectOptionsForParticipants() {
    const option = [];
    for (let i = 1; i < this.config.participants; i += 1) {
      option.push(<option value={i}>{i}</option>);
    }
    return option;
  }

  render() {
    const { loading, error, percentComplete, files } = this.state;
    const selectedActivity = new RegExp(this.state.activity, "gi");
    const isActivity = this.config.activities.find((act) => selectedActivity.test(act));
    const isDisabled = this.state.description.length > 30 && isActivity ? " " : "disabled";
    const active = isDisabled.length > 5 ? true : false;
    if (loading) return <LoadingScreen text={percentComplete + "%"} />;

    return (
      <div className="create-post container">
        <form
          onChange={this.onChange}
          onSubmit={this.onSubmit}
          className="create-post form no-line"
          title="Create post"
          tabindex="0"
        >
          <h3 className="create-post title no-line" tabindex="0">
            Create Post
          </h3>
          <XIcon name="create-post" />

          <div className="create-post user-info">
            <Avatar name="create-post" />
            <span className="create-post user-name no-line" title="User name" tabindex="0">
              {window.user.displayName}
            </span>
          </div>

          {error && <CustomMessage text={error} name="error" />}

          <div className="create-post selects">
            <select name="activity" required className="no-line" title="Activity">
              <option value="activity" selected>
                Activity
              </option>
              {this.config.activities.map((a) => (
                <option value={a}>{a}</option>
              ))}
            </select>

            <select name="participants" required className="no-line" title="Number of participants">
              <option value="0" selected>
                Participants
              </option>
              {this.getSelectOptionsForParticipants()}
            </select>
            <DateAndTimeField />
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
                title="Description"
              ></textarea>
            </div>
            {files[0] && (
              <div className="create-post uploaded">
                {files.map((file) => (
                  <FilePreview file={file} close={this.removeFile} />
                ))}
              </div>
            )}
          </div>

          <div className="create-post media no-line" title="Media inputs" tabindex="0">
            <p className="create-post media-title">Add to your post</p>
            <label
              for="photo"
              className="create-post media-label no-line"
              title="Upload photo/video"
              tabindex="0"
            >
              <img src="/image/media-image-icon.png" className="create-post media-img" />
              <input type="file" name="photoVideo" accept="image/*, video/*" id="photo" />
            </label>
          </div>

          <button
            type="submit"
            disabled={active}
            className={"create-post submit no-line " + isDisabled}
            title="Create post"
          >
            Post
          </button>
        </form>
      </div>
    );
  }
}

export default CreatePostForm;

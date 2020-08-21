import React from "react";
import { getConfig } from "../../../config/config";
import Request from "../../../utility/request";
import EditAvatarPosition from "./edit-avatar-position";
import LoadingIcon from "../../../layout/icon/loading-icon";
import CustomMessage from "../../../layout/custom-message";
import "./edit-avatar.css";

class EditAvatar extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.handleChange.bind(this);
    this.onSubmit = this.handleSubmit.bind(this);
    this.onCancel = this.handleCancel.bind(this);
    this.onSetDimensions = this.handleSetDimensions.bind(this);
    this.config = config("updateAvatar");
    this.state = {
      loading: false,
      error: "",
      percentComplete: 0,
      uploadedAvatarUrl: "",
      dimensions: { x: 0, height: 0, y: 0, width: 0, sameSize: true },
    };
  }

  handleChange(e) {
    this.setState({ loading: true });
    const reader = new FileReader();
    reader.onload = () => this.setState({ loading: false, uploadedAvatarUrl: reader.result });
    reader.readAsDataURL(e.target.files[0]);
  }
  handleCancel() {
    this.props.changeMode({ editField: "" });
  }
  handleSetDimensions(dimensions) {
    this.setState({ dimensions });
  }
  handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const xhr = new Request.MultipartRequest();
    Object.keys(this.state.dimensions).forEach((key) => form.append(key, this.state.dimensions[key]));

    xhr.on("progress", (percentComplete) => this.setState({ percentComplete }));
    xhr.on("end", (e) => {
      window.dispatchEvent(new CustomEvent("UPDATE_APP", { detail: { user: e.detail } }));
      if (!this.state.uploadedAvatarUrl) location.reload();
      this.handleCancel();
    });
    xhr.on("error", (e) => this.setState({ loading: false, error: e.detail.message }));
    this.setState({ loading: true, percentComplete: 0 });
    xhr.uploadForm(form, this.config.url);
  }

  render() {
    const { loading, error, percentComplete, uploadedAvatarUrl } = this.state;

    return (
      <form className="edit-avatar container" onSubmit={this.onSubmit} onChange={this.onChange}>
        <div id="edit-avatar-wrapper">
          <EditAvatarPosition setDimensions={this.onSetDimensions} src={uploadedAvatarUrl} />
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
        <button type="submit" className="edit-avatar btn">
          Save
        </button>
        <button type="button" className="edit-avatar btn" onClick={this.onCancel}>
          Cancel
        </button>
      </form>
    );
  }
}

export default EditAvatar;

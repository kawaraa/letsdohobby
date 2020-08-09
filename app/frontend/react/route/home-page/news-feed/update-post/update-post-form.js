import React from "react";
import { config } from "../../../../config/config";
import Request from "../../../../utility/request";
import CustomDate from "../../../../utility/custom-date";
import DateAndTimeField from "../../create-post-form/date-and-time-field";
import XIcon from "../../../../layout/icon/x-icon";
import LoadingScreen from "../../../../layout/icon/loading-screen";
import CustomMessage from "../../../../layout/custom-message";
import "./update-post-form.css";

class UpdatePostForm extends React.Component {
  constructor(props) {
    super(props);
    this.config = config("updatePost");
    this.onChange = this.handleChange.bind(this);
    this.onSubmit = this.handleSubmit.bind(this);
    this.close = this.closeErrorMessage.bind(this);
    this.state = { loading: true, error: "", active: false };
  }

  handleChange({ target } = e) {
    const active = this.state.description.length > 30 ? true : false;
    this.setState({ [target.name]: target.value, active });
  }
  async handleSubmit(e) {
    e.preventDefault();
    const { id, participants, description } = this.state;
    const form = new FormData(e.target);
    const d = new Date();
    let startAt = `${form.get("month")}-${form.get("day")} ${form.get("hour")}:${form.get("minute")}`;
    startAt = d.getFullYear() + "-" + startAt;
    const data = { id, participants, description, todayDate: CustomDate.toString(d), startAt };
    try {
      this.setState({ loading: true });
      const post = await Request.send(data, this.config.url, this.config.method);
      window.dispatchEvent(new CustomEvent("UPDATE_POST", { detail: post }));
      window.dispatchEvent(new CustomEvent("SHOW_HIDE_UPDATE_POST_FORM", { detail: "update-post x-icon" }));
    } catch (error) {
      this.setState({ loading: false, error: error.message });
    }
  }
  closeErrorMessage() {
    this.setState({ error: "" });
  }

  getSelectOptionsForParticipants(selectedParticipants) {
    const option = [<option value="0">Open</option>];
    for (let i = 1; i < this.config.participants; i += 1) {
      let item = (
        <option value={i} selected>
          {i}
        </option>
      );
      if (i !== selectedParticipants) item = <option value={i}>{i}</option>;
      option.push(item);
    }
    return option;
  }
  componentDidMount() {
    this.setState({ loading: false, ...this.props.post });
  }

  render() {
    const { error, active, owner, activity, participants, description, startAt, createdAt } = this.state;
    if (this.state.loading) return <LoadingScreen />;

    return (
      <div className="update-post-container">
        <div className="update-post-inner">
          <form className="update-post form no-line" onSubmit={this.onSubmit} onChange={this.onChange}>
            <h3 className="update-post title no-line" tabindex="0">
              Update Post
            </h3>
            <XIcon name="update-post" />
            <header className="update-post header no-line" title="Post Header owner info" tabindex="0">
              <div className="update-post avatar link no-line" title="My avatar">
                <img
                  src={window.user.avatarUrl || "/image/avatar.svg"}
                  alt="My Avatar"
                  className="update-post avatar img"
                />
              </div>
              <div className="update-post activity-owner-box">
                <span className="update-post owner-name no-line" title="Owner name">
                  {owner.displayName}
                </span>
                <img
                  src="/image/triangle-right-arrow.svg"
                  alt="Pointing to"
                  className="update-post triangle-right-arrow"
                />
                <p className="update-post activity no-line" title="Activity">
                  {activity}
                </p>
              </div>
              <time className="update-post created-at">{CustomDate.toText(createdAt)}</time>
            </header>

            {error && <CustomMessage text={error} name="create-post error" listener={this.close} />}

            <div className="update-post selects">
              <div className="selects row">
                <label for="participants">Participants</label>
                <select name="participants" required className="no-line">
                  {this.getSelectOptionsForParticipants(participants)}
                </select>
              </div>
              <div className="selects row">
                <label for="date-time">Date</label>
                <DateAndTimeField defaultDate={new Date(startAt)} />
              </div>
            </div>

            <div className="update-post description">
              <textarea
                defaultValue={description}
                name="description"
                minlength="30"
                maxlength="1500"
                className="no-line"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className={"update-post submit " + (active ? "" : "disabled")}
              disabled={!active}
            >
              Save
            </button>
          </form>
        </div>
      </div>
    );
  }
}
export default UpdatePostForm;

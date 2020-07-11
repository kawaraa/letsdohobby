import React from "react";
import { config } from "../../../../config/config";
import Request from "../../../../utility/request";
import CustomDate from "../../../../utility/custom-date";
import Avatar from "../../../../layout/icon/avatar";
import DateAndTimeField from "../../create-post-form/date-and-time-field";
import XIcon from "../../../../layout/icon/x-icon";
import ArrowIcon from "../../../../layout/icon/arrow-icon";
import LoadingScreen from "../../../../layout/icon/loading-screen";
import "./update-post-form.css";

class UpdatePostForm extends React.Component {
  constructor(props) {
    super(props);
    this.config = config("updatePost");
    this.onChange = this.handleChange.bind(this);
    this.onSubmit = this.handleSubmit.bind(this);
    this.state = { loading: true, error: "", post: {} };
  }

  handleChange({ target } = e) {
    this.setState({ [target.name]: target.value });
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
    this.setState({ loading: false, post: this.props.post });
  }

  render() {
    let { loading, error, post } = this.state,
      isDisabled = "disabled",
      active = true;
    post.description && post.description.length > 30 ? (isDisabled = "") : (active = false);

    if (loading) return <LoadingScreen />;

    return (
      <div className="update-post container">
        <form className="update-post form no-line" onSubmit={this.onSubmit} onChange={this.onChange}>
          <header className="update-post header no-line" title="Post Header owner info" tabindex="0">
            <Avatar src={post.owner.avatarUrl} name="owner" />

            <div className="update-post activity-owner-box">
              <span className="update-post owner-name no-line" title="Owner name">
                {post.owner.displayName}
              </span>
              <ArrowIcon name="update-post" />
              <p className="update-post activity no-line" title="Activity">
                {post.activity}
              </p>
            </div>
            <XIcon name="update-post" />
          </header>

          <time className="post created-at">{CustomDate.toText(post.createdAt)}</time>
          {error && <CustomMessage text={error} name="error" />}

          <div className="update-post selects">
            <label for="participants">Participants</label>
            <select name="participants" required className="no-line">
              {this.getSelectOptionsForParticipants(post.participants)}
            </select>

            <label for="date-time">Date</label>
            <DateAndTimeField defaultDate={new Date(post.startAt)} />
          </div>

          <div className="update-post description">
            <textarea
              defaultValue={post.description}
              name="description"
              minlength="30"
              maxlength="1500"
              className="no-line"
              required
            ></textarea>
          </div>

          <button type="submit" className={"update-post submit " + isDisabled} disabled={active}>
            Update
          </button>
        </form>
      </div>
    );
  }
}
export default UpdatePostForm;

import React, { useContext, useState, useEffect } from "react";
import { getConfig } from "../../../../config/config";
import { AppContext } from "../../../../store/app-store";
import CustomDate from "../../../../utility/custom-date";
import DateAndTimeField from "../../create-post-form/date-and-time-field";
import CustomMessage from "../../../../layout/custom-message";
import "./update-post-form.css";

const UpdatePostForm = ({ post: { id, owner, activity, participants, startAt, description, createdAt } }) => {
  const config = getConfig("updatePost");
  const { Request, user, updateProgress, updatePost, setEditingPost } = useContext(AppContext);
  const [describe, setDescribe] = useState(description);

  const handleChange = ({ target: { name, value } }) => name === "description" && setDescribe(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { month, day, hour, minute, participants } = e.target;
    const date = new Date();
    const startAt = `${date.getFullYear()}-${month.value}-${day.value} ${hour.value}:${minute.value}`;
    const todayDate = CustomDate.toString(date);
    const data = { id, participants: participants.value, description: describe, todayDate, startAt };

    try {
      updateProgress({ loading: true });
      const post = await Request.send(data, config.url, config.method);
      updatePost(post);
      setEditingPost("");
      updateProgress({ loading: false, error: "" });
    } catch (error) {
      updateProgress({ loading: false, error: error.message });
    }
  };

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if (/update-post x-icon|update-post-container/gm.test(e.target.className)) setEditingPost("");
    });
  }, []);

  const getSelectOptionsForParticipants = (selectedParticipants) => {
    const option = [<option value="0">Open</option>];
    for (let i = 1; i < config.participants; i += 1) {
      let item = (
        <option value={i} selected>
          {i}
        </option>
      );
      if (i !== selectedParticipants) item = <option value={i}>{i}</option>;
      option.push(item);
    }
    return option;
  };

  return (
    <div className="update-post-container">
      <div className="update-post-inner">
        <form className="update-post form no-line" onSubmit={handleSubmit} onChange={handleChange}>
          <h3 className="update-post title no-line" tabindex="0">
            Update Post
          </h3>

          <img
            src="/image/x-icon.svg"
            alt="Close update post form button"
            className="update-post x-icon img"
          />

          <header className="update-post header no-line" title="Post Header owner info" tabindex="0">
            <img
              src={user.avatarUrl || "/image/avatar.svg"}
              alt="My Avatar"
              className="update-post avatar img no-line"
            />

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

          <div className="update-post selects">
            <div className="selects row">
              <label for="participants">Participants</label>
              <select name="participants" required className="no-line">
                {getSelectOptionsForParticipants(participants)}
              </select>
            </div>
            <div className="selects row">
              <label for="date-time">Date</label>
              <DateAndTimeField date={new Date(startAt)} />
            </div>
          </div>

          <div className="update-post description">
            <textarea
              defaultValue={describe}
              name="description"
              minlength="30"
              maxlength="1500"
              className="no-line"
              required></textarea>
          </div>

          <button
            type="submit"
            className={"update-post submit " + (description.length > 30 ? "" : "disabled")}
            disabled={description.length <= 30}>
            Save
          </button>
        </form>
      </div>
    </div>
  );
};
export default UpdatePostForm;

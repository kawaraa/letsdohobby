import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getConfig } from "../../config/config";
import Request from "../../utility/request";
import CustomDate from "../../utility/custom-date";
import Media from "../home-page/news-feed/post/media";
import MemberName from "./member-info";
import LoadingScreen from "../../layout/icon/loading-screen";
import CustomMessage from "../../layout/custom-message";
import "./post-detail.css";

const PostDetail = (props) => {
  const config = getConfig("postDetail");
  const [{ loading, error }, setState] = useState({ loading: true, error: "" });
  const [postDetails, setPostDetails] = useState({});

  const fetchPostDetails = async () => {
    try {
      const postDetails = await Request.fetch(config.url + props.match.params.id);
      setPostDetails(postDetails);
      setState({ loading: false, error: "" });
    } catch (error) {
      setState({ loading: false, error: error.message });
    }
  };
  useEffect(() => {
    fetchPostDetails();
  }, []);

  if (loading) return <LoadingScreen />;
  if (error) return <CustomMessage text={error} name="error" />;
  const { id, owner, activity, participants, startAt, distance, members, mediaUrls } = postDetails;

  return (
    <div className="outer-container">
      <main className="container no-line" title="Post details" tabindex="0">
        <div className="post-details wrapper">
          <header className="post-details header no-line" title="Post Header owner info" tabindex="0">
            <Link
              to={"/member/" + owner.id}
              className="post-details avatar link no-line"
              title="Owner avatar">
              <img
                src={owner.avatarUrl || "/image/avatar.svg"}
                alt="post-details avatar"
                className="post-details avatar img"
              />
            </Link>

            <div className="post-details activity-owner">
              <Link to={"/member/" + owner.id} className="post-details owner-name no-line" title="Owner name">
                {owner.displayName}
              </Link>
              <img
                src="/image/triangle-right-arrow.svg"
                alt="Pointing to"
                className="post-details triangle-right-arrow"
              />
              <Link to={"/posts/" + id} className="post-details activity no-line" title="Activity">
                {activity}
              </Link>

              <time className="post-details created-at no-line" title="Creation date" tabindex="0">
                {CustomDate.toText(postDetails.createdAt)}
              </time>
            </div>
          </header>

          <div className="post-details event">
            <p className="post-details participants no-line" title="Number of participants" tabindex="0">
              {participants} Participants
            </p>
            <time className="post-details date no-line" title="Event date" tabindex="0">
              {CustomDate.toText(startAt)}
            </time>
          </div>

          <article className="post-details description no-line" title="Description" tabindex="0">
            {postDetails.description}
          </article>

          {mediaUrls[0] && (
            <aside className="post-details media no-line" title="Post media attachments" tabindex="0">
              {mediaUrls.map((url) => (
                <Media url={url} />
              ))}
            </aside>
          )}

          <span className="post distance" title="Distance" tabindex="0">
            <img src="/image/location.svg" alt="Location Distance" className="post location-img" />
            {distance.length + " " + distance.unit}
          </span>
        </div>

        {members[0] && (
          <ul className="post-details member-list" title="Members List" tabindex="0">
            <h3 className="member-list header">{members.length} Members joined</h3>
            {members.map((member) => (
              <MemberName member={member} />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default PostDetail;

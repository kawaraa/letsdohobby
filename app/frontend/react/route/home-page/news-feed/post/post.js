import React from "react";
import { Link } from "react-router-dom";
import CustomDate from "../../../../utility/custom-date";
import UserOptions from "./user-options";
import MemberOptions from "./member-options";
import Media from "./media";
import "./post.css";

const Post = ({ post, index, isOwner }) => {
  return (
    <article className="post card no-line" title="Post card" tabindex="0">
      <header className="post header no-line" title="Post Header owner info" tabindex="0">
        <Link to={"/member/" + post.owner.id} className="post avatar link no-line" title="Owner avatar">
          <img
            src={post.owner.avatarUrl || "/image/avatar.svg"}
            alt="Post owner avatar"
            className="post avatar img"
          />
        </Link>
        <div className="post activity-owner">
          <Link to={"/member/" + post.owner.id} className="post owner-name no-line" title="Owner name">
            {post.owner.displayName}
          </Link>
          <img
            src="/image/triangle-right-arrow.svg"
            alt="Pointing to"
            className="post triangle-right-arrow"
          />

          <Link to={"/posts/" + post.id} className="post activity no-line" title="Activity">
            {post.activity}
          </Link>
          <time className="post created-at no-line" title="Created date" tabindex="0">
            {CustomDate.toText(post.createdAt)}
          </time>
        </div>

        {isOwner ? <UserOptions post={post} /> : <MemberOptions post={post} />}
      </header>

      <div className="post event">
        <p className="event participants no-line" title="Number of participants" tabindex="0">
          {Number.parseInt(post.participants) < 1 ? "Unlimited" : post.participants + " Participants"}
        </p>
        <time className="event date no-line" title="Event date" tabindex="0">
          {CustomDate.toText(post.startAt)}
        </time>
      </div>
      <p className="post description no-line" title="Description" tabindex="0">
        {post.description}
      </p>
      {post.mediaUrls[0] && (
        <aside className="post media no-line" title="Post media attachments" tabindex="0">
          {post.mediaUrls.map((url) => (
            <Media url={url} />
          ))}
        </aside>
      )}
      <span className="post members" title="Members" tabindex="0">
        {post.members}

        <img src="/image/members.svg" alt="Activity members" className="post members-img" />
      </span>
      <span className="post distance" title="Distance" tabindex="0">
        <img src="/image/location.svg" alt="Location Distance" className="post location-img" />
        {post.distance.length + " " + post.distance.unit}
      </span>
    </article>
  );
};

export default Post;

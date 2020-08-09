import React from "react";
import { Link } from "react-router-dom";
import { config } from "../../config/config";
import Request from "../../utility/request";
import CustomDate from "../../utility/custom-date";
import Media from "../home-page/news-feed/post/media";
import MemberName from "./member-info";
import LoadingScreen from "../../layout/icon/loading-screen";
import CustomMessage from "../../layout/custom-message";
import "./post-detail.css";

class PostDetail extends React.Component {
  constructor(props) {
    super(props);
    this.config = config("postDetail");
    this.state = { loading: true };
  }

  async componentDidMount() {
    try {
      const postDetail = await Request.fetch(this.config.url + this.props.match.params.id);
      this.setState({ ...postDetail, loading: false });
      console.log(postDetail);
    } catch (error) {
      this.setState({ message: error.message, loading: false });
    }
  }
  render() {
    const { loading, error, id, owner, activity, participants, startAt, distance } = this.state;
    if (loading) return <LoadingScreen />;
    if (error) return <CustomMessage text={error} name="error" />;

    return (
      <div className="outer-container">
        <main className="container no-line" title="Post details" tabindex="0">
          <div className="post-details wrapper">
            <header className="post-details header no-line" title="Post Header owner info" tabindex="0">
              <Link
                to={"/member/" + owner.id}
                className="post-details avatar link no-line"
                title="Owner avatar"
              >
                <img
                  src={owner.avatarUrl || "/image/avatar.svg"}
                  alt="post-details avatar"
                  className="post-details avatar img"
                />
              </Link>

              <div className="post-details activity-owner">
                <Link
                  to={"/member/" + owner.id}
                  className="post-details owner-name no-line"
                  title="Owner name"
                >
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
                  {CustomDate.toText(this.state.createdAt)}
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
              {this.state.description}
            </article>

            {this.state.mediaUrls[0] && (
              <aside className="post-details media no-line" title="Post media attachments" tabindex="0">
                {this.state.mediaUrls.map((url) => (
                  <Media url={url} />
                ))}
              </aside>
            )}

            <span className="post distance" title="Distance" tabindex="0">
              <img src="/image/location.svg" alt="Location Distance" className="post location-img" />
              {distance.length + " " + distance.unit}
            </span>
          </div>

          {this.state.members[0] && (
            <ul className="post-details member-list" title="Members List" tabindex="0">
              <h3 className="member-list header">{this.state.members.length} Members joined</h3>
              {this.state.members.map((member) => (
                <MemberName member={member} />
              ))}
            </ul>
          )}
        </main>
      </div>
    );
  }
}

export default PostDetail;

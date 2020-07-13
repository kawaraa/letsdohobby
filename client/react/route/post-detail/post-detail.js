import React from "react";
import { Link } from "react-router-dom";
import { config } from "../../config/config";
import Request from "../../utility/request";
import CustomDate from "../../utility/custom-date";
import Avatar from "../../layout/icon/avatar";
import ArrowIcon from "../../layout/icon/arrow-icon";
import Media from "../home-page/news-feed/post/media";
import MemberName from "./member-name";
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
    } catch (error) {
      this.setState({ message: error.message, loading: false });
    }
  }
  render() {
    const { loading, error, id, owner, participants, startAt, mediaUrls, members } = this.state;
    if (loading) return <LoadingScreen />;
    if (error) return <CustomMessage text={error} name="error" />;

    return (
      <div className="outer-container">
        <main className="post-details container no-line" title="Post details" tabindex="0">
          <header className="post-details header no-line" title="Post Header owner info" tabindex="0">
            <Link
              to={"/member/" + owner.id}
              className="post-details avatar-link no-line"
              title="Owner avatar"
            >
              <Avatar src={owner.avatarUrl} name="post-details" />
            </Link>

            <div className="post-details activity-owner">
              <Link to={"/member/" + owner.id} className="post-details owner-name no-line" title="Owner name">
                {owner.displayName}
              </Link>
              <ArrowIcon name="post-details" />
              <Link to={"/posts/" + id} className="post-details activity no-line" title="Activity">
                {this.state.activity}
              </Link>
            </div>

            <time className="post-details creation-date no-line" title="Creation date" tabindex="0">
              {CustomDate.toText(this.state.createdAt)}
            </time>
          </header>
          {this.state.error && <CustomMessage text={this.state.error} name="error" />}

          <div className="post-details event">
            <p className="post-details participant no-line" title="Number of participants" tabindex="0">
              <span className="post-details participants-counter">{participants}</span> Participants
            </p>
            <time className="post-details date no-line" title="Event date" tabindex="0">
              {CustomDate.toText(startAt)}
            </time>
          </div>
          <article className="post-details description no-line" title="Description" tabindex="0">
            {this.state.description}
          </article>
          {mediaUrls[0] && (
            <aside className="post-details media no-line" title="Post media attachments" tabindex="0">
              {mediaUrls.map((url) => (
                <Media url={url} />
              ))}
            </aside>
          )}
          {members[0] && (
            <ul className="post-details members" title="Distance" tabindex="0">
              {members.map((member) => (
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

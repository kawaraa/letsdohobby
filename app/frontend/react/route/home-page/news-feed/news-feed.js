import React from "react";
import { getConfig } from "../../../config/config";
import AppContext from "../../../store/app-store";
import Request from "../../../utility/request";
import Post from "./post/post";
import UpdatePostForm from "./update-post/update-post-form";
import LoadingScreen from "../../../layout/icon/loading-screen";
import CustomMessage from "../../../layout/custom-message";
import "./news-feed.css";

// const { Request } = useContext(AppContext);

class NewsFeed extends React.Component {
  constructor(props) {
    super(props);
    this.refresh = this.refreshNewsFeeds.bind(this);
    this.config = getConfig("newsFeed");
    this.state = { loading: false, error: "", limit: 20, offset: 0, posts: [], editPost: -1, topBtn: false };
  }

  showHideUpdatePost({ detail } = e) {
    if (typeof detail === "number") return this.setState({ editPost: detail });
    if (/update-post x-icon|update-post-container/gm.test(detail)) this.setState({ editPost: -1 });
  }
  addNewPost({ detail } = e) {
    const { posts } = this.state;
    posts.splice(0, 0, detail);
    this.setState({ posts });
  }
  updatePost({ detail } = e) {
    const { posts } = this.state;
    const index = posts.findIndex((post) => post.id === detail.id);
    Object.keys(posts[index]).forEach((k) => (posts[index][k] = detail[k]));
    this.setState({ posts });
  }
  removePost({ detail } = e) {
    const { posts } = this.state;
    this.setState({ posts: posts.filter((p) => p.id !== detail) });
  }
  async handleScrollEvent() {
    const { limit, offset } = this.state;
    const { scrollTop, offsetHeight } = document.documentElement;
    scrollTop > 400 ? this.setState({ topBtn: true }) : this.setState({ topBtn: false });
    if (window.innerHeight + scrollTop !== offsetHeight) return;
    try {
      this.setState({ loading: false });
      const p = await Request.fetch(this.config.url + `?limit=${limit}&offset=${offset}`);
      const posts = this.state.posts.concat(p);
      this.setState({ posts, loading: false, limit: limit + 20, offset: limit, error: "" });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  }
  async refreshNewsFeeds() {
    try {
      window.scrollTo(0, 0);
      this.setState({ loading: true });
      const posts = await Request.fetch(this.config.url + `?limit=${20}&offset=${0}`);
      this.setState({ posts, loading: false, error: "", limit: 40, offset: 20 });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  }

  componentDidMount() {
    this.refreshNewsFeeds();
    window.addEventListener("SHOW_HIDE_UPDATE_POST_FORM", this.showHideUpdatePost.bind(this));
    window.addEventListener("ADD_NEW_POST", this.addNewPost.bind(this));
    window.addEventListener("UPDATE_POST", this.updatePost.bind(this));
    window.addEventListener("REMOVE_POST", this.removePost.bind(this));
    window.onscroll = this.handleScrollEvent.bind(this);
  }

  getToTheTopButton() {
    return (
      <button type="button" onClick={this.refresh} className="to-the-top no-line" title="Scroll to the top">
        <img src="image/arrow-up.png" className="to-the-top img" />
      </button>
    );
  }

  render() {
    const { loading, error, posts, editPost, topBtn } = this.state;

    if (loading) return <LoadingScreen />;
    if (error) return <CustomMessage text={error} name="error" />;
    if (!posts || !posts[0]) return <CustomMessage text={this.config.message} name="no-items" />;

    const list = posts.map((post, i) => <Post post={post} key={i} i={i} />);
    return (
      <section className="news-feed wrapper" title="News feeds" tabindex="0">
        {list}
        {editPost > -1 && <UpdatePostForm post={posts[editPost]} />}
        {topBtn && this.getToTheTopButton()}
      </section>
    );
  }
}

export default NewsFeed;

import React from "react";
import { getConfig } from "../../config/config";
import Request from "../../utility/request";
import Post from "../home-page/news-feed/post/post";
import UpdatePostForm from "../home-page/news-feed/update-post/update-post-form";
import LoadingScreen from "../../layout/icon/loading-screen";
import CustomMessage from "../../layout/custom-message";

class MyPosts extends React.Component {
  constructor(props) {
    super(props);
    this.config = config("myPosts");
    this.state = { loading: false, error: "", editPost: -1, posts: [] };
  }

  showHideUpdatePost({ detail } = e) {
    if (typeof detail === "number") return this.setState({ editPost: detail });
    if (/update-post x-icon|update-post container/gm.test(detail)) this.setState({ editPost: -1 });
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
    posts.splice(detail, 1);
    this.setState({ posts });
  }

  async componentDidMount() {
    try {
      this.setState({ loading: true });
      const posts = await Request.fetch(this.config.url, this.config.method);
      this.setState({ posts, loading: false });
    } catch (error) {
      this.setState({ loading: false, error: error.message });
    }
    window.addEventListener("SHOW_HIDE_UPDATE_POST_FORM", this.showHideUpdatePost.bind(this));
    window.addEventListener("ADD_NEW_POST", this.addNewPost.bind(this));
    window.addEventListener("UPDATE_POST", this.updatePost.bind(this));
    window.addEventListener("REMOVE_POST", this.removePost.bind(this));
  }

  render() {
    const { loading, error, posts, editPost } = this.state;
    if (!posts || !posts[0]) return "";
    if (loading) return <LoadingScreen />;
    if (error) return <CustomMessage text={error} name="error" />;
    if (!posts || !posts[0]) return <CustomMessage text={this.config.message} name="no-items" />;

    return (
      <main className="my-posts wrapper no-line" title="My posts" tabindex="0">
        {editPost >= 0 && <UpdatePostForm post={posts[editPost]} />}
        {posts.map((post, i) => (
          <Post post={post} key={i} i={i} />
        ))}
      </main>
    );
  }
}

export default MyPosts;

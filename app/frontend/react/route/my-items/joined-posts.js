import React, { useContext, useState, useEffect } from "react";
import { getConfig } from "../../config/config";
import { AppContext } from "../../store/app-store";
import Post from "../home-page/news-feed/post/post";
import LoadingScreen from "../../layout/icon/loading-screen";
import CustomMessage from "../../layout/custom-message";

const JoinedPosts = (props) => {
  const config = getConfig("joinedPosts");
  const { Request, user, posts, setPosts } = useContext(AppContext);
  const [{ loading, error }, setState] = useState({ loading: true, error: "" });

  const fetchJoinedPost = async () => {
    try {
      const posts = await Request.fetch(config.url, config.method);
      setPosts(posts);
      setState({ loading: false, error: "" });
    } catch (error) {
      setState({ loading: false, error: error.message });
    }
  };

  useEffect(() => {
    fetchJoinedPost();
  }, []);

  if (loading) return <LoadingScreen />;
  if (error) return <CustomMessage text={error} name="error" />;
  if (!posts || !posts[0]) return <CustomMessage text={config.message} name="no-items" />;

  return (
    <main className="joined-posts wrapper no-line" title="Posts you joined" tabindex="0">
      {posts.map((post, i) => (
        <Post post={post} key={i} isOwner={user.id === post.owner.id} />
      ))}
    </main>
  );
};

export default JoinedPosts;

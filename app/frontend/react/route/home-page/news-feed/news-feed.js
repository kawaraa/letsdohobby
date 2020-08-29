import React, { useState, useEffect, useContext } from "react";
import { getConfig } from "../../../config/config";
import { AppContext } from "../../../store/app-store";
import Post from "./post/post";
import CustomMessage from "../../../layout/custom-message";
import "./news-feed.css";

const NewsFeed = (props) => {
  const config = getConfig("newsFeed");
  const { Request, updateProgress, user, posts, setPosts } = useContext(AppContext);
  const [{ limit, offset }, setLimit] = useState({ limit: 20, offset: 0 });
  const [topBtn, setTopBtn] = useState(false);

  const fetchNewsFeeds = async (limit, offset) => {
    try {
      updateProgress({ loading: true, error: "" });
      const newPosts = await Request.fetch(config.url + `?limit=${limit}&offset=${offset}`);
      setPosts([...posts, ...newPosts]);
      setLimit({ limit: limit + 20, offset: limit });
      updateProgress({ loading: false, error: "" });
    } catch (error) {
      updateProgress({ loading: false, error: error.message });
    }
  };

  const handleScrollEvent = async () => {
    const { scrollTop, offsetHeight } = document.documentElement;
    scrollTop > 400 ? setTopBtn(true) : setTopBtn(false);
    if (window.innerHeight + scrollTop !== offsetHeight) return;
    fetchNewsFeeds(limit, offset);
  };

  const refreshNewsFeeds = async () => setPosts([]) + fetchNewsFeeds(20, 0) + window.scrollTo(0, 0);

  useEffect(() => {
    refreshNewsFeeds();
    window.addEventListener("scroll", handleScrollEvent);
    return () => window.removeEventListener("scroll", handleScrollEvent);
  }, []);

  if (!posts || !posts[0]) return <CustomMessage text={config.message} name="no-items" />;

  return (
    <section className="news-feed wrapper" title="News feeds" tabindex="0">
      {posts.map((post, i) => (
        <Post post={post} key={i} index={i} isOwner={user.id === post.owner.id} />
      ))}

      {topBtn && (
        <button
          type="button"
          onClick={refreshNewsFeeds}
          className="to-the-top no-line"
          title="Scroll to the top">
          <img src="image/arrow-up.png" className="to-the-top img" />
        </button>
      )}
    </section>
  );
};

export default NewsFeed;

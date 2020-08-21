import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../store/app-store";
import CreatePostForm from "./create-post-form/create-post-form";
import NewsFeed from "./news-feed/news-feed";
import LoadingScreen from "../../layout/icon/loading-screen";
import CustomMessage from "../../layout/custom-message";
import "./home-page.css";

const HomePage = (props) => {
  const [showForm, setShowForm] = useState(false);
  const { user, location, showMessage } = useContext(AppContext);

  useEffect(() => {
    window.addEventListener("click", ({ target } = e) => {
      if (/create-post button/gim.test(target.className)) return setShowForm(true);
      else if (/create-post x-icon|container/gm.test(target.className)) setShowForm(false);
    });
  }, []);

  const { latitude, longitude, error } = location;

  if (user.accountStatus <= 0 && error) return <CustomMessage text={error} name="error" />;
  if (user.accountStatus <= 0 && !latitude && !longitude) return <LoadingScreen text={"Getting location"} />;

  return (
    <div className="outer-container">
      <main className="container no-line" title="News feed">
        <div className="create-post button-wrapper">
          <img src={user.avatarUrl || "/image/avatar.svg"} alt="My Avatar" className="avatar img no-line" />

          <button className="create-post button no-line" title="Show create post form">
            Share your favorite activity with locals
          </button>
        </div>
        {showForm && <CreatePostForm closeForm={() => setShowForm(false)} />}
        {showMessage && <p className="screen-message">{showMessage}</p>}
        {/* <NewsFeed /> */}
      </main>
    </div>
  );
};

export default HomePage;

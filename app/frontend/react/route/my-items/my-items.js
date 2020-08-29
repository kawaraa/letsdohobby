import React, { useState, useEffect } from "react";
import MyPosts from "./my-posts";
import JoinedPosts from "./joined-posts";
import "./my-items.css";

const MyItems = (props) => {
  const [myPosts, setMyPosts] = useState(true);

  useEffect(() => {
    window.addEventListener("click", ({ target: { className } }) => {
      if (/btn my-posts/.test(className)) setMyPosts(true);
      else if (/btn joined-posts/.test(className)) setMyPosts(false);
    });
  });

  return (
    <div className="outer-container">
      <div className="container">
        <header className="my-items header">
          <button className={"header btn my-posts no-line " + (myPosts ? "active" : "")}>My posts</button>
          <button className={"header btn joined-posts no-line " + (myPosts ? "" : "active")}>
            Joined posts
          </button>
        </header>
        {myPosts ? <MyPosts /> : <JoinedPosts />}
      </div>
    </div>
  );
};

export default MyItems;

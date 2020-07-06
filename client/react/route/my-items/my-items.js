import React from "react";
import MyPosts from "./my-posts";
import JoinedPosts from "./joined-posts";
import "./my-items.css";

class MyItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = { myPosts: true };
  }

  componentDidMount() {
    window.addEventListener("click", ({ target } = e) => {
      const cssClass = target.classNambaseVal || target.className;
      if (/btn my-posts/.test(cssClass)) this.setState({ myPosts: true });
      else if (/btn joined-posts/.test(cssClass)) this.setState({ myPosts: false });
    });
  }

  render() {
    const posts = this.state.myPosts;

    return (
      <div className="outer-container">
        <div className="container">
          <header className="my-items header">
            <button className={"header btn my-posts no-line " + (posts ? "active" : "")}>My posts</button>
            <button className={"header btn joined-posts no-line " + (posts ? "" : "active")}>
              Joined posts
            </button>
          </header>
          {posts ? <MyPosts /> : <JoinedPosts />}
        </div>
      </div>
    );
  }
}

export default MyItems;

import React from "react";
import CreatePostForm from "./create-post-form/create-post-form";
import NewsFeed from "./news-feed/news-feed";
import Avatar from "../../layout/icon/avatar";
import LoadingScreen from "../../layout/icon/loading-screen";
import CustomMessage from "../../layout/custom-message";
import "./home-page.css";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.closeForm = () => this.setState({ showForm: false });
    this.state = { loading: false, error: "", showForm: false, showMessage: "" };
  }

  async componentDidMount() {
    window.addEventListener("click", ({ target } = e) => {
      const cssClass = target.classNambaseVal || target.className;
      if (/create-post button/gim.test(cssClass)) return this.setState({ showForm: true });
      if (/create-post x-icon|container/gm.test(cssClass)) this.setState({ showForm: false });
    });
  }

  render() {
    const { latitude, longitude, error } = this.props.geolocation;

    if (window.user.accountStatus <= 0 && error) return <CustomMessage text={error} name="error" />;
    if (window.user.accountStatus <= 0 && !latitude && !longitude) {
      return <LoadingScreen text={"Getting location"} />;
    }

    return (
      <div className="outer-container">
        <main className="container no-line" title="News feed">
          <div className="create-post button-wrapper">
            <Avatar src={window.user.avatarUrl} name="my" />
            <button className="create-post button no-line" title="Show create post form">
              Share your favorite activity with locals
            </button>
          </div>
          {this.state.showForm && <CreatePostForm closeForm={this.closeForm} />}
          {this.state.showMessage && <p className="screen-message">{this.state.showMessage}</p>}
          <NewsFeed />
        </main>
      </div>
    );
  }
}

export default HomePage;

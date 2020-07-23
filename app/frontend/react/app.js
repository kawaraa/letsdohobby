import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { config, setEventsListeners } from "./config/config";
import Request from "./utility/request";
import Socket from "./utility/websocket";
import LoadingScreen from "./layout/icon/loading-screen";
import CustomMessage from "./layout/custom-message";
import Navbar from "./layout/navbar";
import HomePage from "./route/home-page/home-page";
import Profile from "./route/profile/profile";
import Settings from "./route/settings/settings";
import PostDetail from "./route/post-detail/post-detail";
import MyItems from "./route/my-items/my-items";
import Conversations from "./layout/conversation/conversations";
import "./app.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.onGetLocation = this.handleGetLocation.bind(this);
    this.config = config("app");
    this.state = {
      loading: true,
      error: "",
      geolocation: { latitude: 0, longitude: 0, error: "" },
      conversations: [],
      showMessage: "",
    };
  }

  updateState(state) {
    if (state.user) window.user = state.user;
    this.setState(state);
  }

  async handleGetLocation(position) {
    const { url, method } = this.config.updateSettings;
    try {
      if (!position.coords) throw new Error("Couldn't get the location");
      const { latitude, longitude } = position.coords;
      await Request.send({ currentLat: latitude, currentLng: longitude }, url, method);
      this.setState({ geolocation: { latitude, longitude, error: "" } });
    } catch (error) {
      this.setState({ geolocation: { ...this.state.geolocation, error: error.message } });
    }
  }
  onOpenConversation({ detail } = e) {
    const { conversations } = this.state;
    const index = conversations.findIndex((conversation) => conversation.id === detail.id);
    if (index < 0) conversations.push(detail);
    this.setState({ conversations });
  }
  onCloseConversation({ detail } = e) {
    const { conversations } = this.state;
    const state = { conversations: conversations.filter((conversation) => conversation.id !== detail) };
    this.setState(state);
  }
  dispatch(event, { detail } = data) {
    window.dispatchEvent(new CustomEvent(event, { detail }));
  }

  async componentDidMount() {
    setEventsListeners();
    window.addEventListener("UPDATE_APP", (e) => this.updateState(e.detail));
    window.addEventListener("OPEN_CONVERSATION", this.onOpenConversation.bind(this));
    window.addEventListener("CLOSE_CONVERSATION", this.onCloseConversation.bind(this));
    window.addEventListener("SHOW_MESSAGE", ({ detail } = e) => {
      this.setState({ showMessage: detail });
      setTimeout(() => this.setState({ showMessage: "" }), 2000);
    });
    const location = () => navigator.geolocation.getCurrentPosition(this.onGetLocation, this.onGetLocation);
    location();
    setInterval(location, 3600000);

    window.socket = new Socket(this.config.socketUrl);
    window.socket.onclose = () => window.socket.close();
    window.socket.onerror = () => window.socket.close();
    window.socket.on("ADD_NOTIFICATION", (e) => this.dispatch("ADD_NOTIFICATION", e));
    window.socket.on("REMOVE_NOTIFICATION", (e) => this.dispatch("REMOVE_NOTIFICATION", e));
    window.socket.on("NEW_UNSEEN_CHAT", (e) => this.dispatch("NEW_UNSEEN_CHAT", e));
    window.socket.on("NEW_MESSAGE", (e) => this.dispatch("NEW_MESSAGE", e));

    window.socket.onopen = () => this.setState({ connected: true });
    setInterval(() => window.socket.readyState === 1 && window.socket.emit("PING", {}), 60000);
    try {
      const user = await Request.fetch(this.config.checkState.url);
      window.user = user;
      this.setState({ loading: false });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  }
  componentWillUnmount() {
    window.socket.close();
  }

  render() {
    const { loading, error, connected, geolocation, conversations, showMessage } = this.state;
    if (loading) return <LoadingScreen />;
    if (error) return <CustomMessage text={error} name="error" />;
    if (!window.user || !window.user.id) return window.location.reload();

    return (
      <BrowserRouter>
        <Navbar connected={connected} />
        <Switch>
          <Route exact path="/" render={(props) => <HomePage {...props} geolocation={geolocation} />} />
          <Route exact path="/profile" render={(props) => <Profile {...props} />} />
          <Route exact path="/settings" render={(props) => <Settings {...props} />} />
          {/* <Route exact path="/posts/:id" render={(props) => <PostDetail {...props} />} /> */}
          <Route exact path="/my-posts" render={(props) => <MyItems {...props} />} />
          {/* <Route exact path="/member/:id" render={(props) => <Member {...props} />} /> */}
        </Switch>
        {showMessage && <p className="screen-message">{showMessage}</p>}
        <Conversations conversations={conversations} />
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<App Request={Request} />, document.getElementById("root"));

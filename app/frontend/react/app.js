import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { getConfig, setEventsListeners } from "./config/config";
import Socket from "./utility/websocket";
import AppStore, { AppContext } from "./store/app-store";
import Navbar from "./layout/navbar";
import LoadingScreen from "./layout/icon/loading-screen";
import CustomMessage from "./layout/custom-message";
import UpdatePostForm from "./route/home-page/news-feed/update-post/update-post-form";
import Conversations from "./layout/conversation/conversations";
import HomePage from "./route/home-page/home-page";
import Profile from "./route/profile/profile";
import Settings from "./route/settings/settings";
import PostDetail from "./route/post-detail/post-detail";
import MyItems from "./route/my-items/my-items";
import Member from "./route/member/member";
import "./app.css";

const App = (props) => {
  const config = getConfig("app");
  const store = useContext(AppContext);
  const [{ loading, error }, setState] = useState({ loading: true, error: "" });
  const { Request, progress, updateProgress, conversations, showMessage, percentComplete } = store;

  const getUser = async () => {
    try {
      const user = await Request.fetch(config.checkState.url);
      store.setUser(user);
      setState({ loading: false, error: "" });
    } catch (error) {
      setState({ loading: false, error: error.message });
    }
  };

  const getLocation = async (position) => {
    const { url, method } = config.updateSettings;
    try {
      if (!position.coords) throw new Error("Couldn't get the location");
      const { latitude, longitude } = position.coords;
      await Request.send({ currentLat: latitude, currentLng: longitude }, url, method);
      store.setLocation({ latitude, longitude, error: "" });
    } catch (error) {
      store.setLocation({ latitude: 0, longitude: 0, error: error.message });
    }
  };

  const closeError = () => updateProgress({ error: "" });

  useEffect(() => {
    setEventsListeners();
    getUser();
    navigator.geolocation.getCurrentPosition(getLocation, getLocation);
    setInterval(() => navigator.geolocation.getCurrentPosition(getLocation, getLocation), 3600000);

    window.socket = new Socket(config.socketUrl);
    window.socket.onclose = () => store.setConnected(false);
    window.socket.onerror = () => store.setConnected(false);
    window.socket.on("ADD_NOTIFICATION", (e) => store.addNotification(e.detail));
    window.socket.on("REMOVE_NOTIFICATION", (e) => store.removeNotification(e.detail));
    window.socket.on("NEW_MESSAGE", (e) => store.setReceivedMessage(e.detail));
    window.socket.onopen = () => store.setConnected(true);
    setInterval(() => window.socket.readyState === 1 && socket.emit("PING", {}), 60000);
    return () => window.socket.close(); // this act exactly like componentWillUnmount
  }, []);

  if (loading) return <LoadingScreen />;
  if (error) return <CustomMessage text={error} name="error" />;
  if (!store.user || !store.user.id) return window.location.reload();

  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <Route exact path="/" render={() => <HomePage />} />
        <Route exact path="/profile" render={(props) => <Profile {...props} />} />
        <Route exact path="/settings" render={(props) => <Settings {...props} />} />
        <Route exact path="/posts/:id" render={(props) => <PostDetail {...props} />} />
        <Route exact path="/my-posts" render={(props) => <MyItems {...props} />} />
        <Route exact path="/member/:id" render={(props) => <Member {...props} />} />
      </Switch>
      {conversations[0] && <Conversations conversations={conversations} />}
      {store.editingPost && <UpdatePostForm post={store.editingPost} />}
      {showMessage && <p className="screen-message">{showMessage}</p>}
      {progress.error && <CustomMessage text={progress.error} name="progress-error" listener={closeError} />}
      {progress.loading && <LoadingScreen text={percentComplete + "%"} />}
    </BrowserRouter>
  );
};

ReactDOM.render(
  <AppStore>
    <App />
  </AppStore>,
  document.getElementById("root")
);

import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { getConfig, setEventsListeners } from "./config/config";
import Socket from "./utility/websocket";
import AppStore, { AppContext } from "./store/app-store";
import LoadingScreen from "./layout/icon/loading-screen";
import CustomMessage from "./layout/custom-message";
import Navbar from "./layout/navbar";
import HomePage from "./route/home-page/home-page";
import Profile from "./route/profile/profile";
import Settings from "./route/settings/settings";
import PostDetail from "./route/post-detail/post-detail";
import MyItems from "./route/my-items/my-items";
import Conversations from "./layout/conversation/conversations";
import Member from "./route/member/member";
import "./app.css";

const App = (props) => {
  const config = getConfig("app");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const {
    Request,
    user,
    setUser,
    setLocation,
    setConnected,
    conversations,
    showMessage,
    addNotification,
    removeNotification,
    addUnseenChat,
  } = useContext(AppContext);

  const getUser = async () => {
    try {
      const user = await Request.fetch(config.checkState.url);
      setUser(user);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const getLocation = async (position) => {
    const { url, method } = config.updateSettings;
    try {
      if (!position.coords) throw new Error("Couldn't get the location");
      const { latitude, longitude } = position.coords;
      await Request.send({ currentLat: latitude, currentLng: longitude }, url, method);
      setLocation({ latitude, longitude, error: "" });
    } catch (error) {
      setLocation({ latitude: 0, longitude: 0, error: error.message });
    }
  };

  useEffect(() => {
    setEventsListeners();
    getUser();
    navigator.geolocation.getCurrentPosition(getLocation, getLocation);
    setInterval(() => navigator.geolocation.getCurrentPosition(getLocation, getLocation), 3600000);

    window.socket = new Socket(config.socketUrl);
    window.socket.onclose = () => setConnected(false);
    window.socket.onerror = () => setConnected(false);
    window.socket.on("ADD_NOTIFICATION", (e) => addNotification(e.detail));
    window.socket.on("REMOVE_NOTIFICATION", (e) => removeNotification(e.detail));
    window.socket.on("NEW_UNSEEN_CHAT", (e) => addUnseenChat(e.detail));
    window.socket.on("NEW_MESSAGE", (e) => window.dispatchEvent(new CustomEvent("NEW_MESSAGE", e)));
    window.socket.onopen = () => setConnected(true);
    setInterval(() => window.socket.readyState === 1 && socket.emit("PING", {}), 60000);
    return () => window.socket.close(); // this act exactly like componentWillUnmount
  }, []);

  if (loading) return <LoadingScreen />;
  if (error) return <CustomMessage text={error} name="error" />;
  if (!user || !user.id) return window.location.reload();

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
      {showMessage && <p className="screen-message">{showMessage}</p>}
      {conversations[0] && <Conversations conversations={conversations} />}
    </BrowserRouter>
  );
};

ReactDOM.render(
  <AppStore>
    <App />
  </AppStore>,
  document.getElementById("root")
);

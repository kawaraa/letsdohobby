import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { getConfig, setEventsListeners } from "./config/config";
import getServiceWorkerRegistration from "./utility/register-service-worker";
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
  const settingsConfig = getConfig("settings");

  const store = useContext(AppContext);
  const [{ loading, error }, setState] = useState({ loading: true, error: "" });
  const { Request, progress, updateProgress, conversations, showMessage, percentComplete } = store;

  const getUserAndRegisterWebWorkers = async () => {
    try {
      const user = await Request.fetch(config.checkState.url);
      const worker = await getServiceWorkerRegistration(config.socketUrl);
      if (!worker) return updateProgress({ error: config.error });
      worker.on("ADD_NOTIFICATION", ({ data, detail }) => store.addNotification(data || detail));
      worker.on("REMOVE_NOTIFICATION", ({ data, detail }) => store.removeNotification(data || detail));
      worker.on("NEW_MESSAGE", ({ data, detail }) => store.setReceivedMessage(data || detail));
      worker.on("CONNECT", () => store.setConnected(true));
      worker.on("DISCONNECT", () => store.setConnected(false));
      store.setUser(user);
      store.setWorker(worker);
      setState({ loading: false, error: "" });
      syncNotificationPermission();
      worker.emit("SET_NOTIFICATIONS_PERMISSION", { mode: user.notifications });
    } catch (error) {
      if (/Unauthorized request/.test(error.message)) return;
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

  const syncNotificationPermission = async () => {
    try {
      if (Notification.permission !== "granted" && store.worker) {
        await Request.send({ notifications: "off" }, settingsConfig.url, settingsConfig.method);
        store.setUser({ ...store.user, notifications: "off" });
        store.worker.emit("SET_NOTIFICATIONS_PERMISSION", { mode: "off" });
        console.log("object", store.worker);
      }
    } catch (error) {
      console.log("syncNotificationPermission > ", error);
    }
  };

  useEffect(() => {
    setEventsListeners();
    getUserAndRegisterWebWorkers();
    navigator.geolocation.getCurrentPosition(getLocation, getLocation);
    setInterval(() => {
      navigator.geolocation.getCurrentPosition(getLocation, getLocation);
      syncNotificationPermission();
    }, 3600000);
  }, []);

  if (loading) return <LoadingScreen />;
  if (error) return <CustomMessage text={error} name="error" />;
  if (!store.user || !store.user.id) {
    return (window.location.href = window.location.origin + "/log-me-in-out");
  }

  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <Route exact path="/profile" render={(props) => <Profile {...props} />} />
        <Route exact path="/settings" render={(props) => <Settings {...props} />} />
        <Route exact path="/posts/:id" render={(props) => <PostDetail {...props} />} />
        <Route exact path="/my-posts" render={(props) => <MyItems {...props} />} />
        <Route exact path="/member/:id" render={(props) => <Member {...props} />} />
        <Route path="/" render={() => <HomePage />} />
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

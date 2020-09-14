import React, { useContext, useState } from "react";
import { getConfig } from "../../config/config";
import { AppContext } from "../../store/app-store";
import Account from "./account";
import "./settings.css";

/*
- Manage notifications: manage what notifications to receive
- Manage what to see: manage what type of post or category to show based on the selected activities
*/

const Settings = (props) => {
  const config = getConfig("settings");
  const { Request, user, updateProgress, worker, requestNotificationPermission } = useContext(AppContext);
  const [state, setState] = useState({
    locationRange: user.locationRange,
    unit: user.unit,
    language: user.language,
    notifications: user.notifications,
    didChange: false,
    error: "",
  });

  const { locationRange, unit, notifications, language, didChange } = state;
  const range = "km" !== unit && locationRange > 100 ? 100 : locationRange;

  const handleChange = ({ target: { name, value, checked } }) => {
    if (name === "notifications" && Notification.permission !== "granted" && checked) {
      requestNotificationPermission();
      return updateProgress({ error: config.error });
    }
    const val = name === "notifications" ? (checked ? "on" : "off") : value;
    setState({ ...state, [name]: val, didChange: true });
    updateProgress({ error: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      updateProgress({ loading: true });
      await Request.send({ locationRange, unit, notifications, language }, config.url, config.method);
      setState({ ...state, didChange: false });
      updateProgress({ loading: false, error: "" });
      worker.emit("SET_NOTIFICATIONS_PERMISSION", { mode: state.notifications });
    } catch (error) {
      updateProgress({ loading: false, error: error.message });
    }
  };

  // const getLanguages = () => {
  //   return config.languages.map((lang) => {
  //     if (language !== lang) return <option defaultValue="lang">{lang}</option>;
  //     return <option defaultValue="lang" selected>{lang}</option>;
  //   });
  // };

  return (
    <div className="outer-container">
      <div className="settings container">
        <form onChange={handleChange} onSubmit={handleSubmit} className="settings wrapper">
          <h1 className="distance title">Distance</h1>
          {/* <select name="language">{getLanguages()}</select> */}
          <div className="distance box unit">
            <h4 className="unit title">
              Show distance in <strong title="Distance unit">{unit}</strong>
            </h4>
            <div className="unit wrapper">
              <label
                for="unit-km"
                className={"no-line " + ("km" === unit ? "active" : "")}
                title="Kilometer"
                tabindex="0">
                <input type="radio" name="unit" defaultValue="km" checked={"km" === unit} id="unit-km" />
                Km
              </label>
              <label
                for="unit-mi"
                className={"no-line " + ("mi" === unit ? "active" : "")}
                title="Mile"
                tabindex="0">
                <input type="radio" name="unit" defaultValue="mi" checked={"mi" === unit} id="unit-mi" />
                Mi
              </label>
            </div>
          </div>
          <div className="distance box range">
            <h4 className="range title">
              Maximum distance <strong title="Distance">{range + unit}</strong>
            </h4>
            <input type="range" name="locationRange" min="5" max={"km" === unit ? 161 : 100} value={range} />
          </div>
          <div className="other box">
            <h4 className="notifications title">Other</h4>
            <div className="notifications field">
              <p className="notifications name">Receive Notifications</p>
              <input type="checkbox" name="notifications" checked={notifications === "on"} />
            </div>
          </div>
          {didChange && (
            <button type="submit" className="settings save-btn">
              Save
            </button>
          )}
        </form>
        <Account />
      </div>
    </div>
  );
};

export default Settings;

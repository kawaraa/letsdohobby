import React, { useContext, useState } from "react";
import { getConfig } from "../../config/config";
import { AppContext } from "../../store/app-store";
import Account from "./account";
import CustomMessage from "../../layout/custom-message";
import "./settings.css";

/*
- Manage notifications: manage what notifications to receive
- Manage what to see: manage what type of post or category to show based on the selected activities
*/

const Settings = (props) => {
  const config = getConfig("settings");
  const { Request, user, updateProgress } = useContext(AppContext);
  const [state, setState] = useState({
    locationRange: user.locationRange,
    unit: user.unit,
    language: user.language,
    didChange: false,
    error: "",
  });

  const { locationRange, unit, language, didChange, error } = state;
  const range = "km" !== unit && locationRange > 100 ? 100 : locationRange;

  const handleChange = ({ target: { name, value } }) =>
    setState({ ...state, [name]: value, didChange: true });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      updateProgress({ loading: true });
      await Request.send({ locationRange, unit, language }, config.url, config.method);
      setState({ ...state, didChange: false });
      updateProgress({ loading: false, error: "" });
    } catch (error) {
      updateProgress({ loading: false, error: error.message });
    }
  };

  // const getLanguages = () => {
  //   return config.languages.map((lang) => {
  //     if (language !== lang) return <option defaultValue="lang">{lang}</option>;
  //     return (
  //       <option defaultValue="lang" selected>
  //         {lang}
  //       </option>
  //     );
  //   });
  // };

  return (
    <div className="outer-container">
      <div className="settings container">
        <form onChange={handleChange} onSubmit={handleSubmit} className="settings wrapper distance">
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

import React from "react";
import { config } from "../../config/config";
import Request from "../../utility/request";
import Account from "./account";
import LoadingScreen from "../../layout/icon/loading-screen";
import CustomMessage from "../../layout/custom-message";
import "./settings.css";

/*

- Adjust range: the distance range per KM
- Manage notifications: manage what notifications to receive
- Manage what to see: manage what type of post or category to show based on the selected activities
*/
class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.config = config("settings");
    this.onChange = this.handleChange.bind(this);
    this.onSubmit = this.handleSubmit.bind(this);
    this.state = { loading: false, locationRange: 5, unit: "km", language: "en", didChange: false };
  }

  async handleChange(e) {
    this.setState({ [e.target.name]: e.target.value, didChange: true });
  }
  async handleSubmit(e) {
    e.preventDefault();
    const { locationRange, unit, language } = this.state;
    try {
      this.setState({ loading: true });
      await Request.send({ locationRange, unit, language }, this.config.url, this.config.method);
      this.setState({ loading: false, error: "", didChange: false });
    } catch (error) {
      this.setState({ loading: false, error: error.message });
    }
  }
  getLanguages() {
    return this.config.languages.map((lang) => {
      if (this.state.language !== lang) return <option defaultValue="lang">{lang}</option>;
      return (
        <option defaultValue="lang" selected>
          {lang}
        </option>
      );
    });
  }
  componentDidMount() {
    const { locationRange, unit, language } = window.user;
    this.setState({ locationRange, unit, language });
  }
  render() {
    const { loading, error, locationRange, unit, language, didChange } = this.state;
    if (loading) return <LoadingScreen />;

    return (
      <div className="outer-container">
        <div className="settings container">
          <form onChange={this.onChange} onSubmit={this.onSubmit} className="settings wrapper distance">
            <h1 className="distance title">Distance</h1>
            {error && <CustomMessage text={error} name="error" />}
            {/* <select name="language">{this.getLanguages()}</select> */}
            <div className="distance box unit">
              <h4 className="unit title">
                Show distance in <strong title="Distance unit">{unit}</strong>
              </h4>
              <div className="unit wrapper">
                <label
                  for="unit-km"
                  className={"no-line " + ("km" === unit ? "active" : "")}
                  title="Kilometer"
                  tabindex="0"
                >
                  <input type="radio" name="unit" defaultValue="km" checked={"km" === unit} id="unit-km" />
                  Km
                </label>
                <label
                  for="unit-mi"
                  className={"no-line " + ("mi" === unit ? "active" : "")}
                  title="Mile"
                  tabindex="0"
                >
                  <input type="radio" name="unit" defaultValue="mi" checked={"mi" === unit} id="unit-mi" />
                  Mi
                </label>
              </div>
            </div>
            <div className="distance box range">
              <h4 className="range title">
                Maximum distance <strong title="Distance">{this.state.locationRange + unit}</strong>
              </h4>
              <input type="range" name="locationRange" min="5" max="161" value={locationRange} />
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
  }
}

export default Settings;

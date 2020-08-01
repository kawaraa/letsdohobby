import React from "react";
import { config } from "../../../config/config";
import Request from "../../../utility/request";
import { ActivityList, FilteredActivities } from "./activities";
import CustomMessage from "../../../layout/custom-message";
import LoadingScreen from "../../../layout/icon/loading-screen";
import "./activities.css";

class EditActivities extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.handleChange.bind(this);
    this.addActivity = this.handleAddActivity.bind(this);
    this.removeActivity = this.handleRemoveActivity.bind(this);
    this.submit = this.handleSubmit.bind(this);
    this.activities = config("activities");
    this.config = config("updateActivities");
    this.state = { loading: false, activities: [], filter: [] };
  }

  handleChange({ target } = e) {
    const has = (item) => this.state.activities.indexOf(item) >= 0;
    const test = (item) => item.toLowerCase().indexOf(target.value.toLowerCase()) >= 0 && !has(item);
    const filter = target.value.trim().length > 0 ? this.activities.filter(test) : [];
    this.setState({ filter });
  }
  handleAddActivity(activity) {
    const { activities } = this.state;
    if (activities.indexOf(activity) < 0) activities.push(activity);
    this.setState({ activities });
  }
  handleRemoveActivity(activity) {
    const { activities } = this.state;
    this.setState({ activities: activities.filter((act) => act !== activity) });
  }

  async handleSubmit() {
    try {
      this.setState({ loading: true });
      const profile = await Request.send(this.state.activities, this.config.url, "PUT");
      this.props.changeMode({ editField: "", profile });
    } catch (error) {
      this.setState({ loading: false });
    }
  }
  componentDidMount() {
    this.setState({ activities: this.props.activities[0] ? this.props.activities : [] });
  }

  render() {
    const { loading, error, activities, filter } = this.state;
    if (loading) return <LoadingScreen />;

    return (
      <div className="profile activities">
        {error && <CustomMessage text={error} name="activities error" />}
        {filter[0] && <FilteredActivities filter={filter} addActivity={this.addActivity} />}

        <div className="activities inputs">
          <input type="text" name="activity" placeholder="Activity" onChange={this.onChange} />

          <button type="button" className="save-btn no-line" onClick={this.submit}>
            Save
          </button>
          <button
            type="button"
            className="cancel-btn no-line"
            onClick={() => this.props.changeMode({ editField: "" })}
          >
            Cancel
          </button>
        </div>

        {activities[0] && <ActivityList activities={activities} listener={this.removeActivity} />}
      </div>
    );
  }
}

export default EditActivities;

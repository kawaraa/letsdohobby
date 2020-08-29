import React, { useContext, useState } from "react";
import { getConfig } from "../../../config/config";
import { AppContext } from "../../../store/app-store";
import { ActivityList, FilteredActivities } from "./activities";
import "./activities.css";

const EditActivities = (props) => {
  const availableActivities = getConfig("activities");
  const config = getConfig("updateActivities");
  const { Request, updateProgress, profile, setProfile, setEditingField } = useContext(AppContext);
  const [activities, setActivities] = useState(profile.activities);
  const [filter, setFilter] = useState([]);

  const handleChange = ({ target: { value } }) => {
    const has = (item) => activities.indexOf(item) > -1;
    const test = (item) => item.toLowerCase().indexOf(value.toLowerCase()) > -1 && !has(item);
    setFilter(value.trim().length > 0 ? availableActivities.filter(test) : []);
  };

  const handleAddActivity = (activity) => {
    if (activities.indexOf(activity) < 0) setActivities([...activities, activity]);
  };

  const handleRemoveActivity = (activity) => setActivities(activities.filter((act) => act !== activity));

  const handleSubmit = async () => {
    try {
      updateProgress({ loading: true });
      const profile = await Request.send(activities, config.url, "PUT");
      setProfile(profile);
      setEditingField("");
      updateProgress({ loading: false, error: "" });
    } catch (error) {
      updateProgress({ loading: false, error: error.message });
    }
  };

  return (
    <div className="profile activities">
      {filter[0] && <FilteredActivities filter={filter} addActivity={handleAddActivity} />}

      <div className="activities inputs">
        <input type="text" name="activity" placeholder="Activity" onChange={handleChange} />

        <button type="button" className="save-btn no-line" onClick={handleSubmit}>
          Save
        </button>
        <button type="button" className="cancel-btn no-line" onClick={() => setEditingField("")}>
          Cancel
        </button>
      </div>

      {activities[0] && <ActivityList activities={activities} listener={handleRemoveActivity} />}
    </div>
  );
};

export default EditActivities;

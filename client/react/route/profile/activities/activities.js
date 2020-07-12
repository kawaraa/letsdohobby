import React from "react";
import "./activities.css";

export const ActivityList = ({ activities, listener } = props) => {
  return (
    <ul className="activities list no-line" title="Referable activities list" tabindex="0">
      {activities.map((act) => (
        <li className="activities item no-line" title="Activity item" tabindex="0">
          {act}
          {listener && (
            <button
              type="button"
              onClick={() => listener(act)}
              className="no-line"
              title="Remove activity"
              tabIndex="0"
            >
              X
            </button>
          )}
        </li>
      ))}
    </ul>
  );
};

export const Activities = ({ changeMode, profile } = props) => {
  return (
    <div className="profile activities">
      <h2 className="activities title">Activities</h2>
      {profile.activities[0] && <ActivityList activities={profile.activities} />}
      <button type="button" className="no-line" onClick={() => changeMode({ editField: "activity" })}>
        Update
      </button>
    </div>
  );
};

export const FilteredActivities = ({ filter, addActivity } = props) => {
  return (
    <ul className="activities filter no-line" title="Filtered activities list" tabindex="0">
      {filter.map((act) => (
        <li
          onClick={() => addActivity(act)}
          className="item no-line"
          title="Filtered activity item"
          tabindex="0"
        >
          {act}
        </li>
      ))}
    </ul>
  );
};

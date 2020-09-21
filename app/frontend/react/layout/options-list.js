import React from "react";
import { Link } from "react-router-dom";
import "./options-list.css";

export default ({ username, displayName }) => {
  return (
    <ul className="nav-options list">
      <li className="nav-options item user-info">
        <span className="user-info name">{displayName}</span>
        <span className="user-info email">{username}</span>
      </li>
      <li className="nav-options item">
        <Link to="/profile" className="nav-option link hover-shadow">
          Profile
        </Link>
      </li>
      <li className="nav-options item">
        <Link to="/settings" className="nav-option link hover-shadow">
          Settings
        </Link>
      </li>
      <li className="nav-options item">
        <a href="/api/log-me-out" className="nav-option link hover-shadow">
          Logout
        </a>
      </li>
    </ul>
  );
};

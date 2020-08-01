import React from "react";
import { Link } from "react-router-dom";
import Avatar from "../../layout/icon/avatar";
import "./member-info.css";

export default ({ member } = props) => {
  return (
    <li className="member wrapper no-line" title="Member info" tabindex="0">
      <Link to={"/member/" + member.id} className="member avatar-link no-line" title="Member avatar">
        <Avatar src={member.avatarUrl} name="member" />
      </Link>
      <Link to={"/member/" + member.id} className="member name no-line" title="Member name">
        {member.displayName}
      </Link>
    </li>
  );
};

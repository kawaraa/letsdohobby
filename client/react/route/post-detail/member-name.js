import React from "react";
import { Link } from "react-router-dom";
import Avatar from "../../layout/icon/avatar";

export default ({ member } = props) => {
  return (
    <li className="members item no-line" title="Member info" tabindex="0">
      <Link to={"/member/" + member.id} className="members avatar-link no-line" title="Member avatar">
        <Avatar src={member.avatarUrl} name="member" />
      </Link>
      <Link to={"/member/" + member.id} className="members name no-line" title="Member name">
        {member.displayName}
      </Link>
    </li>
  );
};

import React, { useState, useContext, useEffect } from "react";
import { Link, NavLink, withRouter } from "react-router-dom";
import { AppContext } from "../store/app-store";
import OptionsList from "./options-list";
import Messenger from "./messenger/messenger";
import Notification from "./notification/notification";
import "./navbar.css";

const Navbar = (props) => {
  const [showList, setShowList] = useState(false);
  const { user, connected } = useContext(AppContext);

  useEffect(() => {
    window.addEventListener("click", ({ target: { className } }) => {
      if (!/navbar avatar/gim.test(className)) setShowList(false);
    });
  }, []);

  return (
    <div className="navbar-container">
      <nav className="navbar container no-line" title="Navbar">
        <Link to="/" class="logo wrapper no-line">
          <span class="logo item l">L</span>
          <span class="logo item d">D</span>
          <span class="logo item h">H</span>
        </Link>
        <div className={"navbar status " + (connected && "online")} title="Connection status" tabindex="0">
          {connected ? "Online" : "Offline"}
        </div>

        <div className="navbar icons">
          <Link to="/" className="nav-icon wrapper home-link no-line">
            <img src="/image/home.svg" alt="Home icon" className="nav-icon home img" />
          </Link>
          <Link to="/my-posts" className="nav-icon wrapper my-items-link no-line">
            <img src="/image/my-items.svg" alt="My items icon" className="nav-icon my-items img" />
          </Link>
          <Messenger />
          <Notification />
        </div>

        <div className="navbar options">
          <img
            src={user.avatarUrl || "/image/avatar.svg"}
            alt="My Avatar and Option button"
            class="navbar avatar img no-line"
            onClick={() => setShowList(!showList)}
          />

          {showList && <OptionsList {...user} />}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

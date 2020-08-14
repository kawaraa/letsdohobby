import React, { Component } from "react";
import { Link, NavLink, withRouter } from "react-router-dom";
import OptionsList from "./options-list";
import Messenger from "./messenger/messenger";
import Notification from "./notification/notification";
import "./navbar.css";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = { showList: false };
  }

  componentDidMount() {
    window.addEventListener("click", ({ target } = e) => {
      if (!/navbar avatar/gim.test(target.className)) return this.setState({ showList: false });
      this.setState({ showList: !this.state.showList });
    });
  }

  render() {
    const { showList } = this.state;
    const online = this.props.connected;

    return (
      <div className="navbar outer-container">
        <nav className="navbar container no-line" title="Navbar">
          <Link to="/" class="logo wrapper no-line">
            <span class="logo item l">L</span>
            <span class="logo item d">D</span>
            <span class="logo item h">H</span>
          </Link>
          <div className={"navbar status " + (online && "online")} title="Connection status" tabindex="0">
            {online ? "Online" : "Offline"}
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
              src={window.user.avatarUrl || "/image/avatar.svg"}
              alt="My Avatar and Option button"
              class="navbar avatar img no-line"
            />

            {showList && <OptionsList />}
          </div>
        </nav>
      </div>
    );
  }
}

export default Navbar;

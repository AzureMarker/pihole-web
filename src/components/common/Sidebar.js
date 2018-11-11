/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Sidebar component
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from "react";
import { translate } from "react-i18next";
import { NavLink } from "react-router-dom";
import { Nav, NavItem } from "reactstrap";
import logo from "../../img/logo.svg";
import { mobileSidebarHide } from "./Header";
import api from "../../util/api";
import StatusBadge from "./StatusBadge";

const handleClick = e => {
  e.preventDefault();
  e.target.parentElement.classList.toggle("open");
};

export const dropDownClassList = (routeName, props) =>
  props.location.pathname.startsWith(routeName)
    ? "nav-item nav-dropdown open"
    : "nav-item nav-dropdown";

export const navItem = (item, key, props) => (
  <NavItem key={key}>
    <NavLink
      to={item.url}
      onClick={mobileSidebarHide}
      className="nav-link"
      activeClassName="active"
    >
      <i className={"nav-icon " + item.icon} />
      {props.t(item.name)}
    </NavLink>
  </NavItem>
);

export const navDropdown = (item, key, props) => (
  <li key={key} className={dropDownClassList(item.url, props)}>
    <button className="nav-link nav-dropdown-toggle" onClick={handleClick}>
      <i className={"nav-icon " + item.icon} />
      {props.t(item.name)}
    </button>
    <ul className="nav-dropdown-items">{navList(item.children, props)}</ul>
  </li>
);

export const navList = (items, props) =>
  items.map((item, index) => {
    // Don't show an item if it requires auth and we're not logged in
    if (item.auth && !api.loggedIn) return null;

    // Some items (login page) should only be shown when logged in or logged out, not both
    if (item.authStrict && item.auth !== api.loggedIn) return null;

    // At this point it's ok to show the item
    return item.children
      ? navDropdown(item, index, props)
      : navItem(item, index, props);
  });

const Sidebar = ({ items, ...props }) => {
  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        <Nav>
          <li className="nav-title">
            <img
              src={logo}
              className="img-responsive pull-left"
              style={{ height: "67px" }}
              alt=""
            />
            <p
              className="pull-left"
              style={{
                paddingLeft: "15px",
                textTransform: "initial",
                fontSize: "14px",
                marginBottom: "initial",
                lineHeight: "14px",
                color: "white"
              }}
            >
              {props.t("Status")}
            </p>
            <br />
            <span style={{ textTransform: "initial", paddingLeft: "15px" }}>
              <StatusBadge />
            </span>
          </li>
          {navList(items, props)}
        </Nav>
      </nav>
    </div>
  );
};

export default translate(["common", "location"])(Sidebar);

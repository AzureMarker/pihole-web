/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Header component
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { MouseEvent } from "react";
import { Link } from "react-router-dom";
import { TimeRangeSelectorContainer } from "../dashboard/TimeRangeSelector";
import api from "../../util/api";

//const sidebarToggle = e => {
//  e.preventDefault();
//  document.body.classList.toggle('sidebar-hidden');
//};

const sidebarMinimize = (e: MouseEvent) => {
  e.preventDefault();
  document.body.classList.toggle("sidebar-minimized");
  document.body.classList.toggle("brand-minimized");
};

export const mobileSidebarToggle = () => {
  document.body.classList.toggle("sidebar-show");
};

export const mobileSidebarHide = () => {
  document.body.classList.remove("sidebar-show");
};

//const asideToggle = e => {
//  e.preventDefault();
//  document.body.classList.toggle('aside-menu-hidden');
//};

export default () => (
  <header className="app-header navbar">
    <button
      className="navbar-toggler d-lg-none"
      style={{ marginLeft: "16px" }}
      onClick={mobileSidebarToggle}
      type="button"
    >
      &#9776;
    </button>
    <Link
      to="/dashboard"
      className="navbar-brand"
      style={{ textAlign: "center" }}
    >
      <span style={{ color: "white", lineHeight: "40px" }}>
        <span className="navbar-brand-full">
          Pi-
          <b>hole</b>
        </span>
        <span className="navbar-brand-minimized">
          P<b>h</b>
        </span>
      </span>
    </Link>
    <ul className="nav navbar-nav d-md-down-none mr-auto">
      <li className="nav-item">
        <button
          className="nav-link navbar-toggler sidebar-toggler"
          type="button"
          onClick={sidebarMinimize}
        >
          &#9776;
        </button>
      </li>
      {api.loggedIn && window.location.pathname.endsWith("/dashboard") ? (
        <li>
          <TimeRangeSelectorContainer />
        </li>
      ) : null}
    </ul>
  </header>
);

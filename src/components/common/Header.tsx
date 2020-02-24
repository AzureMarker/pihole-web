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

export default () => (
  <header className="c-header c-header-light c-header-fixed">
    <button
      className="c-header-toggler d-lg-none text-dark ml-3"
      onClick={mobileSidebarToggle}
      type="button"
    >
      &#9776;
    </button>
    <ul className="c-header-nav navbar-nav d-md-down-none mr-auto">
      <li className="c-header-nav-item">
        <button
          className="c-header-nav-link c-header-toggler text-white sidebar-toggler"
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

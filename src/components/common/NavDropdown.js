/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  A dropdown in the sidebar
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

/* eslint-disable jsx-a11y/anchor-is-valid */

import React from "react";

export default ({ name, icon, isOpen, children }) => (
  <li className={"nav-item nav-dropdown" + (isOpen ? " open" : "")}>
    <button
      className="nav-link nav-dropdown-toggle"
      onClick={handleDropdownClick}
    >
      <i className={"nav-icon " + icon} />
      {name}
    </button>
    <ul className="nav-dropdown-items">{children}</ul>
  </li>
);

const handleDropdownClick = e => {
  e.preventDefault();
  e.target.parentElement.classList.toggle("open");
};

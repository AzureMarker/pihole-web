/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * A button in the sidebar
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

/* eslint-disable jsx-a11y/anchor-is-valid */

import React from "react";

export default ({ name, icon, onClick = e => e.preventDefault() }) => (
  <li className="nav-item">
    <a href="#" onClick={onClick} className="nav-link">
      <i className={"nav-icon " + icon} />
      {name}
    </a>
  </li>
);

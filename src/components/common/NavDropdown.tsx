/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * A dropdown in the sidebar
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { MouseEvent, ReactNode } from "react";

export interface NavDropdownProps {
  name: string;
  icon: string;
  isOpen: boolean;
  children: ReactNode;
}

export default ({ name, icon, isOpen, children }: NavDropdownProps) => (
  <li
    className={
      "c-sidebar-nav-item c-sidebar-nav-dropdown" + (isOpen ? " open" : "")
    }
  >
    <button
      className="c-sidebar-nav-link c-sidebar-nav-dropdown-toggle"
      onClick={handleDropdownClick}
    >
      <i className={"nav-icon " + icon} />
      {name}
    </button>
    <ul className="c-sidebar-nav-dropdown-items">{children}</ul>
  </li>
);

const handleDropdownClick = (e: MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  (e.target as HTMLButtonElement).parentElement!.classList.toggle("open");
};

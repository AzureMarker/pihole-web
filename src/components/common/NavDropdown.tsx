/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * A dropdown in the sidebar
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { MouseEvent, ReactNode } from "react";

export interface NavDropdownProps {
  name: string;
  icon: string;
  isOpen: boolean;
  children: ReactNode;
}

export default ({ name, icon, isOpen, children }: NavDropdownProps) => (
  <li className={"nav-item nav-dropdown" + (isOpen ? " open" : "")}>
    <button
      className="nav-link nav-dropdown-toggle"
      onClick={handleDropdownClick}
      type="button"
    >
      <i className={"nav-icon " + icon} />
      {name}
    </button>
    <ul className="nav-dropdown-items">{children}</ul>
  </li>
);

const handleDropdownClick = (e: MouseEvent<HTMLButtonElement>) => {
  (e.target as HTMLButtonElement).parentElement!.classList.toggle("open");
};

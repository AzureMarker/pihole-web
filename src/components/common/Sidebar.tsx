/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Sidebar component
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { ReactNode } from "react";
import { WithNamespaces, withNamespaces } from "react-i18next";
import { NavLink } from "react-router-dom";
import { Nav, NavItem } from "reactstrap";
import logo from "../../img/logo.svg";
import { mobileSidebarHide } from "./Header";
import api from "../../util/api";
import StatusBadge from "./StatusBadge";
import NavDropdown from "./NavDropdown";
import {
  RouteCustomItem,
  RouteData,
  RouteGroup,
  RouteItem
} from "../../routes";
import i18next from "i18next";

export const isDropdownOpen = (
  routeName: string,
  props: { location: Location }
) => props.location.pathname.startsWith(routeName);

export const navItem = (
  item: RouteItem,
  key: any,
  t: i18next.TranslationFunction
): ReactNode => (
  <NavItem key={key}>
    <NavLink
      to={item.url}
      onClick={mobileSidebarHide}
      className="nav-link"
      activeClassName="active"
    >
      <i className={"nav-icon " + item.icon} />
      {t(item.name)}
    </NavLink>
  </NavItem>
);

export const navDropdown = (
  item: RouteGroup,
  key: any,
  t: i18next.TranslationFunction,
  location: Location
): ReactNode => (
  <NavDropdown
    name={t(item.name)}
    icon={item.icon}
    isOpen={location.pathname.startsWith(item.url)}
    key={key}
  >
    {navList(item.children, t, location)}
  </NavDropdown>
);

export const navList = (
  items: Array<RouteData>,
  t: i18next.TranslationFunction,
  location: Location
) =>
  items.map((item, index) => {
    // Don't show an item if it requires auth and we're not logged in
    if (item.auth && !api.loggedIn) return null;

    // Some items (login page) should only be shown when logged in or logged out, not both
    if (item.authStrict && item.auth !== api.loggedIn) return null;

    // Check if it's a custom component
    if ((item as RouteCustomItem).customComponent !== undefined) {
      const Component = (item as RouteCustomItem).customComponent;
      return <Component key={index} />;
    }

    // At this point it's ok to show the item
    return (item as RouteGroup).children
      ? navDropdown(item as RouteGroup, index, t, location)
      : navItem(item as RouteItem, index, t);
  });

export interface SidebarProps extends WithNamespaces {
  items: Array<RouteData>;
  location: Location;
}

const Sidebar = ({ items, t, location }: SidebarProps) => {
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
              {t("Status")}
            </p>
            <br />
            <span style={{ textTransform: "initial", paddingLeft: "15px" }}>
              <StatusBadge />
            </span>
          </li>
          {navList(items, t, location)}
        </Nav>
      </nav>
    </div>
  );
};

export default withNamespaces(["common", "location"])(Sidebar);

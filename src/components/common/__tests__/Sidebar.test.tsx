/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Sidebar component test
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import { shallow } from "enzyme";
import Sidebar, { NavList, PiholeNavDropdown, PiholeNavItem } from "../Sidebar";
import api from "../../../util/api";
import { RouteCustomItem, RouteGroup } from "../../../routes";
import NavDropdown from "../NavDropdown";

it("expands active drop down items", () => {
  const item: RouteGroup = {
    name: "testName",
    url: "/testRoute",
    icon: "test-icon",
    auth: false,
    children: []
  };

  const wrapper = shallow(
    <PiholeNavDropdown
      item={item}
      t={key => key}
      location={{ pathname: "/testRoute/page" } as Location}
    />
  );

  expect(wrapper.find(NavDropdown).props().isOpen).toBeTruthy();
});

it("does not expand inactive drop down items", () => {
  const item: RouteGroup = {
    name: "testName",
    url: "/testRoute",
    icon: "test-icon",
    auth: false,
    children: []
  };

  const wrapper = shallow(
    <PiholeNavDropdown
      item={item}
      t={key => key}
      location={{ pathname: "/page" } as Location}
    />
  );

  expect(wrapper.find(NavDropdown).props().isOpen).toBeFalsy();
});

it("creates nav items with correct data", () => {
  const item = {
    url: "/testUrl",
    icon: "test-icon",
    name: "testName",
    auth: false,
    component: () => <div />
  };
  const wrapper = shallow(<PiholeNavItem item={item} t={key => key} />);

  expect(wrapper.childAt(0)).toHaveProp("to", item.url);
  expect(wrapper.childAt(0).childAt(0)).toHaveClassName(item.icon);
  expect(wrapper.childAt(0).childAt(1)).toHaveText(item.name);
});

it("creates a nav dropdown with correct data", () => {
  const item = {
    name: "Blacklist",
    url: "/blacklist",
    icon: "fa fa-ban",
    auth: false,
    children: []
  };
  const location = { pathname: "/blacklist/exact" } as Location;
  const wrapper = shallow(
    <PiholeNavDropdown item={item} t={key => key} location={location} />
  );

  expect(wrapper).toHaveProp("icon", item.icon);
  expect(wrapper).toHaveProp("name", item.name);
  expect(wrapper.find(NavList).children()).toHaveLength(0);
});

it("shows auth routes when logged in", () => {
  api.loggedIn = true;

  const item = {
    name: "Query Log",
    url: "/query-log",
    component: () => <div />,
    icon: "fa fa-database",
    auth: true
  };
  const wrapper = shallow(
    <NavList items={[item]} t={key => key} location={{} as Location} />
  );

  expect(wrapper.children()).toHaveLength(1);
});

it("hides auth routes when not logged in", () => {
  api.loggedIn = false;

  const item = {
    name: "Query Log",
    url: "/query-log",
    component: () => <div />,
    icon: "fa fa-database",
    auth: true
  };
  const wrapper = shallow(
    <NavList items={[item]} t={key => key} location={{} as Location} />
  );

  expect(wrapper.children()).toHaveLength(0);
});

it("hides strict non-auth routes when logged in", () => {
  api.loggedIn = true;

  const item = {
    name: "Login",
    url: "/login",
    component: () => <div />,
    icon: "fa fa-user",
    auth: false,
    authStrict: true
  };
  const wrapper = shallow(
    <NavList items={[item]} t={key => key} location={{} as Location} />
  );

  expect(wrapper.children()).toHaveLength(0);
});

it("hides strict auth routes when not logged in", () => {
  api.loggedIn = false;

  const item = {
    name: "Logout",
    url: "/logout",
    component: () => <div />,
    icon: "fa fa-user-times",
    auth: true,
    authStrict: true
  };
  const wrapper = shallow(
    <NavList items={[item]} t={key => key} location={{} as Location} />
  );

  expect(wrapper.children()).toHaveLength(0);
});

it("uses a custom component if given", () => {
  const item: RouteCustomItem = {
    auth: false,
    fakeRoute: true,
    customComponent: () => null
  };
  const wrapper = shallow(
    <NavList items={[item]} t={key => key} location={{} as Location} />
  );

  expect(wrapper.children()).toHaveLength(1);
  expect(wrapper).toContainExactlyOneMatchingElement("customComponent");
});

it("renders the NavList in the sidebar", () => {
  const item = {
    url: "/testUrl",
    icon: "test-icon",
    name: "testName",
    auth: false,
    component: () => <div />
  };
  const location = {} as Location;

  const wrapper = shallow(<Sidebar items={[item]} location={location} />);
  const props = wrapper.find(NavList).props();

  expect(props.items).toEqual([item]);
  expect(props.location).toEqual(location);
});

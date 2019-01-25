/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Sidebar component test
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { FunctionComponent } from "react";
import { shallow } from "enzyme";
import { isDropdownOpen, navDropdown, navItem, navList } from "../Sidebar";
import api from "../../../util/api";

it("expands active drop down items", () => {
  const isOpen = isDropdownOpen("/testRoute", {
    location: { pathname: "/testRoute/page" } as Location
  });

  expect(isOpen).toBeTruthy();
});

it("does not expand inactive drop down items", () => {
  const isOpen = isDropdownOpen("/testRoute", {
    location: { pathname: "/page" } as Location
  });

  expect(isOpen).toBeFalsy();
});

it("creates nav items with correct data", () => {
  const item = {
    url: "/testUrl",
    icon: "test-icon",
    name: "testName",
    auth: false,
    component: () => <div />
  };
  const key = "testKey";
  const wrapper = shallow(
    React.createElement((() =>
      navItem(item, key, key => key)) as FunctionComponent<any>)
  );

  expect(wrapper.key()).toEqual(key);
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
  const key = "testKey";
  const location = { pathname: "/blacklist/exact" } as Location;
  const wrapper = shallow(
    React.createElement((() =>
      navDropdown(item, key, key => key, location)) as FunctionComponent<any>)
  );

  expect(wrapper.key()).toEqual(key);
  expect(wrapper).toHaveProp("icon", item.icon);
  expect(wrapper).toHaveProp("name", item.name);
  expect(wrapper.children()).toHaveLength(0);
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
    React.createElement(() => (
      <ul>{navList([item], key => key, {} as Location)}</ul>
    ))
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
    React.createElement(() => (
      <ul>{navList([item], key => key, {} as Location)}</ul>
    ))
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
    React.createElement(() => (
      <ul>{navList([item], key => key, {} as Location)}</ul>
    ))
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
    React.createElement(() => (
      <ul>{navList([item], key => key, {} as Location)}</ul>
    ))
  );

  expect(wrapper.children()).toHaveLength(0);
});

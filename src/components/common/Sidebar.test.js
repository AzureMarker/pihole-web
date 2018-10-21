/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Sidebar component test
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from "react";
import { shallow } from "enzyme";
import { dropDownClassList, navDropdown, navItem, navList } from "./Sidebar";
import { api } from "../../utils";

it("expands active drop down items", () => {
  const classList = dropDownClassList("/testRoute", {
    location: { pathname: "/testRoute/page" }
  });

  expect(classList).toContain("open");
});

it("does not expand inactive drop down items", () => {
  const classList = dropDownClassList("/testRoute", {
    location: { pathname: "/page" }
  });

  expect(classList).not.toContain("open");
});

it("creates nav items with correct data", () => {
  const item = { url: "/testUrl", icon: "test-icon", name: "testName" };
  const key = "testKey";
  const wrapper = shallow(
    React.createElement(() => navItem(item, key, { t: key => key }))
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
  const props = {
    t: key => key,
    location: {
      pathname: "/blacklist/exact"
    }
  };
  const wrapper = shallow(
    React.createElement(() => navDropdown(item, key, props))
  );

  expect(wrapper.key()).toEqual(key);
  expect(wrapper.childAt(0).childAt(0)).toHaveClassName(item.icon);
  expect(wrapper.childAt(0).childAt(1)).toHaveText(item.name);
  expect(wrapper.childAt(1).children()).toHaveLength(0);
});

it("shows auth routes when logged in", () => {
  api.loggedIn = true;

  const item = {
    name: "Query Log",
    url: "/query-log",
    icon: "fa fa-database",
    auth: true
  };
  const wrapper = shallow(
    React.createElement(() => <ul>{navList([item], { t: key => key })}</ul>)
  );

  expect(wrapper.children()).toHaveLength(1);
});

it("hides auth routes when not logged in", () => {
  api.loggedIn = false;

  const item = {
    name: "Query Log",
    url: "/query-log",
    icon: "fa fa-database",
    auth: true
  };
  const wrapper = shallow(
    React.createElement(() => <ul>{navList([item], { t: key => key })}</ul>)
  );

  expect(wrapper.children()).toHaveLength(0);
});

it("hides strict non-auth routes when logged in", () => {
  api.loggedIn = true;

  const item = {
    name: "Login",
    url: "/login",
    icon: "fa fa-user",
    auth: false,
    authStrict: true
  };
  const wrapper = shallow(
    React.createElement(() => <ul>{navList([item], { t: key => key })}</ul>)
  );

  expect(wrapper.children()).toHaveLength(0);
});

it("hides strict auth routes when not logged in", () => {
  api.loggedIn = false;

  const item = {
    name: "Logout",
    url: "/logout",
    icon: "fa fa-user-times",
    auth: true,
    authStrict: true
  };
  const wrapper = shallow(
    React.createElement(() => <ul>{navList([item], { t: key => key })}</ul>)
  );

  expect(wrapper.children()).toHaveLength(0);
});

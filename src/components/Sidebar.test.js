/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Sidebar component test
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Fragment } from "react";
import { shallow } from "enzyme";
import { dropDownClassList, navItem } from "./Sidebar";

it("expands active drop down items", () => {
  const classList = dropDownClassList("testRoute", { location: { pathname: "/someRoute/testRoute/page" } });

  expect(classList).toContain("open");
});

it("does not expand inactive drop down items", () => {
  const classList = dropDownClassList("testRoute", { location: { pathname: "/someRoute/page" } });

  expect(classList).not.toContain("open");
});

it("creates nav items with correct data", () => {
  const itemData = { url: "/testUrl", icon: "test-icon", name: "testName" };
  const key = "testKey";
  const item = shallow(React.createElement(() => navItem(itemData, key, { t: key => key })));

  expect(item.key()).toEqual(key);
  expect(item.childAt(0)).toHaveProp("to", itemData.url);
  expect(item.childAt(0).childAt(0)).toHaveClassName(itemData.icon);
  expect(item.childAt(0).childAt(1)).toHaveText(itemData.name);
});

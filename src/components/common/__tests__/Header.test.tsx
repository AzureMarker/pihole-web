/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Header component test
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { MouseEvent } from "react";
import api from "../../../util/api";
import { shallow } from "enzyme";
import Header from "../Header";
import { TimeRangeSelectorContainer } from "../../dashboard/TimeRangeSelector";

it("shows the time range selector on the dashboard", () => {
  api.loggedIn = true;
  history.pushState({}, "", "/dashboard");

  const wrapper = shallow(<Header />);

  expect(wrapper.find(TimeRangeSelectorContainer)).toExist();
});

it("does not show the time range selector when not logged in", () => {
  api.loggedIn = false;
  history.pushState({}, "", "/dashboard");

  const wrapper = shallow(<Header />);

  expect(wrapper.find(TimeRangeSelectorContainer)).not.toExist();
});

it("does not show the time range selector on non-dashboard pages", () => {
  api.loggedIn = true;
  history.pushState({}, "", "/whitelist");

  const wrapper = shallow(<Header />);

  expect(wrapper.find(TimeRangeSelectorContainer)).not.toExist();
});

it("toggle the sidebar when clicked", () => {
  const wrapper = shallow(<Header />);

  expect(document.body.classList).not.toContain("sidebar-minimized");
  expect(document.body.classList).not.toContain("brand-minimized");

  wrapper
    .find(".sidebar-toggler")
    .simulate("click", { preventDefault: () => {} });

  expect(document.body.classList).toContain("sidebar-minimized");
  expect(document.body.classList).toContain("brand-minimized");
});

it("toggle the sidebar on mobile when clicked", () => {
  const wrapper = shallow(<Header />);

  expect(document.body.classList).not.toContain("sidebar-show");

  wrapper
    .find(".navbar-toggler")
    .first()
    .simulate("click", { preventDefault: () => {} });

  expect(document.body.classList).toContain("sidebar-show");
});

/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  SummaryStats component test
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from "react";
import { shallow } from "enzyme";
import fetchMock from "fetch-mock";
import StatusBadge from "./StatusBadge";

const endpoint = "/admin/api/dns/status";

it("shows green enabled message if API returns enabled", async () => {
  fetchMock.mock(endpoint, { body: { status: "enabled" } });

  const wrapper = shallow(<StatusBadge />);

  await tick();
  wrapper.update();

  expect(wrapper.childAt(2)).toHaveText("Enabled");
  expect(wrapper.childAt(0)).toHaveClassName("text-success");
});

it("shows red disabled message if API doesn't return enabled", async () => {
  fetchMock.mock(endpoint, { body: { status: "disabled" } });

  const wrapper = shallow(<StatusBadge />);

  await tick();
  wrapper.update();

  expect(wrapper.childAt(2)).toHaveText("Disabled");
  expect(wrapper.childAt(0)).toHaveClassName("text-danger");
});

it("shows disabled message if API call failed", async () => {
  fetchMock.mock(endpoint, { error: {} });

  const wrapper = shallow(<StatusBadge />);

  await tick();
  wrapper.update();

  expect(wrapper.childAt(2)).toHaveText("Disabled");
  expect(wrapper.childAt(0)).toHaveClassName("text-danger");
});

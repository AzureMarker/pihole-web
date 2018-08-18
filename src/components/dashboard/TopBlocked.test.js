/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  TopBlocked component test
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from "react";
import { shallow } from "enzyme";
import fetchMock from "fetch-mock";
import TopBlocked from "./TopBlocked";

const endpoint = "/admin/api/stats/top_blocked";
const fakeData = {
  top_blocked: [
    { domain: "jaron.info", count: 54316 },
    { domain: "candelario.info", count: 47470 },
    { domain: "delphia.info", count: 41629 },
    { domain: "wilbert.name", count: 31055 },
    { domain: "raina.biz", count: 29491 },
    { domain: "rowan.name", count: 26390 },
    { domain: "marielle.net", count: 25417 },
    { domain: "johann.name", count: 23633 },
    { domain: "sarah.org", count: 7485 },
    { domain: "cleora.org", count: 1589 }
  ],
  blocked_queries: 61887
};

it("loads the API data into state correctly", async () => {
  fetchMock.mock(endpoint, fakeData);

  const wrapper = shallow(<TopBlocked/>).dive();

  await tick();
  wrapper.update();

  expect(wrapper.state().total_blocked).toEqual(fakeData.blocked_queries);
  expect(wrapper.state().top_blocked).toEqual(fakeData.top_blocked);
});

it("creates an appropriately sized table", async () => {
  fetchMock.mock(endpoint, fakeData);

  const wrapper = shallow(<TopBlocked/>).dive();

  await tick();
  wrapper.update();

  // Add one to the expected length to account for the table header
  expect(wrapper.find("tbody").children("tr")).toHaveLength(fakeData.top_blocked.length + 1);
});

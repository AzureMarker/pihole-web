/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  TopDomains component test
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from "react";
import { shallow } from "enzyme";
import fetchMock from "fetch-mock";
import TopDomains from "./TopDomains";

const endpoint = "/admin/api/stats/top_domains";
const fakeData = {
  top_domains: [
    { domain: "willow.com", count: 13739 },
    { domain: "maurine.info", count: 13397 },
    { domain: "quincy.name", count: 13325 },
    { domain: "rachelle.info", count: 10772 },
    { domain: "ernestina.info", count: 10449 },
    { domain: "sabina.com", count: 8328 },
    { domain: "oceane.info", count: 7130 },
    { domain: "jeramie.org", count: 6421 },
    { domain: "olin.com", count: 4587 },
    { domain: "kattie.biz", count: 1748 }
  ],
  total_queries: 16549
};

it("loads the API data into state correctly", async () => {
  fetchMock.mock(endpoint, fakeData);

  const wrapper = shallow(<TopDomains/>).dive();

  await tick();
  wrapper.update();

  expect(wrapper.state().total_queries).toEqual(fakeData.total_queries);
  expect(wrapper.state().top_domains).toEqual(fakeData.top_domains);
});

it("creates an appropriately sized table", async () => {
  fetchMock.mock(endpoint, fakeData);

  const wrapper = shallow(<TopDomains/>).dive();

  await tick();
  wrapper.update();

  // Add one to the expected length to account for the table header
  expect(wrapper.find("tbody").children("tr")).toHaveLength(fakeData.top_domains.length + 1);
});

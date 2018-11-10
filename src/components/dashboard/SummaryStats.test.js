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
import {
  TranslatedSummaryStats,
  transformData,
  errorState
} from "./SummaryStats";

const fakeData = {
  domains_blocked: 10193,
  total_queries: 58787,
  blocked_queries: 30175,
  percent_blocked: 51.329375542211714,
  unique_domains: 33209,
  forwarded_queries: 33149,
  cached_queries: 25638,
  total_clients: 76083,
  unique_clients: 28949,
  status: "enabled"
};

it("transforms the API data correctly", () => {
  const expectedProps = {
    totalQueries: "58,787",
    blockedQueries: "30,175",
    percentBlocked: "51.33%",
    gravityDomains: "10,193",
    uniqueClients: 28949
  };

  expect(transformData(fakeData)).toEqual(expectedProps);
});

it("displays summary stats correctly", async () => {
  const wrapper = shallow(
    <TranslatedSummaryStats {...transformData(fakeData)} />
  );

  await tick();
  wrapper.update();

  expect(wrapper.childAt(0).find("h3")).toHaveText(
    fakeData.total_queries.toLocaleString()
  );
  expect(wrapper.childAt(1).find("h3")).toHaveText(
    fakeData.blocked_queries.toLocaleString()
  );
  expect(wrapper.childAt(2).find("h3")).toHaveText(
    fakeData.percent_blocked.toFixed(2).toLocaleString() + "%"
  );
  expect(wrapper.childAt(3).find("h3")).toHaveText(
    fakeData.domains_blocked.toLocaleString()
  );
});

it("displays error message correctly", async () => {
  const wrapper = shallow(<TranslatedSummaryStats {...errorState()} />);

  await tick();
  wrapper.update();

  expect(wrapper.childAt(0).find("h3")).toHaveText("Lost");
  expect(wrapper.childAt(1).find("h3")).toHaveText("Connection");
  expect(wrapper.childAt(2).find("h3")).toHaveText("To");
  expect(wrapper.childAt(3).find("h3")).toHaveText("API");
});

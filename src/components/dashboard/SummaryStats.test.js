/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * SummaryStats component test
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import { shallow } from "enzyme";
import {
  TranslatedSummaryStats,
  transformData,
  errorProps
} from "./SummaryStats";

const fakeData = {
  active_clients: 2,
  blocked_queries: 2281,
  cached_queries: 3573,
  forwarded_queries: 19154,
  gravity_size: 129538,
  percent_blocked: 10.0,
  reply_types: {
    CNAME: 0,
    DOMAIN: 2,
    IP: 1300,
    NODATA: 564,
    NXDOMAIN: 12
  },
  status: "enabled",
  total_clients: 2,
  total_queries: {
    A: 14802,
    AAAA: 7754,
    ANY: 0,
    PTR: 29,
    SOA: 0,
    SRV: 228,
    TXT: 0
  },
  unique_domains: 15
};

it("transforms the API data correctly", () => {
  const expectedProps = {
    totalQueries: "22,813",
    blockedQueries: "2,281",
    percentBlocked: "10.00%",
    gravityDomains: "129,538",
    uniqueClients: 2
  };

  expect(transformData(fakeData)).toEqual(expectedProps);
});

it("displays summary stats correctly", async () => {
  const wrapper = shallow(
    <TranslatedSummaryStats {...transformData(fakeData)} />
  );

  await tick();
  wrapper.update();

  expect(wrapper.childAt(0).find("h3")).toHaveText("22,813");
  expect(wrapper.childAt(1).find("h3")).toHaveText("2,281");
  expect(wrapper.childAt(2).find("h3")).toHaveText("10.00%");
  expect(wrapper.childAt(3).find("h3")).toHaveText("129,538");
});

it("displays error message correctly", async () => {
  const wrapper = shallow(<TranslatedSummaryStats {...errorProps} />);

  await tick();
  wrapper.update();

  expect(wrapper.childAt(0).find("h3")).toHaveText("Lost");
  expect(wrapper.childAt(1).find("h3")).toHaveText("Connection");
  expect(wrapper.childAt(2).find("h3")).toHaveText("To");
  expect(wrapper.childAt(3).find("h3")).toHaveText("API");
});

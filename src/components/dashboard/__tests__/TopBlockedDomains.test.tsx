/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * TopBlockedDomains component test
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import { generateRows, transformData } from "../TopBlockedDomains";

const fakeData: ApiTopBlockedDomains = {
  top_domains: [
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

it("transforms the API data correctly", async () => {
  const data = transformData(fakeData);

  expect(data.totalBlocked).toEqual(fakeData.blocked_queries);
  expect(data.topBlocked).toEqual(fakeData.top_domains);
});

it("creates an appropriately sized table", async () => {
  const rows = generateRows(global.t)(transformData(fakeData));

  expect(rows).toHaveLength(fakeData.top_domains.length);
});

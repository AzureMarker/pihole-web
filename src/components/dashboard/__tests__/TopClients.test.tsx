/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * TopClients component test
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import { generateRows, transformData } from "../TopClients";

const fakeData: ApiTopClients = {
  top_clients: [
    { name: "", ip: "21.43.61.185", count: 37586 },
    { name: "", ip: "224.77.182.60", count: 28664 },
    { name: "", ip: "254.251.126.14", count: 28353 },
    { name: "", ip: "45.236.46.22", count: 26034 },
    { name: "", ip: "134.169.112.176", count: 23587 },
    { name: "", ip: "59.190.76.175", count: 14595 },
    { name: "", ip: "108.137.74.87", count: 11953 },
    { name: "", ip: "127.219.136.176", count: 11715 },
    { name: "", ip: "172.134.110.216", count: 5954 },
    { name: "", ip: "243.77.12.200", count: 4703 }
  ],
  total_queries: 38451
};

it("transforms the API data correctly", async () => {
  const data = transformData(fakeData);

  expect(data.totalQueries).toEqual(fakeData.total_queries);
  expect(data.topClients).toEqual(fakeData.top_clients);
});

it("creates an appropriately sized table", async () => {
  const rows = generateRows(key => key)(transformData(fakeData));

  expect(rows).toHaveLength(fakeData.top_clients.length);
});

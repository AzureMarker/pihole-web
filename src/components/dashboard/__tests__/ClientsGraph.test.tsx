/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * ClientsGraph component test
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import { shallow } from "enzyme";
import {
  loadingProps,
  transformData,
  TranslatedClientsGraph
} from "../ClientsGraph";

const fakeData: ApiClientsGraph = {
  over_time: [
    { timestamp: 1513218354, data: [48476, 35688, 95153, 56971, 83497] },
    { timestamp: 1513218954, data: [53603, 88146, 17471, 3039, 33678] },
    { timestamp: 1513219554, data: [4390, 17405, 40846, 89063, 60714] },
    { timestamp: 1513220154, data: [16004, 73869, 18194, 68378, 63864] },
    { timestamp: 1513220754, data: [46542, 88508, 52954, 79578, 26691] },
    { timestamp: 1513221354, data: [96398, 29977, 78724, 58240, 69007] },
    { timestamp: 1513221954, data: [10924, 45703, 92305, 30644, 37037] },
    { timestamp: 1513222554, data: [22372, 15812, 80202, 74595, 94951] },
    { timestamp: 1513223154, data: [31945, 60973, 78084, 79314, 9466] },
    { timestamp: 1513223754, data: [20971, 341, 75043, 94344, 71002] }
  ],
  clients: [
    { name: "nelda", ip: "17.12.208.248" },
    { name: "", ip: "211.248.123.52" },
    { name: "danyka", ip: "141.84.19.123" },
    { name: "", ip: "181.237.62.132" },
    { name: "wilfrid", ip: "134.239.133.90" }
  ]
};

it("shows loading indicator correctly", () => {
  const wrapper = shallow(<TranslatedClientsGraph {...loadingProps} />).dive();

  expect(wrapper.children(".card-img-overlay")).toExist();
});

it("hides loading indicator correctly", async () => {
  const wrapper = shallow(
    <TranslatedClientsGraph {...loadingProps} loading={false} />
  );

  expect(wrapper.children(".card-img-overlay")).not.toExist();
});

it("loads API data correctly", async () => {
  const props = transformData(fakeData, null);

  expect(props.labels[0]).toEqual(
    new Date(1000 * fakeData.over_time[0].timestamp).toISOString()
  );
  expect(props.datasets[2].label).toEqual(fakeData.clients[2].name);
  expect(props.datasets[1].label).toEqual(fakeData.clients[1].ip);
  expect(props.datasets[0].data!.length).toEqual(fakeData.over_time.length - 1);
});

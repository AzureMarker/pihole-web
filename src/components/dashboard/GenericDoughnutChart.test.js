/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * GenericDoughnutChart component test
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import { shallow } from "enzyme";
import {
  GenericDoughnutChart,
  transformData,
  loadingProps
} from "./GenericDoughnutChart";

const fakeData = [
  { name: "roberta.net", ip: "8.239.48.32", percent: 0.38411761010240625 },
  { name: "", ip: "89.60.252.186", percent: 0.2830935477791041 },
  { name: "christop.net", ip: "181.219.42.222", percent: 0.6249293208519193 }
];

it("shows loading indicator correctly", () => {
  const wrapper = shallow(
    <GenericDoughnutChart title={""} {...loadingProps} />
  );

  expect(wrapper.children(".card-img-overlay")).toExist();
});

it("hides loading indicator correctly", async () => {
  const wrapper = shallow(
    <GenericDoughnutChart title={""} {...loadingProps} loading={false} />
  );

  expect(wrapper.children(".card-img-overlay")).not.toExist();
});

it("loads API data correctly", async () => {
  const data = transformData(fakeData);

  expect(data.colors).toEqual(["#20a8d8", "#f86c6b", "#4dbd74"]);
  expect(data.labels[0]).toEqual(fakeData[0].name);
  expect(data.labels[1]).toEqual(fakeData[1].ip);
  expect(data.data).toEqual(fakeData.map(entry => entry.percent));
});

it("displays the title", () => {
  const title = "title";
  const wrapper = shallow(
    <GenericDoughnutChart title={title} {...loadingProps} />
  );

  expect(wrapper.find(".card-header")).toHaveText(title);
});

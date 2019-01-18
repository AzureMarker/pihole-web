/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * TopTable component test
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import { shallow } from "enzyme";
import { TopTable } from "./TopTable";

it("shows loading indicator correctly", () => {
  const wrapper = shallow(<TopTable loading={true} />);

  expect(wrapper.children().last()).toHaveClassName("card-img-overlay");
});

it("hides loading indicator correctly", async () => {
  const wrapper = shallow(<TopTable loading={false} />);

  expect(wrapper.children().last()).toHaveClassName("card-body");
});

it("sets the title", () => {
  const title = "testTitle";
  const wrapper = shallow(<TopTable title={title} />);

  expect(wrapper.find(".card-header")).toHaveText(title);
});

it("adds the headers", () => {
  const headers = ["header1", "header2", "header3"];
  const wrapper = shallow(
    <TopTable loading={false} headers={headers} isEmpty={() => false} />
  );

  expect(
    wrapper
      .find("tbody")
      .childAt(0)
      .children("th")
      .map(child => child.text())
  ).toEqual(headers);
});

it("shows the empty message when empty", () => {
  const emptyMessage = "testEmptyMessage";
  const wrapper = shallow(
    <TopTable
      loading={false}
      emptyMessage={emptyMessage}
      isEmpty={() => true}
    />
  );

  expect(wrapper.find(".card-body").childAt(0)).toHaveText(emptyMessage);
});

it("does not call generateRows when empty", () => {
  const generateRows = jest.fn();
  shallow(
    <TopTable
      loading={false}
      isEmpty={() => true}
      generateRows={generateRows}
    />
  );

  expect(generateRows).not.toHaveBeenCalled();
});

it("calls generateRows with state when not empty", () => {
  const data = { someData: true };
  const generateRows = jest.fn();
  shallow(
    <TopTable data={data} isEmpty={() => false} generateRows={generateRows} />
  );

  expect(generateRows).toHaveBeenCalledWith(data);
});

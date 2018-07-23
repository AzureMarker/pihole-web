/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  TopTable component test
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from "react";
import { shallow } from "enzyme";
import TopTable from "./TopTable";

it("shows loading indicator before first load", () => {
  const wrapper = shallow(
    <TopTable
      title={""}
      headers={[]}
      emptyMessage={""}
      isEmpty={() => true}
      apiCall={ignoreAPI}
      apiHandler={jest.fn()}
      generateRows={jest.fn()}/>
  );

  expect(wrapper.state().loading).toBeTruthy();
  expect(wrapper.children().last()).toHaveClassName("card-img-overlay");
});

it("hides loading indicator after first load", async () => {
  const wrapper = shallow(
    <TopTable
      title={""}
      headers={[]}
      emptyMessage={""}
      isEmpty={() => true}
      apiCall={() => Promise.resolve()}
      apiHandler={self => self.setState({ loading: false })}
      generateRows={jest.fn()}/>
  );

  await tick();
  wrapper.update();

  expect(wrapper.state().loading).toBeFalsy();
  expect(wrapper.children().last()).toHaveClassName("card-body");
});

it("sets the initial state", () => {
  const wrapper = shallow(
    <TopTable
      title={""}
      initialState={{
        testInitialState: true
      }}
      headers={[]}
      emptyMessage={""}
      isEmpty={() => true}
      apiCall={ignoreAPI}
      apiHandler={jest.fn()}
      generateRows={jest.fn()}/>
  );

  expect(wrapper.state().testInitialState).toEqual(true);
});

it("sets the title", () => {
  const title = "testTitle";
  const wrapper = shallow(
    <TopTable
      title={title}
      headers={[]}
      emptyMessage={""}
      isEmpty={() => true}
      apiCall={ignoreAPI}
      apiHandler={jest.fn()}
      generateRows={jest.fn()}/>
  );

  expect(wrapper.find(".card-header")).toHaveText(title);
});

it("adds the headers", () => {
  const headers = [
    "header1",
    "header2",
    "header3"
  ];
  const wrapper = shallow(
    <TopTable
      title={""}
      initialState={{ loading: false }}
      headers={headers}
      emptyMessage={""}
      isEmpty={() => false}
      apiCall={ignoreAPI}
      apiHandler={jest.fn()}
      generateRows={jest.fn()}/>
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
      title={""}
      initialState={{ loading: false }}
      headers={[]}
      emptyMessage={emptyMessage}
      isEmpty={() => true}
      apiCall={ignoreAPI}
      apiHandler={jest.fn()}
      generateRows={jest.fn()}/>
  );

  expect(wrapper.find(".card-body").childAt(0)).toHaveText(emptyMessage);
});

it("calls apiCall and apiHandler to retrieve data", async () => {
  const apiData = { called: true };
  const apiCall = jest.fn(() => Promise.resolve(apiData));
  const apiHandler = jest.fn();
  const wrapper = shallow(
    <TopTable
      title={""}
      headers={[]}
      emptyMessage={""}
      isEmpty={() => true}
      apiCall={apiCall}
      apiHandler={apiHandler}
      generateRows={jest.fn()}/>
  );

  await tick();

  expect(apiCall).toHaveBeenCalled();
  expect(apiHandler).toHaveBeenCalledWith(wrapper.instance(), apiData);
});

it("does not call generateRows when empty", () => {
  const generateRows = jest.fn();
  shallow(
    <TopTable
      title={""}
      initialState={{ loading: false }}
      headers={[]}
      emptyMessage={""}
      isEmpty={() => true}
      apiCall={ignoreAPI}
      apiHandler={jest.fn()}
      generateRows={generateRows}/>
  );

  expect(generateRows).not.toHaveBeenCalled();
});

it("calls generateRows with state when not empty", () => {
  const state = { loading: false };
  const generateRows = jest.fn();
  shallow(
    <TopTable
      title={""}
      initialState={state}
      headers={[]}
      emptyMessage={""}
      isEmpty={() => false}
      apiCall={ignoreAPI}
      apiHandler={jest.fn()}
      generateRows={generateRows}/>
  );

  expect(generateRows).toHaveBeenCalledWith(state);
});

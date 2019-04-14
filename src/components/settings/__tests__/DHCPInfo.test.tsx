/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * DHCPInfo component test
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import DHCPInfo, { DHCPInfoState } from "../DHCPInfo";
import fetchMock from "fetch-mock";
import { WithNamespaces } from "react-i18next";

const tick = global.tick;

const endpoint = "/api/settings/dhcp";
const fakeData = {
  active: true,
  ip_start: "192.168.1.50",
  ip_end: "192.168.1.150",
  router_ip: "192.168.1.1",
  lease_time: "24",
  domain: "lan",
  ipv6_support: false
};

it("retrieves settings correctly", async () => {
  fetchMock.mock(endpoint, { body: fakeData });

  const wrapper = shallow(<DHCPInfo />);

  await tick();

  expect(wrapper.state("settings")).toEqual(fakeData);
});

it("disables the apply button if an input is invalid", async () => {
  fetchMock.mock(endpoint, { body: fakeData });

  const wrapper = shallow(<DHCPInfo />);

  await tick();

  expect(wrapper.find("Button")).not.toBeDisabled();

  wrapper.find("#domain").simulate("change", { target: { value: "" } });

  expect(wrapper.find("Button")).toBeDisabled();
});

it("disables inputs only when DHCP is not enabled", async () => {
  fetchMock.mock(endpoint, { body: fakeData });

  const wrapper: ShallowWrapper<WithNamespaces, DHCPInfoState> = shallow(
    <DHCPInfo />
  );

  await tick();
  wrapper.update();

  expect(wrapper.find("#domain")).not.toBeDisabled();

  wrapper.setState({
    settings: { ...wrapper.state().settings, active: false }
  });

  expect(wrapper.find("#domain")).toBeDisabled();
});

it("disables the apply button when processing setting update", async () => {
  fetchMock.get(endpoint, { body: fakeData });
  fetchMock.put(endpoint, { body: { status: "success" } });

  const wrapper: ShallowWrapper<WithNamespaces, DHCPInfoState> = shallow(
    <DHCPInfo />
  );

  await tick();

  expect(wrapper.state().processing).toBeFalsy();
  expect(wrapper.find("Button")).not.toBeDisabled();

  wrapper.find("Form").simulate("submit", { preventDefault: jest.fn() });

  expect(wrapper.state().processing).toBeTruthy();
  expect(wrapper.find("Button")).toBeDisabled();
});

it("sends the correct data to the API when apply is clicked", async () => {
  fetchMock.get(endpoint, { body: fakeData });
  fetchMock.put(endpoint, { body: { status: "success" } });

  const wrapper: ShallowWrapper<WithNamespaces, DHCPInfoState> = shallow(
    <DHCPInfo />
  );

  await tick();

  expect(wrapper.state().processing).toBeFalsy();
  expect(wrapper.find("Button")).not.toBeDisabled();

  wrapper.find("Form").simulate("submit", { preventDefault: jest.fn() });

  expect(wrapper.state().processing).toBeTruthy();
  expect(wrapper.find("Button")).toBeDisabled();

  // The output of lastCall is [url, request]
  const updateRequest = fetchMock.lastCall(endpoint)![1];

  expect(JSON.parse(updateRequest!.body as string)).toEqual(fakeData);
});

it("shows a success message after successfully saving settings", async () => {
  fetchMock.get(endpoint, { body: fakeData });
  fetchMock.put(endpoint, { body: { status: "success" } });

  const wrapper = shallow(<DHCPInfo />);

  wrapper.find("Form").simulate("submit", { preventDefault: jest.fn() });

  await tick();
  wrapper.update();

  expect(wrapper.find("Alert")).toHaveProp("type", "success");
});

it("shows an API error message if an API error occurs when saving settings", async () => {
  fetchMock.get(endpoint, { body: fakeData });
  fetchMock.put(endpoint, {
    body: { error: { key: "unknown", message: "Unknown", data: null } }
  });

  const wrapper = shallow(<DHCPInfo />);

  wrapper.find("Form").simulate("submit", { preventDefault: jest.fn() });

  await tick();
  wrapper.update();

  expect(wrapper.find("Alert")).toHaveProp("type", "danger");
});

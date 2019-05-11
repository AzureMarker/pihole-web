/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * DomainList component test
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import { shallow } from "enzyme";
import DomainList from "../DomainList";
import api from "../../../util/api";
import Alert from "../../common/Alert";

const domains = ["domain1.com", "domain2.com", "domain3.com"];

it("shows a list of domains", () => {
  const wrapper = shallow(
    <DomainList domains={domains} onRemove={jest.fn()} />
  ).dive();

  expect(wrapper.find("li")).toHaveLength(domains.length);
});

it("shows an alert if there are no domains", () => {
  const wrapper = shallow(
    <DomainList domains={[]} onRemove={jest.fn()} />
  ).dive();

  expect(wrapper.find("li")).not.toExist();
  expect(wrapper.find(Alert)).toExist();
  expect(wrapper.find(Alert).props().message).toEqual(
    "There are no domains in this list"
  );
});

it("does not have a delete button when not logged in", () => {
  const wrapper = shallow(
    <DomainList domains={domains} onRemove={jest.fn()} />
  );

  expect(wrapper.find("Button")).not.toExist();
});

it("has a delete button when logged in", () => {
  api.loggedIn = true;

  const wrapper = shallow(
    <DomainList domains={domains} onRemove={jest.fn()} />
  ).dive();

  expect(
    wrapper
      .find("ul")
      .childAt(0)
      .find("Button")
  ).toExist();
});

it("calls onRemove when a delete button is clicked", () => {
  api.loggedIn = true;

  const onRemove = jest.fn();
  const wrapper = shallow(
    <DomainList domains={domains} onRemove={onRemove} />
  ).dive();

  wrapper
    .find("ul")
    .childAt(0)
    .find("Button")
    .simulate("click");

  expect(onRemove).toHaveBeenCalled();
});

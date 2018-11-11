/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  DomainList component test
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from "react";
import { shallow } from "enzyme";
import DomainList from "./DomainList";
import api from "../../util/api";

const domains = ["domain1.com", "domain2.com", "domain3.com"];

it("shows a list of domains", () => {
  const wrapper = shallow(
    <DomainList domains={domains} onRemove={jest.fn()} />
  );

  expect(wrapper.find("li")).toHaveLength(domains.length);
});

it("shows an alert if there are no domains", () => {
  const wrapper = shallow(<DomainList domains={[]} onRemove={jest.fn()} />);

  expect(wrapper.find("li")).toHaveLength(0);
  expect(wrapper.find("ul").childAt(0)).toHaveClassName("alert-info");
  expect(wrapper).toIncludeText("There are no domains in this list");
});

it("does not have a delete button when not logged in", () => {
  const wrapper = shallow(
    <DomainList domains={domains} onRemove={jest.fn()} />
  );

  expect(
    wrapper
      .find("ul")
      .childAt(0)
      .find("button")
  ).not.toExist();
});

it("has a delete button when logged in", () => {
  api.loggedIn = true;

  const wrapper = shallow(
    <DomainList domains={domains} onRemove={jest.fn()} />
  );

  expect(
    wrapper
      .find("ul")
      .childAt(0)
      .find("button")
  ).toExist();
});

it("calls onRemove when a delete button is clicked", () => {
  api.loggedIn = true;

  const onRemove = jest.fn();
  const wrapper = shallow(<DomainList domains={domains} onRemove={onRemove} />);

  wrapper
    .find("ul")
    .childAt(0)
    .find("button")
    .simulate("click");

  expect(onRemove).toHaveBeenCalled();
});

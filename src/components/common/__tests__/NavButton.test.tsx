/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * NavButton component test
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import { shallow } from "enzyme";
import NavButton from "../NavButton";

it("renders with the given icon and name", () => {
  const name = "testName";
  const icon = "testIcon";
  const wrapper = shallow(<NavButton name={name} icon={icon} />);

  expect(wrapper).toHaveText(name);
  expect(wrapper.find("i")).toHaveClassName(icon);
});

it("calls onClick when clicked", () => {
  const onClick = jest.fn();
  const event = { test: true };
  const wrapper = shallow(
    <NavButton name="name" icon="icon" onClick={onClick} />
  );

  wrapper.find("a").simulate("click", event);

  expect(onClick).toHaveBeenCalledWith(event);
});

it("has a default onClick", () => {
  const event = { preventDefault: jest.fn() };
  const wrapper = shallow(<NavButton name="name" icon="icon" />);

  wrapper.find("a").simulate("click", event);

  expect(event.preventDefault).toHaveBeenCalled();
});

/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Alert component test
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import { shallow } from "enzyme";
import Alert from "../Alert";

it("renders an alert correctly", () => {
  const message = "test message";
  const onClick = jest.fn();
  const wrapper = shallow(
    <Alert type="info" message={message} onClick={onClick} />
  );

  expect(wrapper).toHaveClassName("alert-info");
  expect(wrapper).toIncludeText(message);
});

it("calls onClick when clicked", () => {
  const message = "test message";
  const onClick = jest.fn();
  const wrapper = shallow(
    <Alert type="info" message={message} onClick={onClick} />
  );

  wrapper.find("button").simulate("click");
  expect(onClick).toBeCalled();
});

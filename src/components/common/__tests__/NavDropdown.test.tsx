/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * NavDropdown component test
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import { shallow } from "enzyme";
import NavDropdown from "../NavDropdown";

it("renders as open when isOpen is true", () => {
  const wrapper = shallow(
    <NavDropdown name="test" icon="test" isOpen>
      {}
    </NavDropdown>
  );

  expect(wrapper.find("li")).toHaveClassName("open");
});

it("renders as closed when isOpen is false", () => {
  const wrapper = shallow(
    <NavDropdown name="test" icon="test" isOpen={false}>
      {}
    </NavDropdown>
  );

  expect(wrapper.find("li")).not.toHaveClassName("open");
});

it("toggles the dropdown when clicked", () => {
  const toggle = jest.fn();
  const wrapper = shallow(
    <NavDropdown name="test" icon="test" isOpen>
      {}
    </NavDropdown>
  );

  expect(wrapper.find("li")).toHaveClassName("open");

  wrapper.find("button").simulate("click", {
    preventDefault: () => {},
    target: {
      parentElement: {
        classList: {
          toggle
        }
      }
    }
  });

  expect(toggle).toHaveBeenCalledWith("open");
});

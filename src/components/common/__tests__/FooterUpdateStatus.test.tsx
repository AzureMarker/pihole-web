/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * FooterUpdateStatus component test
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import { shallow } from "enzyme";
import FooterUpdateStatus from "../FooterUpdateStatus";
import * as React from "react";
import { Link } from "react-router-dom";

it("renders as null if no update is available", () => {
  const wrapper = shallow(
    <FooterUpdateStatus updateAvailable={false} />
  ).dive();

  expect(wrapper).toBeEmptyRender();
});

it("renders a link to the versions page if there is an update", () => {
  const wrapper = shallow(<FooterUpdateStatus updateAvailable={true} />).dive();

  expect(wrapper.find(Link).props().to).toEqual("/settings/versions");
});

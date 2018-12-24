/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  SummaryStats component test
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from "react";
import { shallow } from "enzyme";
import { TranslatedStatusBadge } from "./StatusBadge";

it("shows green enabled message if API returns enabled", async () => {
  const wrapper = shallow(<TranslatedStatusBadge status="enabled" />);

  expect(wrapper.childAt(2)).toHaveText("Enabled");
  expect(wrapper.childAt(0)).toHaveClassName("text-success");
});

it("shows red disabled message if API doesn't return enabled", async () => {
  const wrapper = shallow(<TranslatedStatusBadge status="disabled" />);

  expect(wrapper.childAt(2)).toHaveText("Disabled");
  expect(wrapper.childAt(0)).toHaveClassName("text-danger");
});

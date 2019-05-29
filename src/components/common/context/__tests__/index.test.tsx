/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * React global context tests
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import { shallow } from "enzyme";
import { GlobalContextProvider } from "../index";

it("provides all global contexts", () => {
  const wrapper = shallow(
    <GlobalContextProvider>{null}</GlobalContextProvider>
  );

  expect(wrapper).toContainMatchingElement("StatusProvider");
  expect(wrapper).toContainMatchingElement("PreferencesProvider");
  expect(wrapper).toContainMatchingElement("TimeRangeProvider");
});

/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * React time range context tests
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import { shallow } from "enzyme";
import {
  TimeRange,
  TimeRangeContext,
  TimeRangeProvider
} from "../TimeRangeContext";
import moment from "moment";

it("provides null as the initial range", () => {
  const wrapper = shallow(<TimeRangeProvider>{null}</TimeRangeProvider>);

  expect(
    wrapper.find(TimeRangeContext.Provider).props().value.range
  ).toBeNull();
});

it("updates the range with the provided value", () => {
  const updatedRange: TimeRange = {
    from: moment(),
    until: moment(),
    name: ""
  };

  const wrapper = shallow(<TimeRangeProvider>{null}</TimeRangeProvider>);
  wrapper.find(TimeRangeContext.Provider).props().value.update(updatedRange);

  expect(wrapper.find(TimeRangeContext.Provider).props().value.range).toEqual(
    updatedRange
  );
});

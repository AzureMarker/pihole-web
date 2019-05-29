/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * React status context tests
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import {
  initialContext,
  StatusContextType,
  StatusProvider
} from "../StatusContext";
import { WithAPIData } from "../../WithAPIData";
import { shallow } from "enzyme";

it("provides the initial status while loading", () => {
  const wrapper = shallow(<StatusProvider>{null}</StatusProvider>)
    .find(WithAPIData)
    .renderProp("renderInitial")();

  expect(wrapper.props().value).toEqual(initialContext);
});

it("provides the fetched status after loading", () => {
  const statusResponse: ApiStatus = {
    status: "enabled"
  };
  const refresh = jest.fn();
  const expectedContext: StatusContextType = {
    status: "enabled",
    refresh
  };

  const wrapper = shallow(<StatusProvider>{null}</StatusProvider>)
    .find(WithAPIData)
    .renderProp("renderOk")(statusResponse, refresh);

  expect(wrapper.props().value).toEqual(expectedContext);
});

it("provides the initial status and refresh function if there's an error", () => {
  const refresh = jest.fn();
  const expectedContext: StatusContextType = {
    status: initialContext.status,
    refresh
  };

  const wrapper = shallow(<StatusProvider>{null}</StatusProvider>)
    .find(WithAPIData)
    .renderProp("renderErr")(null, refresh);

  expect(wrapper.props().value).toEqual(expectedContext);
});

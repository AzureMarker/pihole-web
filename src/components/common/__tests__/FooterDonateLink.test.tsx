/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Footer component test
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import { shallow } from "enzyme";
import FooterDonateLink from "../FooterDonateLink";

it("renders without crashing", () => {
  shallow(<FooterDonateLink t={(text: string) => text} />);
});

it("opens a new tab", () => {
  expect(
    shallow(<FooterDonateLink t={(text: string) => text} />).prop("target")
  ).toBe("_blank");
});

it("opens new tab securely", () => {
  expect(
    shallow(<FooterDonateLink t={(text: string) => text} />).prop("rel")
  ).toBe("noopener noreferrer");
});

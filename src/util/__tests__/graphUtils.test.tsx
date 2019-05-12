/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Graph utility tests
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import { padNumber, getIntervalForRange } from "../graphUtils";
import { TimeRange } from "../../components/common/context/TimeRangeContext";
import moment from "moment";

describe("padNumber", () => {
  it("pads 0 to 00", () => {
    expect(padNumber(0)).toEqual("00");
  });

  it("pads 1 to 01", () => {
    expect(padNumber(1)).toEqual("01");
  });

  it("pads 12 to 12", () => {
    expect(padNumber(12)).toEqual("12");
  });
});

describe("getIntervalForRange", () => {
  it("returns 10 minutes for 24 hours", () => {
    const range: TimeRange = {
      name: "24 Hours",
      from: moment().subtract(1, "day"),
      until: moment()
    };

    expect(getIntervalForRange(range)).toEqual(10 * 60);
  });

  it("returns 1 day for 144 days", () => {
    const range: TimeRange = {
      name: "144 days",
      // Use seconds instead of days to ensure the difference in epoch time is
      // equal to 144 days
      from: moment().subtract(144 * 24 * 60 * 60, "seconds"),
      until: moment()
    };

    expect(getIntervalForRange(range)).toEqual(24 * 60 * 60);
  });
});

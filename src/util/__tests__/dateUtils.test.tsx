/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Date/Time utility tests
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import { getTimeFromTimestamp } from "../dateUtils";

const timestamp = 1574713854;

describe("humanTimestamp", () => {
  it("returns the time \"Nov 25, 20:30:54\" from the input 1574713854", () => {
    expect(getTimeFromTimestamp(timestamp)).toEqual("Nov 25, 20:30:54");
  });
});

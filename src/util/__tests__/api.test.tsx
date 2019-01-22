/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Utility function tests
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import api from "../api";

// This is a dumb test used to set up the next test,
// which checks that the logged in state is reset before each test
it("sets logged in to true", () => {
  api.loggedIn = true;

  expect(api.loggedIn).toBeTruthy();
});

it("resets the logged in state for each test", () => {
  expect(api.loggedIn).toBeFalsy();
});

/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Auto-login Saga
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import { call } from "redux-saga/effects";
import api from "../../util/api";
import config from "../../config";

/**
 * A saga to automatically log in.
 *
 * Steps:
 * 1. Verify the logged in status with the server.
 * 2. If we thought we were logged out but the API does not require
 *    authentication, refresh the page so we start in logged-in mode.
 *
 * An alternative to refreshing the page is to provide the logged in state via
 * Redux. Until then, we have to refresh the page to update everything that uses
 * it.
 */
export function* autoLogin() {
  try {
    // Check if we are logged in
    yield call(api.checkAuthStatus);
  } catch (e) {
    if (e.key === "unauthorized") {
      // The API requires authentication and we are not already logged in
      return;
    }

    // An unexpected error occurred while checking our logged in state
    throw e;
  }

  if (!api.loggedIn) {
    if (config.fakeAPI) {
      // When using the fake API, set the cookie ourselves
      document.cookie = "user_id=;";
    }

    // No authentication is required for this API (we got a successful response
    // and have a valid cookie), but we initialized assuming we are not logged
    // in. Refresh the page so we start in logged-in mode.

    // @ts-ignore
    // It tries to use the deprecated reload which takes a boolean argument
    yield call([window.location, "reload"]);
  }
}

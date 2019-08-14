/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Redux sagas, which control side effects
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import { spawn } from "redux-saga/effects";
import { watchPreferences } from "./preferences";
import { autoLogin } from "./autoLogin";

/**
 * The root saga which sets up all other sagas
 */
export function* rootSaga() {
  yield spawn(watchPreferences);
  yield spawn(autoLogin);
}

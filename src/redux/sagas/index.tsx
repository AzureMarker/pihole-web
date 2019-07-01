/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Redux sagas, which control side effects
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import { put, takeEvery } from "redux-saga/effects";
import { preferencesRequest } from "../actions";
import { fetchPreferences } from "./preferences";

/**
 * The root saga which sets up all other sagas and triggers some on-startup
 * functions like fetching the preferences
 */
export function* rootSaga() {
  yield takeEvery(preferencesRequest.type, fetchPreferences);

  // Perform initial requests
  yield put(preferencesRequest());
}

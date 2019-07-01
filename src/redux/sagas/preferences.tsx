/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Preferences Saga
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import { call, put } from "redux-saga/effects";
import api from "../../util/api";
import { preferencesSuccess } from "../actions";
import { WEB_PREFERENCES_STORAGE_KEY } from "../../components/common/context/PreferencesContext";

/**
 * A saga to fetch web interface preferences from the API
 */
export function* fetchPreferences() {
  // Get the preferences from the API
  const preferences: ApiPreferences = yield call(api.getPreferences);

  // Cache them in local storage
  yield call(
    [localStorage, "setItem"],
    WEB_PREFERENCES_STORAGE_KEY,
    JSON.stringify(preferences)
  );

  // Update the store
  yield put(preferencesSuccess(preferences));
}

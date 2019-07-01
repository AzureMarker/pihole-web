/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Preferences Saga
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import { call, put, takeEvery } from "redux-saga/effects";
import { PayloadAction } from "redux-starter-kit";
import i18n from "i18next";
import api from "../../util/api";
import { preferencesRequest, preferencesSuccess } from "../actions";
import { WEB_PREFERENCES_STORAGE_KEY } from "../../components/common/context/PreferencesContext";

/**
 * Sets up action listeners and triggers the initial preferences fetch
 */
export function* watchPreferences() {
  yield takeEvery(preferencesRequest.type, fetchPreferences);
  yield takeEvery(preferencesSuccess.type, applyLanguage);

  // Perform initial request
  yield put(preferencesRequest());
}

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

/**
 * Update the language in i18next when it changes
 *
 * @param action The action with the preferences to cache
 */
export function* applyLanguage(action: PayloadAction<ApiPreferences>) {
  const language = action.payload.language;

  if (i18n.language === language) {
    // Don't change the language if it's already correctly set
    return;
  }

  yield call([i18n, "changeLanguage"], language);
}

/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Preferences Saga tests
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import { call } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { preferencesSuccess } from "../../actions";
import { cachePreferences, fetchPreferences } from "../preferences";
import { expectSaga } from "redux-saga-test-plan";
import api from "../../../util/api";
import config from "../../../config";
import { WEB_PREFERENCES_STORAGE_KEY } from "../../state/preferences";
import { ReduxState } from "../../state";

const preferences: ApiPreferences = {
  layout: "traditional",
  language: "test-language"
};

const action: PayloadAction<ApiPreferences> = {
  type: preferencesSuccess.type,
  payload: preferences
};

describe("fetchPreferences", () => {
  it("should retrieve the preferences from the API when not in fakeAPI mode", () => {
    return expectSaga(fetchPreferences)
      .provide([[call(api.getPreferences), preferences]])
      .call(api.getPreferences)
      .put(preferencesSuccess(preferences))
      .run();
  });

  it("should retrieve the preferences from the store when in fakeAPI mode", () => {
    config.fakeAPI = true;

    return expectSaga(fetchPreferences)
      .withState<ReduxState>({ preferences })
      .put(preferencesSuccess(preferences))
      .run();
  });
});

describe("cachePreferences", () => {
  it("should save the preferences into local storage", () => {
    return expectSaga(cachePreferences, action)
      .call(
        [localStorage, "setItem"],
        WEB_PREFERENCES_STORAGE_KEY,
        JSON.stringify(preferences)
      )
      .run();
  });
});

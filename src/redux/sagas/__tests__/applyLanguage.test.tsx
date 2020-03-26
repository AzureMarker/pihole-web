/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Apply language saga tests
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import i18n from "i18next";
import { testSaga } from "redux-saga-test-plan";
import { applyLanguage } from "../applyLanguage";
import { PayloadAction } from "@reduxjs/toolkit";
import { preferencesSuccess } from "../../actions";

describe("applyLanguage", () => {
  const action: PayloadAction<ApiPreferences> = {
    type: preferencesSuccess.type,
    payload: {
      layout: "traditional",
      language: "test-language"
    }
  };

  it("should not update i18next if the language is the same", () => {
    i18n.language = "test-language";

    testSaga(applyLanguage, action).next().isDone();
  });

  it("should update i18next if the language is different", () => {
    i18n.language = "en";

    testSaga(applyLanguage, action)
      .next()
      .call([i18n, "changeLanguage"], "test-language")
      .next()
      .isDone();
  });
});

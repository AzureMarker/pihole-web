/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Saga for updating language in i18next
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import { call } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import i18n from "i18next";

/**
 * Update the language in i18next when it changes
 *
 * @param action The action with the language to apply
 */
export function* applyLanguage(action: PayloadAction<ApiPreferences>) {
  const language = action.payload.language;

  // Only change the language if it's different
  if (i18n.language !== language) {
    yield call([i18n, "changeLanguage"], language);
  }
}

/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Saga for updating layout on change
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import { PayloadAction } from "@reduxjs/toolkit";
import { call } from "redux-saga/effects";

/**
 * Apply the web interface layout by changing the classes on document.body
 *
 * @param action The action with the layout to apply
 */
export function* applyLayout(action: PayloadAction<ApiPreferences>) {
  switch (action.payload.layout) {
    case "boxed":
      yield call([document.body.classList, "add"], "boxcontainer");
      yield call([document.body.classList, "add"], "background-image");
      break;
    case "traditional":
      yield call([document.body.classList, "remove"], "boxcontainer");
      yield call([document.body.classList, "remove"], "background-image");
      break;
  }
}

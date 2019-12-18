/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Redux reducers, which modify the state
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "../state";
import { preferencesSuccess } from "../actions";

export default createReducer(initialState, {
  [preferencesSuccess.type]: (state, action: PayloadAction<ApiPreferences>) => {
    state.preferences = action.payload;
    return state;
  }
});

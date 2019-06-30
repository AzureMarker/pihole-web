/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Configuration of the Redux state
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import { loadInitialPreferences } from "../../components/common/context/PreferencesContext";

export interface ReduxState {
  preferences: ApiPreferences;
}

export const initialState: ReduxState = {
  preferences: loadInitialPreferences()
};

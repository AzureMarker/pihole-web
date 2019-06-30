/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Redux actions, which trigger state updates
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import { createAction } from "redux-starter-kit";

export const setPreferences = createAction<ApiPreferences>("PREFERENCES_SET");

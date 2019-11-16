/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Development config
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import { Config } from "./config";

let apiUrlBase;

if (process.env.REACT_APP_CUSTOM_API_URL) {
  apiUrlBase = process.env.REACT_APP_CUSTOM_API_URL;
} else {
  apiUrlBase = process.env.PUBLIC_URL;
}

export default {
  developmentMode: true,
  fakeAPI: false,
  apiPath: apiUrlBase + "/api"
} as Config;

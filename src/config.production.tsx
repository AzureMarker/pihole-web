/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Production config
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import { Config } from "./config";

export default {
  developmentMode: false,
  fakeAPI: false,
  apiPath: process.env.PUBLIC_URL + "/api"
} as Config;

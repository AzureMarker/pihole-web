/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Config handler
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import developmentConfig from "./config.development";
import productionConfig from "./config.production";

let config: { developmentMode: boolean; fakeAPI: boolean };

if (process.env.NODE_ENV === "development") config = developmentConfig;
else config = productionConfig;

if (process.env.REACT_APP_FAKE_API) config.fakeAPI = true;

export default config;

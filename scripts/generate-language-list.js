/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Update languages.json with the current languages
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

const fs = require("fs-extra");
const ISO6391 = require("iso-639-1");

// Get the available languages
const languages = fs.readdirSync("public/i18n");
const languageMap = languages.map(lang => {
  return {
    "code": lang,
    "name": ISO6391.getName(lang)
  }
});

// Save the language list so the web interface knows what's available
fs.outputFileSync("src/languages.json", JSON.stringify(languageMap));

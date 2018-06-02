/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Update translations from POEditor
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

const fs = require("fs-extra");
const fetch = require('node-fetch');
const MultiProgress = require('multi-progress');

const PROJECT_ID = 66305;
const I18N_FOLDER = "public/i18n";

const multi = new MultiProgress(process.stderr);

const apiToken = process.env.POEDITOR_API_TOKEN;

if(!apiToken) {
  console.log("Please set the POEDITOR_API_TOKEN environment variable");
  process.exit(1);
}

/**
 * Convert a key-value map into a format for application/x-www-form-urlencoded
 *
 * @param data the key-value map
 * @returns {string} the encoded data
 */
function makeFormData(data) {
  return Object.keys(data)
    .map(key => `${key}=${data[key]}`)
    .join("&");
}

/**
 * Return a list of languages which are at least 90% translated
 */
function getTranslatedLanguages() {
  return fetch(
    "https://api.poeditor.com/v2/languages/list",
    {
      method: "POST",
      body: makeFormData({
        "api_token": apiToken,
        "id": PROJECT_ID,
      }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    }
  )
    .then(response => response.json())
    .then(data => {
      return data.result.languages
        .filter(lang => lang.percentage >= 90)
        .map(lang => lang.code)
    })
}

/**
 * Fetch a list of tagged strings from a language
 *
 * @param lang the language code
 * @param tag the tag
 * @param bar the progress bar
 */
function fetchTag(lang, tag, bar) {
  fetch(
    "https://api.poeditor.com/v2/projects/export",
    {
      method: "POST",
      body: makeFormData({
        "api_token": apiToken,
        "id": PROJECT_ID,
        "language": lang,
        "type": "json",
        "tags": tag
      }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    }
  )
    .then(exportResponse => {
      bar.tick();
      return exportResponse.json();
    })
    .then(exportData => fetch(exportData.result.url))
    .then(langResponse => {
      bar.tick();
      return langResponse.json();
    })
    .then(langData => {
      const parsedData = langData.reduce((map, item) => {

        // Check for plurals
        if(typeof item.definition === "string") {
          map[item.term] = item.definition;
        } else if(item.definition === null) {
          // Don't add missing strings. They will be loaded from the fallback language.
          return map;
        } else {
          // Check if there's just singular and plural
          if(Object.keys(item.definition).length === 2) {
            map[item.term] = item.definition["one"];
            map[item.term + "_plural"] = item.definition["other"];
          } else {
            // Map POEditor's plural keys to i18next's plural suffixes
            const pluralMap = {
              "zero": "0",
              "one": "1",
              "two": "2",
              "few": "3",
              "many": "4",
              "other": "5"
            };

            // Add the various plural keys
            for(let plural of Object.keys(item.definition))
              map[item.term + "_" + pluralMap[plural]] = item.definition[plural];
          }
        }

        return map;
      }, {});

      fs.outputFileSync(`${I18N_FOLDER}/${lang}/${tag}.json`, JSON.stringify(parsedData, null, 4));
      bar.tick();
    });
}

/**
 * Fetch all the tags of the language.
 *
 * @param lang the language
 */
function fetchAllTags(lang) {
  const tags = [
    "common",
    "location",
    "dashboard",
    "query-log",
    "lists",
    "login",
    "footer"
  ];

  const bar = multi.newBar(`${lang}\t:percent\t[:bar]`, {
    // 3 steps per tag: export, download, and parse
    total: 3 * tags.length
  });

  // Render at 0%
  bar.tick(0);

  for(const tag of tags)
    fetchTag(lang, tag, bar);
}

// Remove old translations
console.log("Deleting old translations");
fs.emptyDirSync(I18N_FOLDER);

// Get the translated languages and download the translations
console.log("Fetching languages");
getTranslatedLanguages()
  .then(languages => {
    console.log(`Languages over 90% translated: ${languages.join(", ")}`);

    for(const lang of languages)
      fetchAllTags(lang);
  });

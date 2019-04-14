/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Internationalization setup
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import i18n from "i18next";
import XHR from "i18next-xhr-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { reactI18nextModule } from "react-i18next";
import config from "../config";
import languages from "../languages.json";

/**
 * Set up the internationalization service
 *
 * @param ajax An optional ajax function to use when fetching translations
 */
export function setupI18n(ajax?: any) {
  return i18n
    .use(XHR)
    .use(LanguageDetector)
    .use(reactI18nextModule)
    .init({
      fallbackLng: "en",
      whitelist: languages,
      ns: ["common"],
      defaultNS: "common",
      fallbackNS: [
        "dashboard",
        "footer",
        "lists",
        "location",
        "login",
        "query-log",
        "settings",
        "api-errors",
        "preferences",
        "time-ranges"
      ],
      nsSeparator: false,
      keySeparator: false,
      returnEmptyString: false,
      debug: config.developmentMode,
      interpolation: {
        // Handled by React
        escapeValue: false
      },
      backend: {
        loadPath: process.env.PUBLIC_URL + "/i18n/{{lng}}/{{ns}}.json",
        ajax
      },
      react: {
        // Wait until translations are loaded before rendering
        wait: true
      }
    });
}

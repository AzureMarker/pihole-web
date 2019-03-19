/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Apply the web interface language preference
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import { PreferencesContext } from "./context/PreferencesContext";
import i18n from "i18next";

const applyLanguage = (language: string) => {
  if (i18n.language === language) {
    // Don't change the language if it's already correctly set
    return;
  }

  // noinspection JSIgnoredPromiseFromCall
  i18n.changeLanguage(language);
};

export default () => (
  <PreferencesContext.Consumer>
    {({ settings }) => {
      applyLanguage(settings.language);

      return null;
    }}
  </PreferencesContext.Consumer>
);

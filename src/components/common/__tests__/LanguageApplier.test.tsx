/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * LanguageApplier component test
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import { mount } from "enzyme";
import * as React from "react";
import LanguageApplier from "../LanguageApplier";
import {
  PreferencesContext,
  PreferencesContextType
} from "../context/PreferencesContext";
import i18n from "i18next";

it("does not update i18next if the language is already set correctly", () => {
  const settings: PreferencesContextType = {
    settings: {
      language: "en",
      layout: "boxed"
    },
    refresh: () => {}
  };

  i18n.language = "en";
  i18n.changeLanguage = jest.fn();

  mount(
    <PreferencesContext.Provider value={settings}>
      <LanguageApplier />
    </PreferencesContext.Provider>
  );

  expect(i18n.changeLanguage).not.toHaveBeenCalled();
});

it("updates i18next with the language if it was using a different one", () => {
  const settings: PreferencesContextType = {
    settings: {
      language: "es",
      layout: "boxed"
    },
    refresh: () => {}
  };

  i18n.language = "en";
  i18n.changeLanguage = jest.fn();

  mount(
    <PreferencesContext.Provider value={settings}>
      <LanguageApplier />
    </PreferencesContext.Provider>
  );

  expect(i18n.changeLanguage).toHaveBeenCalledWith("es");
});

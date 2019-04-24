/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * React preferences context tests
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import {
  defaultPreferences,
  loadInitialPreferences,
  WEB_PREFERENCES_STORAGE_KEY,
  PreferencesProvider,
  PreferencesContextType
} from "../PreferencesContext";
import { shallow } from "enzyme";
import { WithAPIData } from "../../WithAPIData";

it("loads the default preferences if none are cached", () => {
  const preferences = loadInitialPreferences();

  expect(preferences).toEqual(defaultPreferences);
});

it("loads the cached preferences when available", () => {
  const expectedPreferences: ApiPreferences = {
    language: "testLang",
    layout: "boxed"
  };

  localStorage.setItem(
    WEB_PREFERENCES_STORAGE_KEY,
    JSON.stringify(expectedPreferences)
  );

  const actualPreferences = loadInitialPreferences();

  expect(actualPreferences).toEqual(expectedPreferences);
});

it("loads the default preferences if it fails to parse the cached one", () => {
  localStorage.setItem(WEB_PREFERENCES_STORAGE_KEY, "not valid JSON");

  const preferences = loadInitialPreferences();

  expect(preferences).toEqual(defaultPreferences);
});

it("provides the initial settings while loading", () => {
  const expectedPreferences = loadInitialPreferences();

  const wrapper = shallow(<PreferencesProvider>{null}</PreferencesProvider>)
    .find(WithAPIData)
    .renderProp("renderInitial")();

  expect(wrapper.props().value.settings).toEqual(expectedPreferences);
});

it("caches the settings after loading and provides the new settings", () => {
  const expectedPreferences: ApiPreferences = {
    language: "testLang",
    layout: "boxed"
  };
  const refresh = jest.fn();
  const expectedSettings: PreferencesContextType = {
    settings: expectedPreferences,
    refresh
  };

  const wrapper = shallow(<PreferencesProvider>{null}</PreferencesProvider>)
    .find(WithAPIData)
    .renderProp("renderOk")(expectedPreferences, refresh);

  expect(wrapper.props().value).toEqual(expectedSettings);
  expect(localStorage.getItem(WEB_PREFERENCES_STORAGE_KEY)).toEqual(
    JSON.stringify(expectedPreferences)
  );
});

it("loads the default preferences if there's an error and its not cached", () => {
  const expectedPreferences = loadInitialPreferences();
  const refresh = jest.fn();
  const expectedSettings: PreferencesContextType = {
    settings: expectedPreferences,
    refresh
  };

  const wrapper = shallow(<PreferencesProvider>{null}</PreferencesProvider>)
    .find(WithAPIData)
    .renderProp("renderErr")(null, refresh);

  expect(wrapper.props().value).toEqual(expectedSettings);
});

it("loads the cached preferences if there's an error and its cached", () => {
  const expectedPreferences: ApiPreferences = {
    language: "testLang",
    layout: "boxed"
  };
  const refresh = jest.fn();
  const expectedSettings: PreferencesContextType = {
    settings: expectedPreferences,
    refresh
  };

  localStorage.setItem(
    WEB_PREFERENCES_STORAGE_KEY,
    JSON.stringify(expectedPreferences)
  );

  const wrapper = shallow(<PreferencesProvider>{null}</PreferencesProvider>)
    .find(WithAPIData)
    .renderProp("renderErr")(null, refresh);

  expect(wrapper.props().value).toEqual(expectedSettings);
});

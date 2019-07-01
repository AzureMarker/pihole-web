/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Preferences State Functionality
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

/**
 * The key used to store preferences in local storage
 */
export const WEB_PREFERENCES_STORAGE_KEY = "webPreferences";

/**
 * The default preferences. These preferences are used until the API responds
 * with the real preferences, unless there are cached preferences available.
 */
export const defaultPreferences: ApiPreferences = {
  layout: "boxed",
  language: "en"
};

/**
 * Load the initial web interface preferences. Cached preferences from local
 * storage will be used if available, otherwise default preferences will be
 * used.
 */
export const loadInitialPreferences = (): ApiPreferences => {
  const cachedPreferencesString = localStorage.getItem(
    WEB_PREFERENCES_STORAGE_KEY
  );

  if (cachedPreferencesString === null) {
    return defaultPreferences;
  }

  try {
    return JSON.parse(cachedPreferencesString);
  } catch (e) {
    return defaultPreferences;
  }
};

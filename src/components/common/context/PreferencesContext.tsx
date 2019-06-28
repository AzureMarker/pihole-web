/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Preferences context
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { ReactNode } from "react";
import { WithAPIData } from "../WithAPIData";
import api from "../../../util/api";
import config from "../../../config";

/**
 * The data shared by the preferences context
 */
export interface PreferencesContextType {
  settings: ApiPreferences;
  refresh: (data?: ApiPreferences) => void;
}

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

/**
 * Load the context which will be used initially, until the API responds with
 * the real preferences. These preferences are loaded from cache if available.
 */
export const loadInitialContext = (): PreferencesContextType => ({
  settings: loadInitialPreferences(),
  refresh: () => {}
});

/**
 * The React context which provides the preferences to consumers
 */
export const PreferencesContext = React.createContext(loadInitialContext());

/**
 * Provide the web interface preferences via React context.
 * Sub-components can use the `PreferencesContext.Consumer` component to get
 * the preferences.
 */
export const PreferencesProvider = ({
  children,
  ...props
}: {
  children: ReactNode;
}) => (
  <WithAPIData
    apiCall={
      config.fakeAPI
        ? () => Promise.resolve(loadInitialPreferences())
        : api.getPreferences
    }
    renderInitial={() => (
      <PreferencesContext.Provider value={loadInitialContext()} {...props}>
        {children}
      </PreferencesContext.Provider>
    )}
    renderOk={(settings, refresh) => {
      // Update the cached settings
      localStorage.setItem(
        WEB_PREFERENCES_STORAGE_KEY,
        JSON.stringify(settings)
      );

      return (
        <PreferencesContext.Provider value={{ settings, refresh }} {...props}>
          {children}
        </PreferencesContext.Provider>
      );
    }}
    renderErr={(_, refresh) => (
      <PreferencesContext.Provider
        // Reload the initial settings here, as the cache may have been updated
        // between page load and when the error occurred
        value={{ settings: loadInitialPreferences(), refresh }}
        {...props}
      >
        {children}
      </PreferencesContext.Provider>
    )}
  />
);

/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * React context objects
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { ReactNode } from "react";
import { WithAPIData } from "./WithAPIData";
import api from "../../util/api";

export interface StatusContextType {
  status: Status;
  refresh: (data?: ApiStatus) => void;
}

export interface PreferencesContextType {
  settings: ApiPreferences;
  refresh: (data?: ApiPreferences) => void;
}

export const WEB_PREFERENCES_STORAGE_KEY = "webPreferences";

const initialStatus: StatusContextType = {
  status: "unknown",
  refresh: () => {}
};

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

const initialPreferences: PreferencesContextType = {
  settings: loadInitialPreferences(),
  refresh: () => {}
};

export const StatusContext = React.createContext(initialStatus);
export const PreferencesContext = React.createContext(initialPreferences);

/**
 * Provide all of the necessary context needed at the root level to its
 * children. Currently, this includes status and preferences.
 */
export const GlobalContextProvider = ({
  children
}: {
  children: ReactNode;
}) => (
  <StatusProvider>
    <PreferencesProvider>{children}</PreferencesProvider>
  </StatusProvider>
);

/**
 * Provide the blocking status via React context.
 * Sub-components can use the `StatusContext.Consumer` component to get the
 * status.
 */
export const StatusProvider = ({
  children,
  ...props
}: {
  children: ReactNode;
}) => (
  <WithAPIData
    apiCall={api.getStatus}
    repeatOptions={{ interval: 5000, ignoreCancel: true }}
    renderInitial={() => (
      <StatusContext.Provider value={initialStatus} {...props}>
        {children}
      </StatusContext.Provider>
    )}
    renderOk={(data, refresh) => (
      <StatusContext.Provider
        value={{ status: data.status, refresh }}
        {...props}
      >
        {children}
      </StatusContext.Provider>
    )}
    renderErr={(_, refresh) => (
      <StatusContext.Provider value={{ status: "unknown", refresh }} {...props}>
        {children}
      </StatusContext.Provider>
    )}
  />
);

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
    apiCall={api.getPreferences}
    renderInitial={() => (
      <PreferencesContext.Provider value={initialPreferences} {...props}>
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
        value={{ settings: { layout: "boxed", language: "en" }, refresh }}
        {...props}
      >
        {children}
      </PreferencesContext.Provider>
    )}
  />
);

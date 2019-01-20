/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * React context objects
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import { WithAPIData } from "./WithAPIData";
import api from "../../util/api";

const initialStatus = { status: "unknown", refresh: () => {} };
const initialPreferences = { settings: { layout: "boxed" }, refresh: () => {} };

export const StatusContext = React.createContext(initialStatus);
export const PreferencesContext = React.createContext(initialPreferences);

/**
 * Provide all of the necessary context needed at the root level to its
 * children. Currently, this includes status and preferences.
 */
export const GlobalContextProvider = ({ children }) => (
  <StatusProvider>
    <PreferencesProvider>{children}</PreferencesProvider>
  </StatusProvider>
);

/**
 * Provide the blocking status via React context.
 * Sub-components can use the `StatusContext.Consumer` component to get the
 * status.
 */
export const StatusProvider = ({ children, ...props }) => (
  <WithAPIData
    apiCall={api.getStatus}
    repeatOptions={{ interval: 5000 }}
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
export const PreferencesProvider = ({ children, ...props }) => (
  <WithAPIData
    apiCall={api.getPreferences}
    renderInitial={() => (
      <PreferencesContext.Provider value={initialPreferences} {...props}>
        {children}
      </PreferencesContext.Provider>
    )}
    renderOk={(settings, refresh) => (
      <PreferencesContext.Provider value={{ settings, refresh }} {...props}>
        {children}
      </PreferencesContext.Provider>
    )}
    renderErr={(_, refresh) => (
      <PreferencesContext.Provider
        value={{ settings: { layout: "boxed" }, refresh }}
        {...props}
      >
        {children}
      </PreferencesContext.Provider>
    )}
  />
);

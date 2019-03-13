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
import { StatusProvider } from "./StatusContext";
import { PreferencesProvider } from "./PreferencesContext";
import { TimeRangeProvider } from "./TimeRangeContext";

/**
 * Provide all of the necessary context needed at the root level to the
 * children. Currently, this includes status, preferences, and time range (for
 * the dashboard).
 */
export const GlobalContextProvider = ({
  children
}: {
  children: ReactNode;
}) => (
  <StatusProvider>
    <PreferencesProvider>
      <TimeRangeProvider>{children}</TimeRangeProvider>
    </PreferencesProvider>
  </StatusProvider>
);

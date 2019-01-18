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
import { WithAPIData } from "./components/common/WithAPIData";
import api from "./util/api";

export const StatusContext = React.createContext("unknown");

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
      <StatusContext.Provider value="loading" {...props}>
        {children}
      </StatusContext.Provider>
    )}
    renderOk={data => (
      <StatusContext.Provider value={data.status} {...props}>
        {children}
      </StatusContext.Provider>
    )}
    renderErr={() => (
      <StatusContext.Provider value="unknown" {...props}>
        {children}
      </StatusContext.Provider>
    )}
  />
);

/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Status context
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { ReactNode } from "react";
import { WithAPIData } from "../WithAPIData";
import api from "../../../util/api";

/**
 * The data shared by the status context
 */
export interface StatusContextType {
  status: Status;
  refresh: (data?: ApiStatus) => void;
}

/**
 * The status data which will be used initially, until the API responds with the
 * real status data.
 */
export const initialContext: StatusContextType = {
  status: "unknown",
  refresh: () => {}
};

/**
 * The React context which provides the status data to consumers
 */
export const StatusContext = React.createContext(initialContext);

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
    flushOnUpdate={false}
    renderInitial={() => (
      <StatusContext.Provider value={initialContext} {...props}>
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
      <StatusContext.Provider
        value={{ status: initialContext.status, refresh }}
        {...props}
      >
        {children}
      </StatusContext.Provider>
    )}
  />
);

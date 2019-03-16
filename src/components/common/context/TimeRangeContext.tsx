/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Context used for sharing a time range
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import { Moment } from "moment";
import React, { ReactNode, useState } from "react";

/**
 * Represents a range of time
 */
export interface TimeRange {
  from: Moment;
  until: Moment;
}

/**
 * The type of the data shared by the time range context
 */
export interface TimeRangeContextType {
  range: TimeRange | null;

  /**
   * Update the time range
   *
   * @param range The new time range
   */
  update: (range: TimeRange | null) => void;
}

/**
 * The initial data shared by the time range context
 */
const initialContext: TimeRangeContextType = {
  range: null,
  update: () => {}
};

/**
 * The React context which provides the time range to consumers
 */
export const TimeRangeContext = React.createContext(initialContext);

/**
 * Provide the time range via React context.
 * Sub-components can use the `TimeRangeContext.Consumer` component to get the
 * time range.
 */
export const TimeRangeProvider = ({ children }: { children: ReactNode }) => {
  const [range, setRange] = useState(initialContext.range);

  return (
    <TimeRangeContext.Provider value={{ range, update: setRange }}>
      {children}
    </TimeRangeContext.Provider>
  );
};

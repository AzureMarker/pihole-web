/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Graph utility functions
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import { TimeRange } from "../components/common/context/TimeRangeContext";

/**
 * Pad a two digit number
 *
 * @param num the number
 * @returns {string} a padding number string
 */
export const padNumber = (num: number) => {
  return ("00" + num).substr(-2, 2);
};

/**
 * Dynamically calculate a time interval so there are always 144 data points
 * (144 so that every point represents 10 minutes when the range is 24 hours)
 *
 * @param range The range to find the interval for
 */
export const getIntervalForRange = (range: TimeRange): number => {
  return Math.ceil((range.until.unix() - range.from.unix()) / 144);
};

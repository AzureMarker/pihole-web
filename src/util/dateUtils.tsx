/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Date/Time utility functions
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */
import i18n from "i18next";

export function getTimeFromTimestamp(input: number) {
  const date = new Date(input * 1000);

  const options = {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    hourCycle: "h24",
    minute: "2-digit",
    second: "2-digit"
  };

  const formattedString = date.toLocaleTimeString(i18n.language, options);

  return formattedString;
}

/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Various utilities including the API
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

export const validate = {
  domain(domain) {
    // Make sure it's a fully qualified domain
    const split = domain.split(".");
    // Has to have at least 2 segments, of at least 1 character each
    if (split.length < 2) return false;
    split.forEach(segment => {
      if (segment.length < 1) return false;
    });
    return validate.hostname(domain);
  },
  hostname(hostname) {
    // Must not exceed 253 characters total
    if (hostname.length > 253) return false;
    // Each segment must not exceed 63 characters
    const segments = hostname.split(".");
    segments.forEach(segment => {
      // Also check it's not empty
      if (!segment || segment.length > 63) return false;
    });
    // Must not be all numbers and periods
    const joined = segments.join("");
    // If the hostname without periods make a number, deny
    if (!validate.isStrictNumeric(joined)) return false;

    return /([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*)+(\.([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*))*$/.test(
      hostname
    );
  },
  isStrictNumeric(input) {
    // Because parseInt has limitations, e.g. parseInt("15ex") is parsed to 15
    // Caution, does not work with negative numbers, replace with /^(\-|\+)?([0-9])$/ if needed
    return /^([0-9])$/.test(input);
  }
};

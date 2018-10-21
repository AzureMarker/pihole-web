/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Utility functions for validating domains, hostnames etc.
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

export function isValidHostname(hostname) {
  // Must not exceed 253 characters total
  if (hostname.length > 253) return false;
  // Each segment must not exceed 63 characters
  const segments = hostname.split(".");
  // If at least one segment is empty or longer than 63 chars - sets to true, if none - false
  const hasLongOrEmptySegments = segments.some(
    segment => segment.length < 1 || segment.length > 63
  );
  if (hasLongOrEmptySegments) return false;
  // Must not be all numbers and periods
  const joined = segments.join("");
  // If the hostname without periods make a number, deny
  if (isStrictNumeric(joined)) return false;

  return /^([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*)+(\.([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*))*$/.test(
    hostname
  );
}

export function isValidDomain(domain) {
  // Make sure it's a fully qualified domain
  const split = domain.split(".");
  // Has to have at least 2 segments, of at least 1 character each
  if (split.length < 2) return false;
  return isValidHostname(domain);
}

export function isStrictNumeric(input) {
  // Because parseInt has limitations, e.g. parseInt("15ex") is parsed to 15
  // Caution, does not work with negative numbers, replace with /^(\-|\+)?([0-9])$/ if needed
  return /^[0-9]*$/.test(input);
}

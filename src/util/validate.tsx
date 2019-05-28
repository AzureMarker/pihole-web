/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Utility functions for validating domains, hostnames etc.
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

export function isValidHostname(hostname: string): boolean {
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
  if (isPositiveNumber(joined)) return false;

  return /^([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*)+(\.([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*))*$/.test(
    hostname
  );
}

export function isValidDomain(domain: string): boolean {
  // Make sure it's a fully qualified domain
  const split = domain.split(".");
  // Has to have at least 2 segments, of at least 1 character each
  if (split.length < 2) return false;
  return isValidHostname(domain);
}

export function isPositiveNumber(input: string): boolean {
  // Because parseInt has limitations, e.g. parseInt("15ex") is parsed to 15
  // Caution, does not work with negative numbers, replace with /^(\-|\+)?([0-9])$/ if needed
  return /^[0-9]+$/.test(input);
}

export function isValidRegex(regex: string): boolean {
  try {
    new RegExp(regex);
  } catch (e) {
    return false;
  }
  return true;
}

/**
 * Check if the string is a valid IPv4 address
 *
 * @param address {string} the address to check
 * @returns {boolean} if the address is a valid IPv4 address
 */
export function isValidIpv4(address: string): boolean {
  const segments = address.split(".");

  // Must have 4 segments
  if (segments.length !== 4) {
    return false;
  }

  // All segments must be numbers (positive)
  return segments.every(
    segment => isPositiveNumber(segment) && parseInt(segment) < 256
  );
}

/**
 * Check if the string is a valid IPv4 address, and it can contain an optional
 * port after the address, separated with a :.
 * Example: 127.0.0.1:5353
 *
 * @param address {string} the address to check
 * @returns {boolean} if the address is a valid IPv4 address and the port
 * (if it exists) is valid.
 */
export function isValidIpv4OptionalPort(address: string): boolean {
  const split = address.split(":");
  const ipv4 = split[0];

  // Check the IPv4 address
  if (!isValidIpv4(ipv4)) {
    return false;
  }

  // If no port is given or if the port is valid, return true
  return (
    split.length === 1 || (split.length === 2 && isPositiveNumber(split[1]))
  );
}

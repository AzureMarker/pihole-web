/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Provide the base path for relative paths
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

/**
 * Get the base path of the web interface. The API will inject a base element
 * for this purpose, but if the web interface is not hosted by the API, it will
 * fall back to the public URL set by Create React App.
 *
 * @returns The base path to use
 */
export const getBasePath = (): string => {
  const baseElement = document.getElementsByTagName("base")[0];

  if (baseElement) {
    return new URL(baseElement.href).pathname;
  } else {
    // PUBLIC_URL is supplied by CRA, and will never be undefined
    return process.env.PUBLIC_URL!;
  }
};

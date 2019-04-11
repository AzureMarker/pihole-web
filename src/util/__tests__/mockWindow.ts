/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Functions for mocking window attributes
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

const originalReload = window.location.reload;

/**
 * Mock window.location.reload
 * https://remarkablemark.org/blog/2018/11/17/mock-window-location/
 *
 * Restore it with {@link restoreLocationReload}
 */
export const mockLocationReload = () => {
  Object.defineProperty(window.location, "reload", {
    configurable: true
  });

  window.location.reload = jest.fn();
};

/**
 * Restore window.location.reload after being mocked by
 * {@link mockLocationReload}
 */
export const restoreLocationReload = () => {
  window.location.reload = originalReload;
};

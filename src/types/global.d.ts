/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Type definitions for the `global` variable
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace NodeJS {
  import i18next from "i18next";

  interface Global {
    tick(): Promise<any>;
    ignoreAPI(): Promise<any>;
    t: i18next.TFunction;
  }
}

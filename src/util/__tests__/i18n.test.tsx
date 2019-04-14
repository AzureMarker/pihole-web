/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Test internationalization setup
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import { setupI18n } from "../i18n";

// Mock react-i18next, as it does not properly export the i18next module during
// testing.
// https://github.com/i18next/react-i18next/issues/434
jest.mock("react-i18next", () => ({
  reactI18nextModule: {
    type: "3rdParty",
    init: () => {}
  }
}));

it("configures i18n successfully", async () => {
  // Provide a mock ajax function to the XHR backend
  const fakeAjax = (url: any, options: any, callback: any) => callback("", {});

  // Make sure i18n initializes without error
  await setupI18n(fakeAjax);
});

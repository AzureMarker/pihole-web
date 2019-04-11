/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Test basic HTTP functions
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import { checkIfLoggedOut } from "../http";
import api from "../api";
import { mockLocationReload, restoreLocationReload } from "./mockWindow";

describe("checkIfLoggedOut", () => {
  it("passes the response through if logged in and not a 401", async () => {
    const response = { status: 200 } as Response;
    api.loggedIn = true;

    await expect(checkIfLoggedOut(response)).resolves.toEqual(response);
  });

  it("passes the response through if not logged in and not a 401", async () => {
    const response = { status: 200 } as Response;
    api.loggedIn = false;

    await expect(checkIfLoggedOut(response)).resolves.toEqual(response);
  });

  it("passes the response through if not logged in and is a 401", async () => {
    const response = { status: 401 } as Response;
    api.loggedIn = false;

    await expect(checkIfLoggedOut(response)).resolves.toEqual(response);
  });

  it("clears the session cookie and reloads if logged in and response is a 401", async () => {
    const response = { status: 401 } as Response;
    api.loggedIn = true;
    document.cookie = "user_id=test";
    mockLocationReload();

    await expect(checkIfLoggedOut(response)).rejects.toEqual({
      isCanceled: true
    });

    expect(window.location.reload).toHaveBeenCalled();
    expect(document.cookie).toHaveLength(0);

    restoreLocationReload();
  });
});

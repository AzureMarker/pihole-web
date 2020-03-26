/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Auto-login saga tests
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import { call } from "redux-saga/effects";
import { expectSaga, testSaga } from "redux-saga-test-plan";
import { autoLogin } from "../autoLogin";
import api from "../../../util/api";
import { throwError } from "redux-saga-test-plan/providers";
import config from "../../../config";

const unauthorizedError = {
  key: "unauthorized",
  message: "Unauthorized",
  data: null
} as any;

const unknownError = {
  key: "test_error",
  message: "Not the unauthorized error",
  data: null
} as any;

describe("autoLogin", () => {
  it("should not reload when not authorized", () => {
    return expectSaga(autoLogin)
      .provide([[call(api.checkAuthStatus), throwError(unauthorizedError)]])
      .not.call([window.location, "reload"])
      .run();
  });

  it("should reload when authorized but not logged in", () => {
    api.loggedIn = false;

    return expectSaga(autoLogin)
      .provide([
        [call(api.checkAuthStatus), { status: "success" }],
        // @ts-ignore
        // It tries to use the deprecated reload which takes a boolean argument
        [call([window.location, "reload"]), undefined]
      ])
      .call([window.location, "reload"])
      .run();
  });

  it("should set the cookie manually when in fake API mode", async () => {
    api.loggedIn = false;
    config.fakeAPI = true;
    document.cookie = "";

    await expectSaga(autoLogin)
      .provide([
        [call(api.checkAuthStatus), { status: "success" }],
        // @ts-ignore
        // It tries to use the deprecated reload which takes a boolean argument
        [call([window.location, "reload"]), undefined]
      ])
      .run();

    expect(document.cookie).toContain("user_id=");
  });

  it("should throw unexpected exceptions from the API", () => {
    expect(() =>
      testSaga(autoLogin).next().call(api.checkAuthStatus).throw(unknownError)
    ).toThrow(unknownError);

    // Below code is commented out until the testing library supports catching
    // errors thrown in catch blocks. See
    // https://github.com/jfairbank/redux-saga-test-plan/issues/296
    // Once this is fixed, the above code will be replaced with the below code.
    //
    // return expectSaga(autoLogin)
    //   .provide([[call(api.checkAuthStatus), throwError(unknownError)]])
    //   .throws(unknownError)
    //   .run();
  });
});

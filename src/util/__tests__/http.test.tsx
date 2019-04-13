/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Test basic HTTP functions
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import HttpClient, {
  checkForErrors,
  checkIfLoggedOut,
  convertJSON,
  paramsToString,
  timeRangeToParams
} from "../http";
import api from "../api";
import { Config } from "../../config";
import { CanceledError } from "../CancelablePromise";
import { TimeRange } from "../../components/common/context/TimeRangeContext";
import moment from "moment";

const originalReload = window.location.reload;

/**
 * Mock window.location.reload
 * https://remarkablemark.org/blog/2018/11/17/mock-window-location/
 *
 * Restore it with {@link restoreLocationReload}
 */
const mockLocationReload = () => {
  Object.defineProperty(window.location, "reload", {
    configurable: true
  });

  window.location.reload = jest.fn();
};

/**
 * Restore window.location.reload after being mocked by
 * {@link mockLocationReload}
 */
const restoreLocationReload = () => {
  window.location.reload = originalReload;
};

describe("HttpClient", () => {
  describe("urlFor", () => {
    it("uses the fakeAPI route if configured", () => {
      const config: Config = {
        developmentMode: false,
        fakeAPI: true,
        apiPath: "/fakeAPI"
      };
      const httpClient = new HttpClient(config);

      expect(httpClient.urlFor("test")).toEqual("/fakeAPI/test");
    });

    it("uses the production route if configured", () => {
      const config: Config = {
        developmentMode: false,
        fakeAPI: false,
        apiPath: "/admin/api"
      };
      const httpClient = new HttpClient(config);

      expect(httpClient.urlFor("test")).toEqual("/admin/api/test");
    });
  });
});

describe("checkIfLoggedOut", () => {
  it("should pass the response through if logged in and not a 401", async () => {
    const response = { status: 200 } as Response;
    api.loggedIn = true;

    await expect(checkIfLoggedOut(response)).resolves.toEqual(response);
  });

  it("should pass the response through if not logged in and not a 401", async () => {
    const response = { status: 200 } as Response;
    api.loggedIn = false;

    await expect(checkIfLoggedOut(response)).resolves.toEqual(response);
  });

  it("should pass the response through if not logged in and is a 401", async () => {
    const response = { status: 401 } as Response;
    api.loggedIn = false;

    await expect(checkIfLoggedOut(response)).resolves.toEqual(response);
  });

  it("should clear the session cookie and reload if logged in and response is a 401", async () => {
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

describe("convertJSON", () => {
  it("should convert to JSON if it is not canceled or an error", async () => {
    const body = { test: true };
    const response = new Response(JSON.stringify(body));

    await expect(convertJSON(response)).resolves.toEqual(body);
  });

  it("should reject with input if canceled", async () => {
    const cancelError: CanceledError = {
      isCanceled: true
    };

    await expect(convertJSON(cancelError)).rejects.toEqual(cancelError);
  });

  it("should reject with input if error", async () => {
    const error = new Error("test");

    await expect(convertJSON(error)).rejects.toEqual(error);
  });
});

describe("checkForErrors", () => {
  it("should pass through the data if there is no error", async () => {
    const data = { test: true };

    await expect(checkForErrors(data)).resolves.toEqual(data);
  });

  it("should reject with the error if there is an error", async () => {
    const data = { error: { test: true } };

    await expect(checkForErrors(data)).rejects.toEqual(data.error);
  });
});

describe("paramsToString", () => {
  it("converts an object into parameters", () => {
    const object = {
      test1: "1",
      test2: "two",
      test3: 3
    };
    const expectedParams = "test1=1&test2=two&test3=3";

    expect(paramsToString(object)).toEqual(expectedParams);
  });
});

describe("timeRangeToParams", () => {
  it("converts a time range into parameters", () => {
    const range: TimeRange = {
      name: "Test time range",
      from: moment("2019-04-12T01:03:17+00:00"),
      until: moment("2019-04-13T01:03:17+00:00")
    };
    const expectedParams = "from=1555030997&until=1555117397";

    expect(timeRangeToParams(range)).toEqual(expectedParams);
  });
});

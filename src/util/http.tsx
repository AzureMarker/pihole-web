/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Basic HTTP functions for accessing API endpoints
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import api from "./api";
import { Config } from "../config";
import { TimeRange } from "../components/common/context/TimeRangeContext";
import { CanceledError } from "./CancelablePromise";

/**
 * A class which provides HTTP functions. Each function parses the response and
 * checks for errors
 */
export default class HttpClient {
  constructor(public config: Config) {}

  /**
   * Check if the user is logged out, convert to JSON, and check for API errors
   *
   * @param response The HTTP response
   */
  handleResponse = <T extends any>(response: Response): Promise<T> => {
    // @ts-ignore
    return checkIfLoggedOut(response).then(convertJSON).then(checkForErrors);
  };

  /**
   * Perform a GET request
   *
   * @param url The URL to access
   * @param options Optional fetch configuration
   * @returns A promise with the data or error returned
   */
  get = <T extends any>(url: string, options: RequestInit = {}): Promise<T> => {
    // @ts-ignore
    return fetch(this.urlFor(url), {
      method: "GET",
      credentials: this.credentialType(),
      ...options
    }).then(this.handleResponse);
  };

  /**
   * Perform a POST request
   *
   * @param url The URL to access
   * @param data The data to send
   * @returns A promise with the data or error returned
   */
  post = <T extends any>(url: string, data: object): Promise<T> => {
    // @ts-ignore
    return fetch(this.urlFor(url), {
      method: "POST",
      body: JSON.stringify(data),
      headers: new Headers({ "Content-Type": "application/json" }),
      credentials: this.credentialType()
    }).then(this.handleResponse);
  };

  /**
   * Perform a PUT request
   *
   * @param url The URL to access
   * @param data The data to send
   * @returns A promise with the data or error returned
   */
  put = <T extends any>(url: string, data: object): Promise<T> => {
    // @ts-ignore
    return fetch(this.urlFor(url), {
      method: "PUT",
      body: JSON.stringify(data),
      headers: new Headers({ "Content-Type": "application/json" }),
      credentials: this.credentialType()
    }).then(this.handleResponse);
  };

  /**
   * Perform a DELETE request
   *
   * @param url The URL to access
   * @returns A promise with the data or error returned
   */
  delete = <T extends any>(url: string): Promise<T> => {
    // @ts-ignore
    return fetch(this.urlFor(url), {
      method: "DELETE",
      credentials: this.credentialType()
    }).then(this.handleResponse);
  };

  /**
   * Get the URL for an endpoint
   *
   * @param endpoint The endpoint
   * @returns The URL for the endpoint
   */
  urlFor = (endpoint: string): string => {
    return this.config.apiPath + "/" + endpoint;
  };

  /**
   * Get the credential type for requests
   *
   * @returns The credential type
   */
  credentialType = (): RequestCredentials => {
    // Development API requests may use a different origin (pi.hole) since it is
    // running off of the developer's machine. Therefore, allow credentials to
    // be used across origins when in development mode.
    return this.config.developmentMode ? "include" : "same-origin";
  };
}

/**
 * If the user is logged in, check if the user's session has lapsed.
 * If so, log them out and refresh the page.
 *
 * @param response The Response from fetch
 * @return If logged in, the response, otherwise a canceled promise
 */
export const checkIfLoggedOut = (response: Response): Promise<Response> => {
  if (api.loggedIn && response.status === 401) {
    // Clear the user's old session and refresh the page
    document.cookie =
      "user_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.reload();
    return Promise.reject({ isCanceled: true });
  }

  return Promise.resolve(response);
};

/**
 * If the input is a Response, return a promise for parsing the JSON.
 * If the input is an Error, return a rejecting promise with error.
 * If the request was canceled, return a rejecting promise with cancel object.
 *
 * @param data a Response or Error
 * @returns {*} a promise with the parsed JSON, or the error
 */
export const convertJSON = <T extends any>(
  data: Response | Error | CanceledError
): Promise<T> => {
  if ((data as CanceledError).isCanceled || data instanceof Error) {
    return Promise.reject(data);
  }

  return (data as Response).json();
};

/**
 * Check for an error returned by the API
 *
 * @param data the parsed JSON body of the response
 * @returns A resolving promise with the data if no error, otherwise a
 * rejecting promise with the error
 */
export const checkForErrors = <T extends any>(data: T): Promise<T> => {
  if (data.error) {
    return Promise.reject(data.error);
  }

  return Promise.resolve(data);
};

/**
 * Convert an object into GET parameters. The object must be flat (only
 * key-value pairs).
 *
 * @param params The parameters object
 * @returns The parameters converted into GET parameter form
 */
export const paramsToString = (params: {
  [key: string]: string | number;
}): string => {
  return Object.keys(params)
    .map(key => key + "=" + params[key])
    .join("&");
};

/**
 * Convert a time range into GET parameters
 *
 * @param range The time range to convert
 * @return The time range as GET parameters
 */
export const timeRangeToParams = (range: TimeRange) => {
  return paramsToString({
    from: range.from.unix(),
    until: range.until.unix()
  });
};

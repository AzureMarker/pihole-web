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
import config from "../config";

/**
 * A group of HTTP functions. Each function parses the response checks for
 * errors
 */
export default {
  /**
   * Perform a GET request
   *
   * @param url the URL to access
   * @param options optional fetch configuration
   * @returns {Promise<any>} a promise with the data or error returned
   */
  get(url: string, options = {}) {
    return fetch(urlFor(url), {
      credentials: credentialType(),
      ...options
    })
      .then(checkIfLoggedOut)
      .then(convertJSON)
      .catch(convertJSON)
      .then(checkForErrors);
  },

  /**
   * Perform a POST request
   *
   * @param url the URL to access
   * @param data the data to send
   * @returns {Promise<any>} a promise with the data or error returned
   */
  post(url: string, data: {}) {
    return fetch(urlFor(url), {
      method: "POST",
      body: JSON.stringify(data),
      headers: new Headers({ "Content-Type": "application/json" }),
      credentials: credentialType()
    })
      .then(checkIfLoggedOut)
      .then(convertJSON)
      .catch(convertJSON)
      .then(checkForErrors);
  },

  /**
   * Perform a PUT request
   *
   * @param url the URL to access
   * @param data the data to send
   * @returns {Promise<any>} a promise with the data or error returned
   */
  put(url: string, data: {}) {
    return fetch(urlFor(url), {
      method: "PUT",
      body: JSON.stringify(data),
      headers: new Headers({ "Content-Type": "application/json" }),
      credentials: credentialType()
    })
      .then(checkIfLoggedOut)
      .then(convertJSON)
      .catch(convertJSON)
      .then(checkForErrors);
  },

  /**
   * Perform a DELETE request
   *
   * @param url the URL to access
   * @returns {Promise<any>} a promise with the data or error returned
   */
  delete(url: string) {
    return fetch(urlFor(url), {
      method: "DELETE",
      credentials: credentialType()
    })
      .then(checkIfLoggedOut)
      .then(convertJSON)
      .catch(convertJSON)
      .then(checkForErrors);
  }
};

/**
 * If the user is logged in, check if the user's session has lapsed.
 * If so, log them out and refresh the page.
 *
 * @param response the Response from fetch
 * @return {Promise} if logged in, the response, otherwise a canceled promise
 */
const checkIfLoggedOut = (response: Response) => {
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
const convertJSON = (data: any): Promise<any> => {
  if (data.isCanceled || data instanceof Error) {
    return Promise.reject(data);
  }

  return data.json();
};

/**
 * Check for an error returned by the API
 *
 * @param data the parsed JSON body of the response
 * @returns {*} a resolving promise with the data if no error, otherwise a
 * rejecting promise with the error
 */
const checkForErrors = (data: any): Promise<any> => {
  if (data.error) {
    return Promise.reject(data.error);
  }

  return Promise.resolve(data);
};

/**
 * Get the URL for an endpoint
 *
 * @param endpoint the endpoint
 * @returns {string} the URL for the endpoint
 */
const urlFor = (endpoint: string): string => {
  let apiLocation;

  if (config.fakeAPI) {
    apiLocation = process.env.PUBLIC_URL + "/fakeAPI";
  } else {
    apiLocation = "/admin/api";
  }

  return apiLocation + "/" + endpoint;
};

/**
 * Get the credential type for requests
 *
 * @returns {string} the credential type
 */
const credentialType = () => {
  // Development API requests use a different origin (pi.hole) since it is running off of the developer's machine.
  // Therefore, allow credentials to be used across origins when in development mode.
  return config.developmentMode ? "include" : "same-origin";
};

/**
 * Convert an object into GET parameters. The object must be flat (only
 * key-value pairs).
 *
 * @param params the parameters object
 * @returns {string} the parameters converted into GET parameter form
 */
export const paramsToString = (params: any) =>
  Object.keys(params)
    .map(key => key + "=" + params[key])
    .join("&");

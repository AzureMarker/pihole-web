/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Various utilities including the API
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import config from './config';

export const padNumber = (num) => {
  return ("00" + num).substr(-2,2);
};

export const makeCancelable = (promise, { repeat = null, interval = 0 } = {}) => {
  let hasCanceled = false;
  let repeatId = null;

  const handle = (resolve, reject, val, isError) => {
    if(hasCanceled)
      reject({ isCanceled: true });
    else {
      if(isError)
        reject(val);
      else
        resolve(val);

      if(repeat)
        repeatId = setTimeout(repeat, interval);
    }
  };

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      val => handle(resolve, reject, val, false),
      error => handle(resolve, reject, error, true)
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      clearTimeout(repeatId);
      hasCanceled = true;
    },
  };
};

export const ignoreCancel = err => {
  if(!err.isCanceled)
    throw err;
};

export const api = {
  loggedIn: false,
  authenticate(key) {
    return fetch(api.urlFor("auth"), {
      headers: new Headers({ "X-Pi-hole-Authenticate": key }),
      credentials: this.credentialType()
    })
      .then(api.convertJSON)
      .then(api.checkForErrors);
  },
  logout() {
    return api.delete("auth");
  },
  getSummary() {
    return api.get("stats/summary");
  },
  getHistoryGraph() {
    return api.get("stats/overTime/history");
  },
  getQueryTypesOverTime() {
    return api.get("stats/overTime/query_types");
  },
  getForwardDestOverTime() {
    return api.get("stats/overTime/forward_destinations");
  },
  getTopDomains() {
    return api.get("stats/top_domains");
  },
  getTopBlocked() {
    return api.get("stats/top_blocked");
  },
  getTopClients() {
    return api.get("stats/top_clients");
  },
  getHistory() {
    return api.get("stats/history");
  },
  getWhitelist() {
    return api.get("dns/whitelist");
  },
  getBlacklist() {
    return api.get("dns/blacklist");
  },
  getWildlist() {
    return api.get("dns/wildlist");
  },
  addWhitelist(domain) {
    return api.post("dns/whitelist", { "domain": domain });
  },
  addBlacklist(domain) {
    return api.post("dns/blacklist", { "domain": domain });
  },
  addWildlist(domain) {
    return api.post("dns/wildlist", { "domain": domain });
  },
  removeWhitelist(domain) {
    return api.delete("dns/whitelist/" + domain);
  },
  removeBlacklist(domain) {
    return api.delete("dns/blacklist/" + domain);
  },
  removeWildlist(domain) {
    return api.delete("dns/wildlist/" + domain);
  },
  get(url) {
    return fetch(api.urlFor(url), {
      credentials: this.credentialType()
    })
      .then(api.checkIfLoggedOut)
      .then(api.convertJSON)
      .then(api.checkForErrors);
  },
  post(url, data) {
    return fetch(api.urlFor(url), {
      method: "POST",
      body: JSON.stringify(data),
      headers: new Headers({ "Content-Type": "application/json" }),
      credentials: this.credentialType()
    })
      .then(api.checkIfLoggedOut)
      .then(api.convertJSON)
      .then(api.checkForErrors);
  },
  delete(url) {
    return fetch(api.urlFor(url), {
      method: "DELETE",
      credentials: this.credentialType()
    })
      .then(api.checkIfLoggedOut)
      .then(api.convertJSON)
      .then(api.checkForErrors);
  },
  /**
   * If the user is logged in, check if the user's session has lapsed.
   * If so, log them out and refresh the page.
   */
  checkIfLoggedOut(response) {
    if(api.loggedIn && response.status === 401) {
      // Clear the user's old session and refresh the page
      document.cookie = 'user_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      window.location.reload();
      return Promise.reject({ isCanceled: true })
    }

    return Promise.resolve(response);
  },
  async convertJSON(data) {
    if(!data.ok)
      return Promise.reject({ data, json: await data.json() });
    else
      return data.json();
  },
  checkForErrors(data) {
    if(data.error) {
      return Promise.reject(data.error);
    }
    return Promise.resolve(data);
  },
  urlFor(endpoint) {
    let apiLocation;

    if(config.fakeAPI)
      apiLocation = process.env.PUBLIC_URL + "/fakeAPI";
    else
      apiLocation = "/admin/api";

    return apiLocation + "/" + endpoint;
  },
  credentialType() {
    // Development API requests use a different origin (pi.hole) since it is running off of the developer's machine.
    // Therefore, allow credentials to be used across origins when in development mode.
    return config.developmentMode ? "include" : "same-origin";
  }
};
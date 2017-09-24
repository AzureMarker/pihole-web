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

export const parseObjectForGraph = (p) => {
  const keys = Object.keys(p);
  keys.sort((a, b) => a - b);

  const arr = [], idx = [];
  for(let i = 0; i < keys.length; i++) {
    arr.push(p[keys[i]]);
    idx.push(keys[i]);
  }

  return [idx,arr];
};

export const makeCancelable = (promise, { repeat = null, interval = 0 } = {}) => {
  let hasCanceled = false;
  let repeatId = null;

  const handle = (resolve, reject, val, isError) => {
    if(hasCanceled)
      reject({isCanceled: true});
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
  getSummary() {
    return api.get("stats/summary");
  },
  getGraph() {
    return api.get("stats/overTime/graph");
  },
  getQueryTypesOverTime() {
    return api.get("stats/overTime/query_types");
  },
  getForwardDestOverTime() {
    return api.get("stats/overTime/forward_dest");
  },
  getTopDomains() {
    return api.get("stats/top_domains");
  },
  getTopBlocked() {
    return api.get("stats/top_ads");
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
    return fetch(api.urlFor(url)).then(api.convertJSON);
  },
  post(url, data) {
    return fetch(api.urlFor(url), {
      method: "POST",
      body: JSON.stringify(data),
      headers: new Headers({ "Content-Type": "application/json" })
    }).then(api.convertJSON);
  },
  delete(url) {
    return fetch(api.urlFor(url), { method: "DELETE" }).then(api.convertJSON);
  },
  async convertJSON(data) {
    if(!data.ok)
      return Promise.reject({ data, json: await data.json() });
    else
      return data.json();
  },
  urlFor(endpoint) {
    let apiLocation;

    if(config.fakeAPI)
      apiLocation = window.location.host + process.env.PUBLIC_URL + "/fakeAPI";
    else if(config.developmentMode)
      apiLocation = "pi.hole:4747";
    else
      apiLocation = window.location.hostname + ":4747";

    return window.location.protocol + "//" + apiLocation + "/" + endpoint;
  }
};
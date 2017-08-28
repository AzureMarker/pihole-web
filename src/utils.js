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
    return this.get("stats/summary");
  },
  getGraph() {
    return this.get("stats/overTime/graph");
  },
  getQueryTypesOverTime() {
    return this.get("stats/overTime/query_types");
  },
  getForwardDestOverTime() {
    return this.get("stats/overTime/forward_dest");
  },
  getTopDomains() {
    return this.get("stats/top_domains");
  },
  getTopBlocked() {
    return this.get("stats/top_ads");
  },
  getTopClients() {
    return this.get("stats/top_clients");
  },
  getHistory() {
    return this.get("stats/history");
  },
  getWhitelist() {
    return this.get("dns/whitelist");
  },
  addWhitelist(domain) {
    return this.post("dns/whitelist", { "domain": domain });
  },
  removeWhitelist(domain) {
    return this.delete("dns/whitelist/" + domain);
  },
  get(url) {
    return fetch(this.urlFor(url)).then(this.convertJSON);
  },
  post(url, data) {
    return fetch(this.urlFor(url), {
      method: "POST",
      body: JSON.stringify(data),
      headers: new Headers({ "Content-Type": "application/json" })
    }).then(this.convertJSON);
  },
  delete(url) {
    return fetch(this.urlFor(url), { method: "DELETE" }).then(this.convertJSON);
  },
  async convertJSON(data) {
    if(!data.ok)
      return Promise.reject({ data: data, json: await data.json() });
    else
      return data.json();
  },
  urlFor(endpoint) {
    let apiLocation;

    if(config.developmentMode) {
      if(config.fakeAPI)
        apiLocation = window.location.host + process.env.PUBLIC_URL + "/fakeAPI";
      else
        apiLocation = "pi.hole:4747";
    }
    else
      apiLocation = window.location.hostname + ":4747";

    return "http://" + apiLocation + "/" + endpoint;
  }
};
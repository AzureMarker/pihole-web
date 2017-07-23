import config from '../config';

export let padNumber = (num) => {
  return ("00" + num).substr(-2,2);
};

export let parseObjectForGraph = (p) => {
  let keys = Object.keys(p);
  keys.sort((a, b) => a - b);

  let arr = [], idx = [];
  for(let i = 0; i < keys.length; i++) {
    arr.push(p[keys[i]]);
    idx.push(keys[i]);
  }

  return [idx,arr];
};

export let api = {
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
  get(url) {
    return fetch(this.urlFor(url)).then(data => data.json());
  },
  urlFor(endpoint) {
    let apiLocation;

    if(config.developmentMode) {
      if(config.fakeAPI)
        apiLocation = window.location.host + "/fakeAPI";
      else
        apiLocation = "pi.hole:4747";
    }
    else
      apiLocation = window.location.hostname + ":4747";

    return "http://" + apiLocation + "/" + endpoint;
  }
};
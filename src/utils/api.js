import config from '../config';

export default {
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
}
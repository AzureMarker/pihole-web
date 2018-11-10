import http from "./http";

export default {
  loggedIn: false,
  authenticate(key) {
    return http.get("auth", {
      headers: new Headers({ "X-Pi-hole-Authenticate": key })
    });
  },
  logout() {
    return http.delete("auth");
  },
  getSummary() {
    return http.get("stats/summary");
  },
  getHistoryGraph() {
    return http.get("stats/overTime/history");
  },
  getClientsGraph() {
    return http.get("stats/overTime/clients");
  },
  getQueryTypes() {
    return http.get("stats/query_types");
  },
  getForwardDestinations() {
    return http.get("stats/forward_destinations");
  },
  getTopDomains() {
    return http.get("stats/top_domains");
  },
  getTopBlocked() {
    return http.get("stats/top_blocked");
  },
  getTopClients() {
    return http.get("stats/top_clients");
  },
  getHistory() {
    return http.get("stats/history");
  },
  getWhitelist() {
    return http.get("dns/whitelist");
  },
  getBlacklist() {
    return http.get("dns/blacklist");
  },
  getRegexlist() {
    return http.get("dns/regexlist");
  },
  addWhitelist(domain) {
    return http.post("dns/whitelist", { domain: domain });
  },
  addBlacklist(domain) {
    return http.post("dns/blacklist", { domain: domain });
  },
  addRegexlist(domain) {
    return http.post("dns/regexlist", { domain: domain });
  },
  removeWhitelist(domain) {
    return http.delete("dns/whitelist/" + domain);
  },
  removeBlacklist(domain) {
    return http.delete("dns/blacklist/" + domain);
  },
  removeRegexlist(domain) {
    return http.delete("dns/regexlist/" + encodeURIComponent(domain));
  },
  getStatus() {
    return http.get("dns/status");
  },
  getNetworkInfo() {
    return http.get("settings/network");
  },
  getVersion() {
    return http.get("version");
  },
  getFTLdb() {
    return http.get("settings/ftldb");
  },
  getDNSInfo() {
    return http.get("settings/dns");
  },
  getDHCPInfo() {
    return http.get("settings/dhcp");
  }
};

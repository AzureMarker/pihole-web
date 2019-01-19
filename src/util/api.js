/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * API functions
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import http, { paramsToString } from "./http";
import config from "../config";

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
  getUpstreams() {
    return http.get("stats/upstreams");
  },
  getTopDomains() {
    return http.get("stats/top_domains");
  },
  getTopBlocked() {
    // The API uses a GET parameter to differentiate top domains from top
    // blocked, but the fake API is not able to handle GET parameters right now.
    const url = config.fakeAPI
      ? "stats/top_blocked"
      : "stats/top_domains?blocked=true";

    return http.get(url);
  },
  getTopClients() {
    return http.get("stats/top_clients");
  },
  getHistory(params) {
    return http.get("stats/history?" + paramsToString(params));
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
  setStatus(action, time = null) {
    return http.post("dns/status", { action, time });
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
  },
  updateDHCPInfo(settings) {
    return http.put("settings/dhcp", settings);
  },
  updateDNSInfo(settings) {
    return http.put("settings/dns", settings);
  }
};

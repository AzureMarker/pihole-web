/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * API functions
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import http, { paramsToString, timeRangeToParams } from "./http";
import config from "../config";
import { TimeRange } from "../components/common/context/TimeRangeContext";

export default {
  loggedIn: false,
  authenticate(key: string) {
    return http.get("auth", {
      headers: new Headers({ "X-Pi-hole-Authenticate": key })
    });
  },
  logout() {
    return http.delete("auth");
  },
  getSummary(): Promise<ApiSummary> {
    return http.get("stats/summary");
  },
  getSummaryDb(range: TimeRange): Promise<ApiSummary> {
    return http.get("stats/database/summary?" + timeRangeToParams(range));
  },
  getHistoryGraph(): Promise<Array<ApiHistoryGraphItem>> {
    return http.get("stats/overTime/history");
  },
  getHistoryGraphDb(
    range: TimeRange,
    interval: number
  ): Promise<Array<ApiHistoryGraphItem>> {
    return http.get(
      "stats/database/overTime/history?interval=" +
        interval +
        "&" +
        timeRangeToParams(range)
    );
  },
  getClientsGraph(): Promise<ApiClientsGraph> {
    return http.get("stats/overTime/clients");
  },
  getClientsGraphDb(
    range: TimeRange,
    interval: number
  ): Promise<ApiClientsGraph> {
    return http.get(
      "stats/database/overTime/clients?interval=" +
        interval +
        "&" +
        timeRangeToParams(range)
    );
  },
  getQueryTypes(): Promise<Array<ApiQueryType>> {
    return http.get("stats/query_types");
  },
  getQueryTypesDb(range: TimeRange): Promise<Array<ApiQueryType>> {
    return http.get("stats/database/query_types?" + timeRangeToParams(range));
  },
  getUpstreams(): Promise<ApiUpstreams> {
    return http.get("stats/upstreams");
  },
  getUpstreamsDb(range: TimeRange): Promise<ApiUpstreams> {
    return http.get("stats/database/upstreams?" + timeRangeToParams(range));
  },
  getTopDomains(): Promise<ApiTopDomains> {
    return http.get("stats/top_domains");
  },
  getTopDomainsDb(range: TimeRange): Promise<ApiTopDomains> {
    return http.get("stats/database/top_domains?" + timeRangeToParams(range));
  },
  getTopBlocked(): Promise<ApiTopBlocked> {
    // The API uses a GET parameter to differentiate top domains from top
    // blocked, but the fake API is not able to handle GET parameters right now.
    const url = config.fakeAPI
      ? "stats/top_blocked"
      : "stats/top_domains?blocked=true";

    return http.get(url);
  },
  getTopBlockedDb(range: TimeRange): Promise<ApiTopBlocked> {
    // The API uses a GET parameter to differentiate top domains from top
    // blocked, but the fake API is not able to handle GET parameters right now.
    const url = config.fakeAPI
      ? "stats/database/top_blocked?"
      : "stats/database/top_domains?blocked=true&";

    return http.get(url + timeRangeToParams(range));
  },
  getTopClients(): Promise<ApiTopClients> {
    return http.get("stats/top_clients");
  },
  getTopClientsDb(range: TimeRange): Promise<ApiTopClients> {
    return http.get("stats/database/top_clients?" + timeRangeToParams(range));
  },
  getHistory(params: any): Promise<ApiHistoryResponse> {
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
  addWhitelist(domain: string) {
    return http.post("dns/whitelist", { domain: domain });
  },
  addBlacklist(domain: string) {
    return http.post("dns/blacklist", { domain: domain });
  },
  addRegexlist(domain: string) {
    return http.post("dns/regexlist", { domain: domain });
  },
  removeWhitelist(domain: string) {
    return http.delete("dns/whitelist/" + domain);
  },
  removeBlacklist(domain: string) {
    return http.delete("dns/blacklist/" + domain);
  },
  removeRegexlist(domain: string) {
    return http.delete("dns/regexlist/" + encodeURIComponent(domain));
  },
  getStatus(): Promise<ApiStatus> {
    return http.get("dns/status");
  },
  setStatus(action: StatusAction, time?: number) {
    return http.post("dns/status", { action, time });
  },
  getNetworkInfo(): Promise<ApiNetworkSettings> {
    return http.get("settings/network");
  },
  getVersion(): Promise<ApiVersions> {
    return http.get("version");
  },
  getFTLdb(): Promise<ApiFtlDbResponse> {
    return http.get("settings/ftldb");
  },
  getDNSInfo(): Promise<ApiDnsSettings> {
    return http.get("settings/dns");
  },
  getDHCPInfo(): Promise<ApiDhcpSettings> {
    return http.get("settings/dhcp");
  },
  updateDHCPInfo(settings: ApiDhcpSettings) {
    return http.put("settings/dhcp", settings);
  },
  updateDNSInfo(settings: ApiDnsSettings) {
    return http.put("settings/dns", settings);
  },
  getPreferences(): Promise<ApiPreferences> {
    return http.get("settings/web");
  },
  updatePreferences(settings: ApiPreferences) {
    return http.put("settings/web", settings);
  }
};

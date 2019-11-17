/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * API functions
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import HttpClient, { paramsToString, timeRangeToParams } from "./http";
import config from "../config";
import { TimeRange } from "../components/common/context/TimeRangeContext";

export class ApiClient {
  public loggedIn = false;

  constructor(private http: HttpClient) {}

  authenticate = (key: string): Promise<ApiSuccessResponse> => {
    return this.http.get("auth", {
      headers: { "X-Pi-hole-Authenticate": key }
    });
  };

  checkAuthStatus = (): Promise<ApiSuccessResponse> => {
    return this.http.get("auth");
  };

  logout = (): Promise<ApiSuccessResponse> => {
    return this.http.delete("auth");
  };

  getSummary = (): Promise<ApiSummary> => {
    return this.http.get("stats/summary");
  };

  getSummaryDb = (range: TimeRange): Promise<ApiSummary> => {
    return this.http.get("stats/database/summary?" + timeRangeToParams(range));
  };

  getHistoryGraph = (): Promise<Array<ApiHistoryGraphItem>> => {
    return this.http.get("stats/overTime/history");
  };

  getHistoryGraphDb = (
    range: TimeRange,
    interval: number
  ): Promise<Array<ApiHistoryGraphItem>> => {
    return this.http.get(
      "stats/database/overTime/history?interval=" +
        interval +
        "&" +
        timeRangeToParams(range)
    );
  };

  getClientsGraph = (): Promise<ApiClientsGraph> => {
    return this.http.get("stats/overTime/clients");
  };

  getClientsGraphDb = (
    range: TimeRange,
    interval: number
  ): Promise<ApiClientsGraph> => {
    return this.http.get(
      "stats/database/overTime/clients?interval=" +
        interval +
        "&" +
        timeRangeToParams(range)
    );
  };

  getQueryTypes = (): Promise<Array<ApiQueryType>> => {
    return this.http.get("stats/query_types");
  };

  getQueryTypesDb = (range: TimeRange): Promise<Array<ApiQueryType>> => {
    return this.http.get(
      "stats/database/query_types?" + timeRangeToParams(range)
    );
  };

  getUpstreams = (): Promise<ApiUpstreams> => {
    return this.http.get("stats/upstreams");
  };

  getUpstreamsDb = (range: TimeRange): Promise<ApiUpstreams> => {
    return this.http.get(
      "stats/database/upstreams?" + timeRangeToParams(range)
    );
  };

  getTopDomains = (): Promise<ApiTopDomains> => {
    return this.http.get("stats/top_domains");
  };

  getTopDomainsDb = (range: TimeRange): Promise<ApiTopDomains> => {
    return this.http.get(
      "stats/database/top_domains?" + timeRangeToParams(range)
    );
  };

  getTopBlockedDomains = (): Promise<ApiTopBlockedDomains> => {
    // The API uses a GET parameter to differentiate top domains from top
    // blocked, but the fake API is not able to handle GET parameters right now.
    const url = this.http.config.fakeAPI
      ? "stats/top_blocked"
      : "stats/top_domains?blocked=true";

    return this.http.get(url);
  };

  getTopBlockedDomainsDb = (
    range: TimeRange
  ): Promise<ApiTopBlockedDomains> => {
    // The API uses a GET parameter to differentiate top domains from top
    // blocked, but the fake API is not able to handle GET parameters right now.
    const url = this.http.config.fakeAPI
      ? "stats/database/top_blocked?"
      : "stats/database/top_domains?blocked=true&";

    return this.http.get(url + timeRangeToParams(range));
  };

  getTopClients = (): Promise<ApiTopClients> => {
    return this.http.get("stats/top_clients");
  };

  getTopClientsDb = (range: TimeRange): Promise<ApiTopClients> => {
    return this.http.get(
      "stats/database/top_clients?" + timeRangeToParams(range)
    );
  };

  getTopBlockedClients = (): Promise<ApiTopBlockedClients> => {
    // The API uses a GET parameter to differentiate top clients from top
    // blocked clients, but the fake API is not able to handle GET parameters
    // right now.
    const url = this.http.config.fakeAPI
      ? "stats/top_blocked_clients"
      : "stats/top_clients?blocked=true";

    return this.http.get(url);
  };

  getTopBlockedClientsDb = (
    range: TimeRange
  ): Promise<ApiTopBlockedClients> => {
    // The API uses a GET parameter to differentiate top clients from top
    // blocked clients, but the fake API is not able to handle GET parameters
    // right now.
    const url = this.http.config.fakeAPI
      ? "stats/database/top_blocked_clients?"
      : "stats/database/top_clients?blocked=true&";

    return this.http.get(url + timeRangeToParams(range));
  };

  getHistory = (params: any): Promise<ApiHistoryResponse> => {
    return this.http.get("stats/history?" + paramsToString(params));
  };

  getExactWhitelist = (): Promise<Array<string>> => {
    return this.http.get("dns/whitelist/exact");
  };

  getExactBlacklist = (): Promise<Array<string>> => {
    return this.http.get("dns/blacklist/exact");
  };

  getRegexWhitelist = (): Promise<Array<string>> => {
    return this.http.get("dns/whitelist/regex");
  };

  getRegexBlacklist = (): Promise<Array<string>> => {
    return this.http.get("dns/blacklist/regex");
  };

  addExactWhitelist = (domain: string): Promise<ApiSuccessResponse> => {
    return this.http.post("dns/whitelist/exact", { domain: domain });
  };

  addExactBlacklist = (domain: string): Promise<ApiSuccessResponse> => {
    return this.http.post("dns/blacklist/exact", { domain: domain });
  };

  addRegexWhitelist = (domain: string): Promise<ApiSuccessResponse> => {
    return this.http.post("dns/whitelist/regex", { domain: domain });
  };

  addRegexBlacklist = (domain: string): Promise<ApiSuccessResponse> => {
    return this.http.post("dns/blacklist/regex", { domain: domain });
  };

  removeExactWhitelist = (domain: string): Promise<ApiSuccessResponse> => {
    return this.http.delete("dns/whitelist/exact/" + domain);
  };

  removeExactBlacklist = (domain: string): Promise<ApiSuccessResponse> => {
    return this.http.delete("dns/blacklist/exact/" + domain);
  };

  removeRegexWhitelist = (domain: string): Promise<ApiSuccessResponse> => {
    return this.http.delete(
      "dns/whitelist/regex/" + encodeURIComponent(domain)
    );
  };

  removeRegexBlacklist = (domain: string): Promise<ApiSuccessResponse> => {
    return this.http.delete(
      "dns/blacklist/regex/" + encodeURIComponent(domain)
    );
  };

  getStatus = (): Promise<ApiStatus> => {
    return this.http.get("dns/status");
  };

  setStatus = (
    action: StatusAction,
    time?: number
  ): Promise<ApiSuccessResponse> => {
    return this.http.post("dns/status", {
      action,
      time
    });
  };

  getNetworkInfo = (): Promise<ApiNetworkSettings> => {
    return this.http.get("settings/network");
  };

  getVersion = (): Promise<ApiVersions> => {
    return this.http.get("version");
  };

  getFTLdb = (): Promise<ApiFtlDbResponse> => {
    return this.http.get("settings/ftldb");
  };

  getDNSInfo = (): Promise<ApiDnsSettings> => {
    return this.http.get("settings/dns");
  };

  getDHCPInfo = (): Promise<ApiDhcpSettings> => {
    return this.http.get("settings/dhcp");
  };

  updateDHCPInfo = (settings: ApiDhcpSettings): Promise<ApiSuccessResponse> => {
    return this.http.put("settings/dhcp", settings);
  };

  updateDNSInfo = (settings: ApiDnsSettings): Promise<ApiSuccessResponse> => {
    return this.http.put("settings/dns", settings);
  };

  getPreferences = (): Promise<ApiPreferences> => {
    return this.http.get("settings/web");
  };

  updatePreferences = (
    settings: ApiPreferences
  ): Promise<ApiSuccessResponse> => {
    return this.http.put("settings/web", settings);
  };
}

export default new ApiClient(new HttpClient(config));

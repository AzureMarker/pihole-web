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

export interface ApiQuery {
  timestamp: number;
  type: number;
  status: number;
  domain: string;
  client: string;
  dnssec: number;
  reply: number;
  response_time: number;
}

export interface ApiHistoryResponse {
  cursor: null | string;
  history: Array<ApiQuery>;
}

export interface ApiNetworkSettings {
  interface: string;
  ipv4_address: string;
  ipv6_address: string;
  hostname: string;
}

export interface ApiVersion {
  branch: string;
  hash: string;
  tag: string;
}

export interface ApiVersions {
  api: ApiVersion;
  core: ApiVersion;
  ftl: ApiVersion;
  web: ApiVersion;
}

export interface ApiDnsSettings {
  upstream_dns: Array<string>;
  options: {
    fqdn_required: boolean;
    bogus_priv: boolean;
    dnssec: boolean;
    listening_type: string;
  };
  conditional_forwarding: {
    enabled: boolean;
    router_ip: string;
    domain: string;
  };
}

export interface ApiDhcpSettings {
  active: boolean;
  ip_start: string;
  ip_end: string;
  router_ip: string;
  lease_time: number;
  domain: string;
  ipv6_support: boolean;
}

export interface ApiFtlDbResponse {
  filesize: number;
  queries: number;
  sqlite_version: string;
}

export interface ApiSuccessResponse {
  status: "success";
}

export interface ApiError {
  key: string;
  message: string;
  data: any;
}

export interface ApiErrorResponse {
  error: ApiError;
}

export type ApiResultResponse = ApiSuccessResponse | ApiErrorResponse;

export type WebLayout = "boxed" | "traditional";

export interface ApiPreferences {
  layout: WebLayout;
  language: string;
}

export type Status = "enabled" | "disabled" | "unknown";
export type StatusAction = "enable" | "disable";

export interface ApiStatus {
  status: Status;
}

export interface ApiClientsGraph {
  over_time: Array<ApiClientOverTime>;
  clients: Array<ApiClientGraphInfo>;
}

export interface ApiClientOverTime {
  timestamp: number;
  data: Array<number>;
}

export interface ApiClientGraphInfo {
  name: string;
  ip: string;
}

export interface ApiHistoryGraphItem {
  timestamp: number;
  total_queries: number;
  blocked_queries: number;
}

export interface ApiQueryType {
  name: string;
  count: number;
}

export interface ApiSummary {
  gravity_size: number;
  total_queries: {
    A: number;
    AAAA: number;
    ANY: number;
    SRV: number;
    SOA: number;
    PTR: number;
    TXT: number;
    [key: string]: number;
  };
  blocked_queries: number;
  percent_blocked: number;
  unique_domains: number;
  forwarded_queries: number;
  cached_queries: number;
  reply_types: {
    IP: number;
    CNAME: number;
    DOMAIN: number;
    NODATA: number;
    NXDOMAIN: number;
    [key: string]: number;
  };
  total_clients: number;
  active_clients: number;
  status: string;
}

export interface ApiUpstreams {
  upstreams: Array<{
    name: string;
    ip: string;
    count: number;
  }>;
  forwarded_queries: number;
  total_queries: number;
}

export interface ApiTopDomainItem {
  domain: string;
  count: number;
}

export interface ApiTopBlocked {
  top_domains: Array<ApiTopDomainItem>;
  blocked_queries: number;
}

export interface ApiTopDomains {
  top_domains: Array<ApiTopDomainItem>;
  total_queries: number;
}

export interface ApiTopClients {
  top_clients: Array<ApiClient>;
  total_queries: number;
}

export interface ApiClient {
  name: string;
  ip: string;
  count: number;
}

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
  getHistoryGraph(): Promise<Array<ApiHistoryGraphItem>> {
    return http.get("stats/overTime/history");
  },
  getClientsGraph(): Promise<ApiClientsGraph> {
    return http.get("stats/overTime/clients");
  },
  getQueryTypes(): Promise<Array<ApiQueryType>> {
    return http.get("stats/query_types");
  },
  getUpstreams(): Promise<ApiUpstreams> {
    return http.get("stats/upstreams");
  },
  getTopDomains(): Promise<ApiTopDomains> {
    return http.get("stats/top_domains");
  },
  getTopBlocked(): Promise<ApiTopBlocked> {
    // The API uses a GET parameter to differentiate top domains from top
    // blocked, but the fake API is not able to handle GET parameters right now.
    const url = config.fakeAPI
      ? "stats/top_blocked"
      : "stats/top_domains?blocked=true";

    return http.get(url);
  },
  getTopClients(): Promise<ApiTopClients> {
    return http.get("stats/top_clients");
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
  setStatus(action: StatusAction, time: number | null = null) {
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

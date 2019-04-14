/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * API service tests
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import { ApiClient } from "../api";
import HttpClient from "../http";
import { TimeRange } from "../../components/common/context/TimeRangeContext";
import moment from "moment";
import { Config } from "../../config";

// Test each endpoint function to make sure it is calling the right endpoint
// with the right data.
describe("ApiClient", () => {
  // Services
  let httpClient: HttpClient;
  let api: ApiClient;

  // Test response data
  const getData = { test: "GET" };
  const postData = { test: "POST" };
  const putData = { test: "PUT" };
  const deleteData = { test: "DELETE" };
  const getPromise = Promise.resolve(getData);
  const postPromise = Promise.resolve(postData);
  const putPromise = Promise.resolve(putData);
  const deletePromise = Promise.resolve(deleteData);

  // Test data
  const range: TimeRange = {
    name: "Test time range",
    from: moment("2019-04-12T01:03:17+00:00"),
    until: moment("2019-04-13T01:03:17+00:00")
  };
  const rangeParams = "from=1555030997&until=1555117397";
  const config: Config = {
    developmentMode: true,
    fakeAPI: true,
    apiPath: "/admin/api"
  };

  beforeEach(() => {
    // Create fresh services
    httpClient = ({
      get: jest.fn(() => getPromise),
      post: jest.fn(() => postPromise),
      put: jest.fn(() => putPromise),
      delete: jest.fn(() => deletePromise),
      config
    } as any) as HttpClient;
    api = new ApiClient(httpClient);
  });

  describe("authentication calls", () => {
    it("should call login endpoint with auth headers", async () => {
      const key = "test";
      await expect(api.authenticate(key)).resolves.toEqual(getData);
      expect(httpClient.get).toHaveBeenCalledWith("auth", {
        headers: { "X-Pi-hole-Authenticate": key }
      });
    });

    it("should call logout endpoint", async () => {
      await expect(api.logout()).resolves.toEqual(deleteData);
      expect(httpClient.delete).toHaveBeenCalledWith("auth");
    });
  });

  describe("statistics calls", () => {
    it("should call summary endpoint", async () => {
      await expect(api.getSummary()).resolves.toEqual(getData);
      expect(httpClient.get).toHaveBeenCalledWith("stats/summary");
    });

    it("should call history graph endpoint", async () => {
      await expect(api.getHistoryGraph()).resolves.toEqual(getData);
      expect(httpClient.get).toHaveBeenCalledWith("stats/overTime/history");
    });

    it("should call clients graph endpoint", async () => {
      await expect(api.getClientsGraph()).resolves.toEqual(getData);
      expect(httpClient.get).toHaveBeenCalledWith("stats/overTime/clients");
    });

    it("should call query types endpoint", async () => {
      await expect(api.getQueryTypes()).resolves.toEqual(getData);
      expect(httpClient.get).toHaveBeenCalledWith("stats/query_types");
    });

    it("should call upstreams endpoint", async () => {
      await expect(api.getUpstreams()).resolves.toEqual(getData);
      expect(httpClient.get).toHaveBeenCalledWith("stats/upstreams");
    });

    it("should call top domains endpoint", async () => {
      await expect(api.getTopDomains()).resolves.toEqual(getData);
      expect(httpClient.get).toHaveBeenCalledWith("stats/top_domains");
    });

    it("should call top blocked endpoint (top_domains?blocked=true)", async () => {
      config.fakeAPI = false;
      await expect(api.getTopBlocked()).resolves.toEqual(getData);
      expect(httpClient.get).toHaveBeenCalledWith(
        "stats/top_domains?blocked=true"
      );
    });

    it("should call top blocked endpoint (top_blocked)", async () => {
      config.fakeAPI = true;
      await expect(api.getTopBlocked()).resolves.toEqual(getData);
      expect(httpClient.get).toHaveBeenCalledWith("stats/top_blocked");
    });

    it("should call top clients endpoint", async () => {
      await expect(api.getTopClients()).resolves.toEqual(getData);
      expect(httpClient.get).toHaveBeenCalledWith("stats/top_clients");
    });

    it("should call top history endpoint with params", async () => {
      const params = { test: "params" };
      await expect(api.getHistory(params)).resolves.toEqual(getData);
      expect(httpClient.get).toHaveBeenCalledWith("stats/history?test=params");
    });
  });

  describe("database statistic calls", () => {
    it("should call summary DB endpoint with time range", async () => {
      await expect(api.getSummaryDb(range)).resolves.toEqual(getData);
      expect(httpClient.get).toHaveBeenCalledWith(
        "stats/database/summary?" + rangeParams
      );
    });

    it("should call history graph DB endpoint with interval and time range", async () => {
      await expect(api.getHistoryGraphDb(range, 100)).resolves.toEqual(getData);
      expect(httpClient.get).toHaveBeenCalledWith(
        "stats/database/overTime/history?interval=100&" + rangeParams
      );
    });

    it("should call client graph DB endpoint with interval and time range", async () => {
      await expect(api.getClientsGraphDb(range, 100)).resolves.toEqual(getData);
      expect(httpClient.get).toHaveBeenCalledWith(
        "stats/database/overTime/clients?interval=100&" + rangeParams
      );
    });

    it("should call query types DB endpoint with time range", async () => {
      await expect(api.getQueryTypesDb(range)).resolves.toEqual(getData);
      expect(httpClient.get).toHaveBeenCalledWith(
        "stats/database/query_types?" + rangeParams
      );
    });

    it("should call query types DB endpoint with time range", async () => {
      await expect(api.getQueryTypesDb(range)).resolves.toEqual(getData);
      expect(httpClient.get).toHaveBeenCalledWith(
        "stats/database/query_types?" + rangeParams
      );
    });

    it("should call upstreams DB endpoint with time range", async () => {
      await expect(api.getUpstreamsDb(range)).resolves.toEqual(getData);
      expect(httpClient.get).toHaveBeenCalledWith(
        "stats/database/upstreams?" + rangeParams
      );
    });

    it("should call top domains DB endpoint with time range", async () => {
      await expect(api.getTopDomainsDb(range)).resolves.toEqual(getData);
      expect(httpClient.get).toHaveBeenCalledWith(
        "stats/database/top_domains?" + rangeParams
      );
    });

    it("should call top blocked DB endpoint (top_domains?blocked=true) with time range", async () => {
      config.fakeAPI = false;
      await expect(api.getTopBlockedDb(range)).resolves.toEqual(getData);
      expect(httpClient.get).toHaveBeenCalledWith(
        "stats/database/top_domains?blocked=true&" + rangeParams
      );
    });

    it("should call top blocked DB endpoint (top_blocked) with time range", async () => {
      config.fakeAPI = true;
      await expect(api.getTopBlockedDb(range)).resolves.toEqual(getData);
      expect(httpClient.get).toHaveBeenCalledWith(
        "stats/database/top_blocked?" + rangeParams
      );
    });

    it("should call top clients DB endpoint with time range", async () => {
      await expect(api.getTopClientsDb(range)).resolves.toEqual(getData);
      expect(httpClient.get).toHaveBeenCalledWith(
        "stats/database/top_clients?" + rangeParams
      );
    });
  });

  describe("dns calls", () => {
    it("should call get whitelist endpoint", async () => {
      await expect(api.getWhitelist()).resolves.toEqual(getData);
      expect(httpClient.get).toHaveBeenCalledWith("dns/whitelist");
    });

    it("should call get blacklist endpoint", async () => {
      await expect(api.getBlacklist()).resolves.toEqual(getData);
      expect(httpClient.get).toHaveBeenCalledWith("dns/blacklist");
    });

    it("should call get regexlist endpoint", async () => {
      await expect(api.getRegexlist()).resolves.toEqual(getData);
      expect(httpClient.get).toHaveBeenCalledWith("dns/regexlist");
    });

    it("should call add whitelist endpoint with domain", async () => {
      const domain = "test.com";
      await expect(api.addWhitelist(domain)).resolves.toEqual(postData);
      expect(httpClient.post).toHaveBeenCalledWith("dns/whitelist", { domain });
    });

    it("should call add blacklist endpoint with domain", async () => {
      const domain = "test.com";
      await expect(api.addBlacklist(domain)).resolves.toEqual(postData);
      expect(httpClient.post).toHaveBeenCalledWith("dns/blacklist", { domain });
    });

    it("should call add regexlist endpoint with domain", async () => {
      const domain = "test.com";
      await expect(api.addRegexlist(domain)).resolves.toEqual(postData);
      expect(httpClient.post).toHaveBeenCalledWith("dns/regexlist", { domain });
    });

    it("should call remove whitelist endpoint with domain", async () => {
      const domain = "test.com";
      await expect(api.removeWhitelist(domain)).resolves.toEqual(deleteData);
      expect(httpClient.delete).toHaveBeenCalledWith("dns/whitelist/" + domain);
    });

    it("should call remove blacklist endpoint with domain", async () => {
      const domain = "test.com";
      await expect(api.removeBlacklist(domain)).resolves.toEqual(deleteData);
      expect(httpClient.delete).toHaveBeenCalledWith("dns/blacklist/" + domain);
    });

    it("should call remove regexlist endpoint with encoded domain", async () => {
      const regex = "^test\\.com$";
      await expect(api.removeRegexlist(regex)).resolves.toEqual(deleteData);
      expect(httpClient.delete).toHaveBeenCalledWith(
        "dns/regexlist/%5Etest%5C.com%24"
      );
    });

    it("should call get status endpoint", async () => {
      await expect(api.getStatus()).resolves.toEqual(getData);
      expect(httpClient.get).toHaveBeenCalledWith("dns/status");
    });

    it("should call set status endpoint with action data", async () => {
      const action: StatusAction = "enable";
      const time = 100;
      await expect(api.setStatus(action, time)).resolves.toEqual(postData);
      expect(httpClient.post).toHaveBeenCalledWith("dns/status", {
        action,
        time
      });
    });
  });

  describe("settings calls", () => {
    it("should call get network settings endpoint", async () => {
      await expect(api.getNetworkInfo()).resolves.toEqual(getData);
      expect(httpClient.get).toHaveBeenCalledWith("settings/network");
    });

    it("should call version endpoint", async () => {
      await expect(api.getVersion()).resolves.toEqual(getData);
      expect(httpClient.get).toHaveBeenCalledWith("version");
    });

    it("should call FTL DB settings endpoint", async () => {
      await expect(api.getFTLdb()).resolves.toEqual(getData);
      expect(httpClient.get).toHaveBeenCalledWith("settings/ftldb");
    });

    it("should call get DNS settings endpoint", async () => {
      await expect(api.getDNSInfo()).resolves.toEqual(getData);
      expect(httpClient.get).toHaveBeenCalledWith("settings/dns");
    });

    it("should call get DHCP settings endpoint", async () => {
      await expect(api.getDHCPInfo()).resolves.toEqual(getData);
      expect(httpClient.get).toHaveBeenCalledWith("settings/dhcp");
    });

    it("should call get web preferences settings endpoint", async () => {
      await expect(api.getPreferences()).resolves.toEqual(getData);
      expect(httpClient.get).toHaveBeenCalledWith("settings/web");
    });

    it("should call set DNS settings endpoint", async () => {
      const settings = ({ test: true } as any) as ApiDnsSettings;
      await expect(api.updateDNSInfo(settings)).resolves.toEqual(putData);
      expect(httpClient.put).toHaveBeenCalledWith("settings/dns", settings);
    });

    it("should call set DHCP settings endpoint", async () => {
      const settings = ({ test: true } as any) as ApiDhcpSettings;
      await expect(api.updateDHCPInfo(settings)).resolves.toEqual(putData);
      expect(httpClient.put).toHaveBeenCalledWith("settings/dhcp", settings);
    });

    it("should call set web preferences settings endpoint", async () => {
      const settings = ({ test: true } as any) as ApiPreferences;
      await expect(api.updatePreferences(settings)).resolves.toEqual(putData);
      expect(httpClient.put).toHaveBeenCalledWith("settings/web", settings);
    });
  });
});

/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Create fake API data
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

const faker = require("faker");
const fs = require("fs-extra");

function unique(generator, size) {
  const data = [];

  while (data.length !== size) {
    const item = generator();

    if (!data.includes(item)) data.push(item);
  }

  return data;
}

function list() {
  return unique(faker.internet.domainName, 10);
}

function status() {
  return { status: "enabled" };
}

function auth() {
  return { status: "success" };
}

function pastDate() {
  return Math.floor(faker.date.past().getTime() / 1000);
}

function history(length) {
  const startDate = pastDate();

  return new Array(length).fill(null).map((_, i) => {
    const isIPv4 = faker.random.boolean();
    const isHostname = faker.random.boolean();
    return [
      startDate + i,
      isIPv4 ? "IPv4" : "IPv6",
      faker.internet.domainName(),
      isHostname
        ? faker.internet.domainWord() + ".local"
        : isIPv4
          ? faker.internet.ip()
          : faker.internet.ipv6(),
      Math.floor(Math.random() * 5) + 1
    ];
  });
}

function summary() {
  const queryTypeTotals = [
    faker.random.number(), // A
    faker.random.number(), // AAAA
    faker.random.number(), // ANY
    faker.random.number(), // SRV
    faker.random.number(), // SOA
    faker.random.number(), // PTR
    faker.random.number() // TXT
  ];

  const total = queryTypeTotals.reduce(
    (previous, current) => previous + current,
    0
  );
  const blocked = faker.random.number({ max: total });
  const forwarded = faker.random.number({ max: total });
  const clients = faker.random.number();

  return {
    gravity_size: faker.random.number(),
    total_queries: {
      A: queryTypeTotals[0],
      AAAA: queryTypeTotals[1],
      ANY: queryTypeTotals[2],
      SRV: queryTypeTotals[3],
      SOA: queryTypeTotals[4],
      PTR: queryTypeTotals[5],
      TXT: queryTypeTotals[6]
    },
    blocked_queries: blocked,
    percent_blocked: (blocked * 100) / total,
    unique_domains: faker.random.number({ max: total }),
    forwarded_queries: forwarded,
    cached_queries: total - forwarded,
    reply_types: {
      IP: total / 5,
      CNAME: total / 5,
      DOMAIN: total / 5,
      NODATA: total / 5,
      NXDOMAIN: total / 5
    },
    total_clients: clients,
    active_clients: clients - faker.random.number({ max: clients }),
    ...status()
  };
}

function queryTypes() {
  const data = [];
  const total = faker.random.number();
  const names = ["A", "AAAA", "ANY", "SRV", "SOA", "PTR", "TXT"];
  const count = total / names.length;

  for (const name of names) {
    data.push({ name, count });
  }

  return data;
}

function upstreams(length) {
  const upstreams = [];
  const numbers = [];
  const names = unique(faker.internet.domainName, length);
  const ipAddrs = unique(faker.internet.ip, length);
  let forwardedQueries = 0;

  for (let i = 0; i < length; i++) {
    const number = faker.random.number();

    forwardedQueries += number;
    numbers.push(number);
  }

  for (let i = 0; i < length; i++) {
    upstreams.push({
      name: names[i],
      ip: ipAddrs[i],
      count: numbers[i]
    });
  }

  return {
    upstreams,
    forwarded_queries: forwardedQueries,
    total_queries: forwardedQueries + faker.random.number()
  };
}

function topList(length, max, fakeData) {
  const result = [];
  const numbers = [];
  const domains = unique(fakeData, length);

  for (let i = 0; i < length; i++)
    numbers.push(faker.random.number({ max: max }));

  numbers.sort((a, b) => (parseInt(a, 10) > parseInt(b, 10) ? -1 : 1));

  for (let i = 0; i < length; i++) {
    result.push({
      domain: domains[i],
      count: numbers[i]
    });
  }

  return result;
}

function topBlocked(length) {
  const totalQueries = faker.random.number();

  return {
    top_domains: topList(length, totalQueries, faker.internet.domainName),
    blocked_queries: totalQueries
  };
}

function topDomains(length) {
  const totalQueries = faker.random.number();

  return {
    top_domains: topList(length, totalQueries, faker.internet.domainName),
    total_queries: totalQueries
  };
}

function topClients(length) {
  const totalQueries = faker.random.number();
  const top_clients = [];
  const numbers = [];
  const clients = unique(faker.internet.ip, length);

  for (let i = 0; i < length; i++)
    numbers.push(faker.random.number({ max: totalQueries }));

  numbers.sort((a, b) => (parseInt(a, 10) > parseInt(b, 10) ? -1 : 1));

  for (let i = 0; i < length; i++) {
    top_clients.push({
      name: "",
      ip: clients[i],
      count: numbers[i]
    });
  }

  return {
    top_clients: top_clients,
    total_queries: totalQueries
  };
}

function clientsOverTime(range, size) {
  const startDate = pastDate();
  const clients = unique(faker.internet.ip, size).map(ip => ({
    name: faker.internet.domainWord(),
    ip
  }));
  const graph = [];

  for (let i = 0; i < range; i++) {
    graph.push({
      timestamp: startDate + 600 * i,
      data: new Array(size).fill(null).map(() => faker.random.number())
    });
  }

  return {
    over_time: graph,
    clients: clients
  };
}

function historyOverTime(range) {
  const startDate = pastDate();
  const history = [];

  for (let i = 0; i < range; i++) {
    const totalQueries = faker.random.number();
    const blockedQueries = faker.random.number({ max: totalQueries });
    const timestamp = startDate + 600 * i;

    history.push({
      timestamp,
      total_queries: totalQueries + blockedQueries,
      blocked_queries: blockedQueries
    });
  }

  return history;
}

function write(filePath, data) {
  fs.outputFileSync(filePath, JSON.stringify(data));
}

function getNetworkInfo() {
  return {
    interface: faker.random.arrayElement(["eth0", "eth1", "wlan0", "wlan1"]),
    ipv4_address: faker.internet.ip(),
    ipv6_address: faker.internet.ipv6(),
    hostname: faker.random
      .word()
      .toLowerCase()
      .split(" ", 2)[0]
  };
}

function getFTLdb() {
  return {
    queries: faker.random.number({ min: 50000, max: 1000000 }),
    filesize: faker.random.number({ min: 1000, max: 100000 }),
    sqlite_version: "3.0.1"
  };
}

function getVersionInfo() {
  return {
    api: {
      branch: faker.random.arrayElement([
        "master",
        "development",
        "FTL",
        "beta",
        "test"
      ]),
      hash: faker.internet.color().substring(1) + faker.random.number(9),
      tag: "vDev"
    },
    core: {
      branch: faker.random.arrayElement([
        "master",
        "development",
        "FTL",
        "beta",
        "test"
      ]),
      hash: faker.internet.color().substring(1) + faker.random.number(9),
      tag: "vDev"
    },
    ftl: {
      branch: faker.random.arrayElement([
        "master",
        "development",
        "FTL",
        "beta",
        "test"
      ]),
      hash: faker.internet.color().substring(1) + faker.random.number(9),
      tag: "vDev"
    },
    web: {
      branch: faker.random.arrayElement([
        "master",
        "development",
        "FTL",
        "beta",
        "test"
      ]),
      hash: faker.internet.color().substring(1) + faker.random.number(9),
      tag: "vDev"
    }
  };
}

function getDHCPInfo() {
  return {
    active: faker.random.boolean(),
    ip_start: faker.internet.ip(),
    ip_end: faker.internet.ip(),
    router_ip: faker.internet.ip(),
    lease_time: faker.random.number({ min: 1, max: 99 }),
    domain: faker.random
      .word()
      .toLowerCase()
      .split(" ", 2)[0],
    ipv6_support: faker.random.boolean()
  };
}

function getDNSInfo() {
  return {
    upstream_dns: [
      faker.internet.ip(),
      faker.internet.ip(),
      faker.internet.ip()
    ],
    options: {
      fqdn_required: faker.random.boolean(),
      bogus_priv: faker.random.boolean(),
      dnssec: faker.random.boolean(),
      listening_type: faker.random.arrayElement(["single", "lan", "all"])
    },
    conditional_forwarding: {
      enabled: faker.random.boolean(),
      router_ip: faker.internet.ip(),
      domain: faker.random
        .word()
        .toLowerCase()
        .split(" ", 2)[0]
    }
  };
}

console.log("Deleting old fake API data...");
fs.emptyDirSync("public/fakeAPI/dns");
fs.emptyDirSync("public/fakeAPI/stats");
fs.emptyDirSync("public/fakeAPI/settings");
fs.removeSync("public/fakeAPI/auth");
fs.removeSync("public/fakeAPI/version");

console.log("Generating new fake API data...");
write("public/fakeAPI/dns/whitelist", list());
write("public/fakeAPI/dns/blacklist", list());
write("public/fakeAPI/dns/regexlist", list());
write("public/fakeAPI/dns/status", status());
write("public/fakeAPI/settings/dhcp", getDHCPInfo());
write("public/fakeAPI/settings/dns", getDNSInfo());
write("public/fakeAPI/settings/network", getNetworkInfo());
write("public/fakeAPI/settings/ftldb", getFTLdb());
write("public/fakeAPI/stats/overTime/history", historyOverTime(144));
write("public/fakeAPI/stats/overTime/clients", clientsOverTime(144, 5));
write("public/fakeAPI/stats/summary", summary());
write("public/fakeAPI/stats/history", history(5000));
write("public/fakeAPI/stats/query_types", queryTypes());
write("public/fakeAPI/stats/upstreams", upstreams(3));
write("public/fakeAPI/stats/top_blocked", topBlocked(10));
write("public/fakeAPI/stats/top_domains", topDomains(10));
write("public/fakeAPI/stats/top_clients", topClients(10));
write("public/fakeAPI/auth", auth());
write("public/fakeAPI/version", getVersionInfo());

console.log("Done!");

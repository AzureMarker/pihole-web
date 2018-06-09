/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Create fake API data
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

const faker = require('faker');
const fs = require('fs-extra');

function unique(generator, size) {
  const data = [];

  while(data.length !== size) {
    const item = generator();

    if(!data.includes(item))
      data.push(item);
  }

  return data;
}

function list() {
  return unique(faker.internet.domainName, 10);
}

function status() {
  return { status: "enabled" };
}

function pastDate() {
  return Math.floor(faker.date.past().getTime() / 1000);
}

function history(length) {
  const startDate = pastDate();

  return (new Array(length)).fill(null).map((_, i) => {
    const isIPv4 = faker.random.boolean();
    const isHostname = faker.random.boolean();
    return [
      startDate + i,
      isIPv4 ? "IPv4" : "IPv6",
      faker.internet.domainName(),
      isHostname ? faker.internet.domainWord() + ".local" : isIPv4 ? faker.internet.ip() : faker.internet.ipv6(),
      Math.floor(Math.random() * 5) + 1
    ];
  });
}

function summary() {
  const total = faker.random.number();
  const ads = faker.random.number({max: total});
  const forwarded = faker.random.number({ max: total });
  const clients = faker.random.number();

  return {
    "domains_blocked": faker.random.number(),
    "total_queries": total,
    "blocked_queries": ads,
    "percent_blocked": ads * 100 / total,
    "unique_domains": faker.random.number({ max: total }),
    "forwarded_queries": forwarded,
    "cached_queries": total - forwarded,
    "total_clients": clients,
    "unique_clients": faker.random.number({ max: clients }),
    ... status()
  };
}

function topList(length, max, fakeData) {
  const result = [];
  const numbers = [];
  const domains = unique(fakeData, length);

  for(let i = 0; i < length; i++)
    numbers.push(faker.random.number({ max: max }));

  numbers.sort((a, b) => parseInt(a, 10) > parseInt(b, 10) ? -1 : 1);

  for(let i = 0; i < length; i++) {
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
    "top_blocked": topList(length, totalQueries, faker.internet.domainName),
    "blocked_queries": totalQueries
  };
}

function topDomains(length) {
  const totalQueries = faker.random.number();

  return {
    "top_domains": topList(length, totalQueries, faker.internet.domainName),
    "total_queries": totalQueries
  };
}

function topClients(length) {
  const totalQueries = faker.random.number();
  const top_clients = [];
  const numbers = [];
  const clients = unique(faker.internet.ip, length);

  for(let i = 0; i < length; i++)
    numbers.push(faker.random.number({ max: totalQueries }));

  numbers.sort((a, b) => parseInt(a, 10) > parseInt(b, 10) ? -1 : 1);

  for(let i = 0; i < length; i++) {
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
  const clients = unique(faker.internet.ip, size)
    .map(ip => ({ name: faker.internet.domainWord(), ip }));
  const graph = [];

  for(let i = 0; i < range; i++) {
    graph.push({
      timestamp: startDate + 600 * i,
      data: (new Array(size)).fill(null).map(() => faker.random.number())
    });
  }

  return {
    "over_time": graph,
    "clients": clients
  };
}

function historyOverTime(range) {
  const startDate = pastDate();
  const domains = [];
  const ads = [];

  for(let i = 0; i < range; i++) {
    const numDomains = faker.random.number();
    const numAds = faker.random.number({ max: numDomains });
    const time = startDate + 600 * i;

    domains.push({
      timestamp: time,
      count: numDomains
    });
    ads.push({
      timestamp: time,
      count: numAds
    });
  }

  return {
    "domains_over_time": domains,
    "blocked_over_time": ads
  };
}

function write(filePath, data) {
  fs.outputFileSync(filePath, JSON.stringify(data));
}

console.log("Deleting old fake API data...");
fs.emptyDirSync("public/fakeAPI/dns");
fs.emptyDirSync("public/fakeAPI/stats");

console.log("Generating new fake API data...");
write("public/fakeAPI/dns/whitelist", list("white"));
write("public/fakeAPI/dns/blacklist", list("black"));
write("public/fakeAPI/dns/wildlist", list("wild"));
write("public/fakeAPI/dns/status", status());
write("public/fakeAPI/stats/overTime/history", historyOverTime(144));
write("public/fakeAPI/stats/overTime/clients", clientsOverTime(144, 5));
write("public/fakeAPI/stats/summary", summary());
write("public/fakeAPI/stats/history", history(5000));
write("public/fakeAPI/stats/top_blocked", topBlocked(10));
write("public/fakeAPI/stats/top_domains", topDomains(10));
write("public/fakeAPI/stats/top_clients", topClients(10));

console.log("Done!");

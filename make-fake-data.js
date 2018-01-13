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
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

function reply_data(data) {
  return {
    "data": data,
    "errors": []
  }
}

function list() {
  return reply_data((new Array(10)).fill(null).map(() => faker.internet.domainName()));
}

function status() {
  return reply_data({"status": 1});
}

function pastDate() {
  return Math.floor(faker.date.past().getTime() / 1000);
}

function history(length) {
  const startDate = pastDate();

  return reply_data((new Array(length)).fill(null).map((_, i) => {
    const isIPv4 = faker.random.boolean();
    const isHostname = faker.random.boolean();
    return [
      startDate + i,
      isIPv4 ? "IPv4" : "IPv6",
      faker.internet.domainName(),
      isHostname ? faker.internet.domainWord() + ".local" : isIPv4 ? faker.internet.ip() : faker.internet.ipv6(),
      Math.floor(Math.random() * 5) + 1
    ];
  }));
}

function summary() {
  const total = faker.random.number();
  const ads = faker.random.number({max: total});
  const forwarded = faker.random.number({ max: total });
  const clients = faker.random.number();

  return reply_data({
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
  });
}

function topList(length, max, fakeData) {
  const result = {};
  const numbers = [];

  for(let i = 0; i < length; i++)
    numbers.push(faker.random.number({ max: max }));

  numbers.sort((a, b) => parseInt(a, 10) > parseInt(b, 10) ? -1 : 1);

  for(let i = 0; i < length; i++) {
    let domain;

    while((domain = fakeData()) in Object.keys(result)) {}

    result[domain] = numbers[i];
  }

  return result;
}

function topBlocked(length) {
  const totalQueries = faker.random.number();

  return reply_data({
    "top_blocked": topList(length, totalQueries, faker.internet.domainName),
    "blocked_queries": totalQueries
  });
}

function topDomains(length) {
  const totalQueries = faker.random.number();

  return reply_data({
    "top_domains": topList(length, totalQueries, faker.internet.domainName),
    "total_queries": totalQueries
  });
}

function topClients(length) {
  const totalQueries = faker.random.number();

  return reply_data({
    "top_clients": topList(length, totalQueries, faker.internet.ip),
    "total_queries": totalQueries
  });
}

function forwardDestOverTime(range, totalDest) {
  const startDate = pastDate();
  const forwardDest = topList(totalDest, faker.random.number(), faker.internet.ip);
  const graph = {};

  for(let i = 0; i < range; i++) {
    graph[(startDate + 600 * i).toString()] = (new Array(totalDest)).fill(null).map((_, j) => {
      return faker.random.number({ max: forwardDest[Object.keys(forwardDest)[j]] });
    });
  }

  return reply_data({
    "over_time": graph,
    "forward_destinations": forwardDest
  });
}

function queryTypesOverTime(range) {
  const startDate = pastDate();
  const queryTypes = {};

  for(let i = 0; i < range; i++) {
    queryTypes[(startDate + 600 * i).toString()] = [faker.random.number(), faker.random.number()];
  }

  return reply_data(queryTypes);
}

function historyOverTime(range) {
  const startDate = pastDate();
  const domains = {};
  const ads = {};

  for(let i = 0; i < range; i++) {
    const numDomains = faker.random.number();
    const numAds = faker.random.number({ max: numDomains });
    const time = (startDate + 600 * i).toString();

    domains[time] = numDomains;
    ads[time] = numAds;
  }

  return reply_data({
    "domains_over_time": domains,
    "blocked_over_time": ads
  });
}

function remove(path) {
  try {
    fs.unlinkSync(path);
  }
  catch(e) {
    // Ignore missing file
  }
}

function write(filePath, data) {
  const dir = path.dirname(filePath);

  if(!fs.existsSync(dir))
    mkdirp.sync(dir);

  fs.writeFileSync(filePath, JSON.stringify(data));
}

console.log("Deleting old fake API data...");

remove("public/fakeAPI/dns/whitelist");
remove("public/fakeAPI/dns/blacklist");
remove("public/fakeAPI/dns/wildlist");
remove("public/fakeAPI/dns/status");
remove("public/fakeAPI/stats/overTime/history");
remove("public/fakeAPI/stats/overTime/forward_destinations");
remove("public/fakeAPI/stats/overTime/query_types");
remove("public/fakeAPI/stats/summary");
remove("public/fakeAPI/stats/history");
remove("public/fakeAPI/stats/top_blocked");
remove("public/fakeAPI/stats/top_domains");
remove("public/fakeAPI/stats/top_clients");

console.log("Generating new fake API data...");

write("public/fakeAPI/dns/whitelist", list("white"));
write("public/fakeAPI/dns/blacklist", list("black"));
write("public/fakeAPI/dns/wildlist", list("wild"));
write("public/fakeAPI/dns/status", status());
write("public/fakeAPI/stats/overTime/history", historyOverTime(144));
write("public/fakeAPI/stats/overTime/forward_destinations", forwardDestOverTime(144, 3));
write("public/fakeAPI/stats/overTime/query_types", queryTypesOverTime(144));
write("public/fakeAPI/stats/summary", summary());
write("public/fakeAPI/stats/history", history(5000));
write("public/fakeAPI/stats/top_blocked", topBlocked(10));
write("public/fakeAPI/stats/top_domains", topDomains(10));
write("public/fakeAPI/stats/top_clients", topClients(10));

console.log("Done!");

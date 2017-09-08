const faker = require('faker');
const fs = require('fs');

function list(listType) {
  const result = {};

  result[listType + "list"] = (new Array(10)).fill(null).map(() => faker.internet.domainName());

  return result;
}

function status() {
  return {"status": 1}
}

function pastDate() {
  return Math.floor(faker.date.past().getTime() / 1000);
}

function history(length) {
  const startDate = pastDate();

  return {
    "history": (new Array(length)).fill(null).map((_, i) => {
      const isIPv4 = faker.random.boolean();
      return [
        startDate + i,
        isIPv4 ? "IPv4" : "IPv6",
        faker.internet.domainName(),
        isIPv4 ? faker.internet.ip() : faker.internet.ipv6(),
        Math.floor(Math.random() * 5) + 1
      ];
    })
  };
}

function summary() {
  const total = faker.random.number();
  const ads = faker.random.number({max: total});
  const forwarded = faker.random.number({ max: total });

  return {
    "domains_being_blocked": faker.random.number(),
    "dns_queries_today": total,
    "ads_blocked_today": ads,
    "ads_percentage_today": ads * 100 / total,
    "unique_domains": faker.random.number({ max: total }),
    "queries_forwarded": forwarded,
    "queries_cached": total - forwarded,
    "unique_clients": faker.random.number({ max: total })
  }
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

function topAds(length) {
  const totalQueries = faker.random.number();

  return {
    "top_ads": topList(length, totalQueries, faker.internet.domainName),
    "ads_blocked_today": totalQueries
  };
}

function topDomains(length) {
  const totalQueries = faker.random.number();

  return {
    "top_domains": topList(length, totalQueries, faker.internet.domainName),
    "dns_queries_today": totalQueries
  }
}

function topClients(length) {
  const totalQueries = faker.random.number();

  return {
    "top_clients": topList(length, totalQueries, faker.internet.ip),
    "dns_queries_today": totalQueries
  }
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

  return {
    "over_time": graph,
    "forward_destinations": forwardDest
  }
}

function queryTypesOverTime(range) {
  const startDate = pastDate();
  const queryTypes = {};

  for(let i = 0; i < range; i++) {
    queryTypes[(startDate + 600 * i).toString()] = [faker.random.number(), faker.random.number()];
  }

  return {
    "query_types": queryTypes
  }
}

function graph(range) {
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

  return {
    "domains_over_time": domains,
    "ads_over_time": ads
  }
}

function remove(path) {
  try {
    fs.unlinkSync(path);
  }
  catch(e) {
    // Ignore missing file
  }
}

function write(path, data) {
  fs.writeFileSync(path, JSON.stringify(data));
}

console.log(JSON.stringify(topList(10, 10, faker.internet.domainName)));
console.log(JSON.stringify(topAds(10)));

console.log("Deleting old fake API data...");

remove("public/fakeAPI/dns/whitelist");
remove("public/fakeAPI/dns/blacklist");
remove("public/fakeAPI/dns/wildlist");
remove("public/fakeAPI/dns/status");
remove("public/fakeAPI/stats/overTime/graph");
remove("public/fakeAPI/stats/overTime/forward_dest");
remove("public/fakeAPI/stats/overTime/query_types");
remove("public/fakeAPI/stats/summary");
remove("public/fakeAPI/stats/history");
remove("public/fakeAPI/stats/top_ads");
remove("public/fakeAPI/stats/top_domains");
remove("public/fakeAPI/stats/top_clients");

console.log("Generating new fake API data...");

write("public/fakeAPI/dns/whitelist", list("white"));
write("public/fakeAPI/dns/blacklist", list("black"));
write("public/fakeAPI/dns/wildlist", list("wild"));
write("public/fakeAPI/dns/status", status());
write("public/fakeAPI/stats/overTime/graph", graph(144));
write("public/fakeAPI/stats/overTime/forward_dest", forwardDestOverTime(144, 3));
write("public/fakeAPI/stats/overTime/query_types", queryTypesOverTime(144));
write("public/fakeAPI/stats/summary", summary());
write("public/fakeAPI/stats/history", history(5000));
write("public/fakeAPI/stats/top_ads", topAds(10));
write("public/fakeAPI/stats/top_domains", topDomains(10));
write("public/fakeAPI/stats/top_clients", topClients(10));

console.log("Done!");

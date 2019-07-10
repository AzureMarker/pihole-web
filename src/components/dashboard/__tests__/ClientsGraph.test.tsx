/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * ClientsGraph component test
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import { shallow } from "enzyme";
import {
  ClientsGraph,
  ClientsGraphContainer,
  loadingProps,
  transformData,
  TranslatedClientsGraph
} from "../ClientsGraph";
import {
  TimeRange,
  TimeRangeContext,
  TimeRangeContextType
} from "../../common/context/TimeRangeContext";
import moment from "moment";
import { Line } from "react-chartjs-2";
import { ChartData, ChartTooltipItem } from "chart.js";
import { ApiClient } from "../../../util/api";

const fakeData: ApiClientsGraph = {
  over_time: [
    { timestamp: 1513218354, data: [48476, 35688, 95153, 56971, 83497] },
    { timestamp: 1513218954, data: [53603, 88146, 17471, 3039, 33678] },
    { timestamp: 1513219554, data: [4390, 17405, 40846, 89063, 60714] },
    { timestamp: 1513220154, data: [16004, 73869, 18194, 68378, 63864] },
    { timestamp: 1513220754, data: [46542, 88508, 52954, 79578, 26691] },
    { timestamp: 1513221354, data: [96398, 29977, 78724, 58240, 69007] },
    { timestamp: 1513221954, data: [10924, 45703, 92305, 30644, 37037] },
    { timestamp: 1513222554, data: [22372, 15812, 80202, 74595, 94951] },
    { timestamp: 1513223154, data: [31945, 60973, 78084, 79314, 9466] },
    { timestamp: 1513223754, data: [20971, 341, 75043, 94344, 71002] }
  ],
  clients: [
    { name: "nelda", ip: "17.12.208.248" },
    { name: "", ip: "211.248.123.52" },
    { name: "danyka", ip: "141.84.19.123" },
    { name: "", ip: "181.237.62.132" },
    { name: "wilfrid", ip: "134.239.133.90" }
  ]
};

const tick = global.tick;

it("shows loading indicator correctly", () => {
  const wrapper = shallow(<TranslatedClientsGraph {...loadingProps} />).dive();

  expect(wrapper.children(".card-img-overlay")).toExist();
});

it("hides loading indicator correctly", async () => {
  const wrapper = shallow(
    <TranslatedClientsGraph {...loadingProps} loading={false} />
  );

  expect(wrapper.children(".card-img-overlay")).not.toExist();
});

it("loads API data correctly", async () => {
  const props = transformData(fakeData, null);

  expect(props.labels[0]).toEqual(
    new Date(1000 * fakeData.over_time[0].timestamp).toISOString()
  );
  expect(props.datasets[2].label).toEqual(fakeData.clients[2].name);
  expect(props.datasets[1].label).toEqual(fakeData.clients[1].ip);
  expect(props.datasets[0].data!.length).toEqual(fakeData.over_time.length - 1);
});

it("should use all of the data if there is a time range set", () => {
  const range: TimeRange = {
    name: "test",
    from: moment().subtract(1, "hour"),
    until: moment()
  };
  const props = transformData(fakeData, range);

  expect(props.datasets[0].data!.length).toEqual(fakeData.over_time.length);
});

it("should use hour as the time unit if the time range is less than a day", () => {
  const range: TimeRange = {
    name: "test",
    from: moment().subtract(1, "hour"),
    until: moment()
  };
  const props = transformData(fakeData, range);

  expect(props.timeUnit).toEqual("hour");
});

it("should use day as the time unit if the time range is more than a day", () => {
  const range: TimeRange = {
    name: "test",
    from: moment().subtract(2, "days"),
    until: moment()
  };
  const props = transformData(fakeData, range);

  expect(props.timeUnit).toEqual("day");
});

it("should show the date range in the tooltip title", () => {
  const t = jest.fn(key => key);
  const wrapper = shallow(
    // @ts-ignore Ignore the missing i18n props
    <ClientsGraph {...transformData(fakeData, null)} t={t} />
  );

  const titleFunc = wrapper.find(Line).props().options!.tooltips!.callbacks!
    .title!;
  const tooltipItem: ChartTooltipItem = {
    datasetIndex: 0,
    index: 0,
    xLabel: "04:02",
    yLabel: ""
  };

  const result = titleFunc([tooltipItem], {});

  expect(result).toEqual("Client activity from {{from}} to {{to}}");
  expect(t).toHaveBeenCalledWith("Client activity from {{from}} to {{to}}", {
    from: "03:57:00",
    to: "04:06:59"
  });
});

it("should show the client and count in the tooltip label", () => {
  const wrapper = shallow(
    <TranslatedClientsGraph {...transformData(fakeData, null)} />
  ).dive();

  const labelFunc = wrapper.find(Line).props().options!.tooltips!.callbacks!
    .label!;
  const tooltipItem: ChartTooltipItem = {
    datasetIndex: 0,
    index: 0,
    xLabel: "xLabel",
    yLabel: "yLabel"
  };
  const data: ChartData = {
    datasets: [
      {
        label: "datasetLabel"
      }
    ]
  };

  expect(labelFunc(tooltipItem, data)).toEqual("datasetLabel: yLabel");
});

it("should use the normal API call when there is no time range", () => {
  const context: TimeRangeContextType = {
    range: null,
    update: () => {}
  };
  const apiClient = ({
    getClientsGraph: jest.fn(() => Promise.reject({ isCanceled: true })),
    getClientsGraphDb: jest.fn(() => Promise.reject({ isCanceled: true }))
  } as any) as ApiClient;

  shallow(
    <TimeRangeContext.Provider value={context}>
      <ClientsGraphContainer apiClient={apiClient} />
    </TimeRangeContext.Provider>
  )
    .dive()
    .dive()
    .dive();

  expect(apiClient.getClientsGraph).toHaveBeenCalled();
  expect(apiClient.getClientsGraphDb).not.toHaveBeenCalled();
});

it("should use the DB API call when there is a time range", () => {
  const context: TimeRangeContextType = {
    range: {
      name: "test",
      from: moment().subtract(1, "day"),
      until: moment()
    },
    update: () => {}
  };
  const apiClient = ({
    getClientsGraph: jest.fn(() => Promise.reject({ isCanceled: true })),
    getClientsGraphDb: jest.fn(() => Promise.reject({ isCanceled: true }))
  } as any) as ApiClient;

  shallow(
    <TimeRangeContext.Provider value={context}>
      <ClientsGraphContainer apiClient={apiClient} />
    </TimeRangeContext.Provider>
  )
    .dive()
    .dive()
    .dive();

  expect(apiClient.getClientsGraph).not.toHaveBeenCalled();
  expect(apiClient.getClientsGraphDb).toHaveBeenCalledWith(context.range, 600);
});

it("should transform the data and render if the API returns data", async () => {
  const context: TimeRangeContextType = {
    range: null,
    update: () => {}
  };
  const apiClient = ({
    getClientsGraph: () => Promise.resolve(fakeData)
  } as any) as ApiClient;

  const wrapper = shallow(
    <TimeRangeContext.Provider value={context}>
      <ClientsGraphContainer apiClient={apiClient} />
    </TimeRangeContext.Provider>
  )
    .dive()
    .dive()
    .dive();

  // Let the API call resolve
  await tick();
  wrapper.update();

  const actualProps = wrapper.find(TranslatedClientsGraph).props();
  const expectedProps = transformData(fakeData, null);
  expect(actualProps).toEqual(expectedProps);
});

it("should render as loading if the API fails to return data", async () => {
  const context: TimeRangeContextType = {
    range: null,
    update: () => {}
  };
  const apiClient = ({
    getClientsGraph: () => Promise.reject({ error: {} })
  } as any) as ApiClient;

  const wrapper = shallow(
    <TimeRangeContext.Provider value={context}>
      <ClientsGraphContainer apiClient={apiClient} />
    </TimeRangeContext.Provider>
  )
    .dive()
    .dive()
    .dive();

  // Let the API call resolve
  await tick();
  wrapper.update();

  const actualProps = wrapper.find(TranslatedClientsGraph).props();
  expect(actualProps).toEqual(loadingProps);
});

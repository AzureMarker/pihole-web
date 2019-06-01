/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Upstream Servers / Forward Destinations Chart component
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import api from "../../util/api";
import GenericDoughnutChart from "./GenericDoughnutChart";
import { TimeRangeContext } from "../common/context/TimeRangeContext";

const UpstreamsChart = ({
  t,
  apiCall
}: WithTranslation & { apiCall: () => Promise<ApiUpstreams> }) => (
  <GenericDoughnutChart
    title={t("Queries Answered By Destination")}
    apiCall={apiCall}
    apiHandler={data =>
      data.upstreams.map(upstream => ({
        name: upstream.name,
        ip: upstream.ip,
        percent: (upstream.count * 100) / data.total_queries
      }))
    }
  />
);

export const UpstreamsChartContainer = (props: WithTranslation) => (
  <TimeRangeContext.Consumer>
    {context => (
      <UpstreamsChart
        {...props}
        apiCall={() =>
          context.range ? api.getUpstreamsDb(context.range) : api.getUpstreams()
        }
      />
    )}
  </TimeRangeContext.Consumer>
);

export default withTranslation("dashboard")(UpstreamsChartContainer);

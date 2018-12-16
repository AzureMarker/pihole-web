/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Upstream Servers / Forward Destinations Chart component
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from "react";
import { translate } from "react-i18next";
import api from "../../util/api";
import GenericDoughnutChart from "./GenericDoughnutChart";

const UpstreamsChart = ({ t }) => (
  <GenericDoughnutChart
    title={t("Queries Answered By Destination")}
    apiCall={api.getUpstreams}
    apiHandler={data =>
      data.upstreams.map(upstream => ({
        name: upstream.name,
        ip: upstream.ip,
        percent: (upstream.count * 100) / data.total_queries
      }))
    }
  />
);

export default translate("dashboard")(UpstreamsChart);

/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Query Types Chart component
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import { WithNamespaces, withNamespaces } from "react-i18next";
import api from "../../util/api";
import GenericDoughnutChart from "./GenericDoughnutChart";

const QueryTypesChart = ({ t }: WithNamespaces) => (
  <GenericDoughnutChart
    title={t("Query Types")}
    apiCall={api.getQueryTypes}
    apiHandler={data => {
      const total = data.reduce(
        (previous, current) => previous + current.count,
        0
      );

      return data.map(item => ({
        name: item.name,
        percent: total > 0 ? (item.count * 100) / total : 0
      }));
    }}
  />
);

export default withNamespaces("dashboard")(QueryTypesChart);

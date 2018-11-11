/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Query Types Chart component
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from "react";
import { translate } from "react-i18next";
import api from "../../util/api";
import GenericDoughnutChart from "./GenericDoughnutChart";

const QueryTypesChart = ({ t }) => (
  <GenericDoughnutChart title={t("Query Types")} apiCall={api.getQueryTypes} />
);

export default translate("dashboard")(QueryTypesChart);

/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Forward Destinations Chart component
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from "react";
import { translate } from "react-i18next";
import { api } from "../../utils";
import GenericDoughnutChart from "./GenericDoughnutChart";

const ForwardDestinationsChart = ({ t }) => (
  <GenericDoughnutChart
    title={t("Queries Answered By Destination")}
    apiCall={api.getForwardDestinations}/>
);

export default translate("dashboard")(ForwardDestinationsChart);

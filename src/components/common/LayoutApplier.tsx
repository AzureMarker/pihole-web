/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Apply the web interface layout preference
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import { PreferencesContext } from "./context";
import { WebLayout } from "../../util/api";

/**
 * Update the web interface layout
 *
 * @param layout The layout to update to
 */
const applyLayout = (layout: WebLayout) => {
  switch (layout) {
    case "boxed":
      document.body.classList.add("boxcontainer");
      document.body.classList.add("background-image");
      break;
    case "traditional":
      document.body.classList.remove("boxcontainer");
      document.body.classList.remove("background-image");
      break;
  }
};

export default () => (
  <PreferencesContext.Consumer>
    {({ settings }) => {
      applyLayout(settings.layout);

      // This is not a visual component, so nothing should be shown
      return null;
    }}
  </PreferencesContext.Consumer>
);

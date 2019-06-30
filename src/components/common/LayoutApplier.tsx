/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Apply the web interface layout preference
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import { connect } from "react-redux";
import { ReduxState } from "../../redux/state";

export interface LayoutApplierProps {
  layout: WebLayout;
}

/**
 * Apply the web interface layout. This component does not display anything, but
 * changes the classes on document.body to apply the layout.
 */
export const LayoutApplier = ({ layout }: LayoutApplierProps) => {
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

  // This is not a visual component, so nothing should be shown
  return null;
};

export const mapStateToProps = (state: ReduxState): LayoutApplierProps => ({
  layout: state.preferences.layout
});

export default connect(mapStateToProps)(LayoutApplier);

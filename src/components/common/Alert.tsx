/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Alert component
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { FunctionComponent } from "react";

export type AlertType = "info" | "success" | "danger";

export interface AlertProps {
  type: AlertType,
  onClick: () => void,
  message: string
}

const Alert: FunctionComponent<AlertProps> = (props: AlertProps) => {
  return (
    <div
      className={"alert alert-" + props.type + " alert-dismissible fade show"}
    >
      <button type="button" className="close" onClick={props.onClick}>
        &times;
      </button>
      {props.message}
    </div>
  );
};

Alert.defaultProps = {
  onClick: () => {}
};

export default Alert;

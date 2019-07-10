/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Alert component
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";

export type AlertType = "info" | "success" | "danger";

export interface AlertProps {
  type: AlertType;
  onClick: () => void;
  message: string;
  dismissible: boolean;
}

const Alert = (props: AlertProps) => {
  const dismissClass = props.dismissible ? "alert-dismissible" : "";

  return (
    <div className={`alert alert-${props.type} ${dismissClass} fade show`}>
      {props.dismissible ? (
        <button type="button" className="close" onClick={props.onClick}>
          &times;
        </button>
      ) : null}
      {props.message}
    </div>
  );
};

Alert.defaultProps = {
  onClick: () => {},
  dismissible: true
};

export default Alert;

/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Alert component
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from "react";
import PropTypes from "prop-types";

const Alert = props => {
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

Alert.propTypes = {
  message: PropTypes.node.isRequired,
  type: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default Alert;

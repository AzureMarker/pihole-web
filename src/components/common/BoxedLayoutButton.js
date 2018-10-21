/* Pi-hole: A black hole for Internet advertisements
*  (c) 2018 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Boxed layout button
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from "react";

const boxedLayoutToggle = () => {
  document.body.classList.toggle("boxcontainer");
  document.body.classList.toggle("background-image");
};

export default () => {
  return (
    <div className="container-toggler">
      <button
        className="container-toggler-button"
        title="BOXED_LAYOUT_TEST_BUTTON"
        type="button"
        onClick={boxedLayoutToggle}
      >
        <i className="fa fa-exchange" />
      </button>
    </div>
  );
};

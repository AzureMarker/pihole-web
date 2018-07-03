/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Settings :: Version - Card component
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

const VersionCard = props => (
  <div className="card border-0 bg-primary stat-mid-height-lock">
    <div className="card-block">
      <div className="card-icon">
         <i className={props.icon}/>
      </div>
    </div>
    <div className="card-img-overlay">
      <h3>{props.name}</h3>
      <pre>
        <br/>
        {props.t("Branch")}: {props.branch}<br/>
        {props.t("Hash")}:   {props.hash}<br/>
        {props.t("Tag")}:    {props.tag}<br/>
      </pre>
    </div>
  </div>
);

VersionCard.propTypes = {
  branch: PropTypes.string,
  hash: PropTypes.string,
  name: PropTypes.string,
  tag: PropTypes.string
};

export default translate(['settings'])(VersionCard);

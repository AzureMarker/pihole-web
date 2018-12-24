/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Domain List component
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import api from "../../util/api";
import { Button } from "reactstrap";

const DomainList = ({ domains, onRemove, t }) => {
  // Create a button to remove the domain
  const removeButton = item => (
    <Button
      color="danger"
      size="sm"
      className="pull-right"
      style={{ marginTop: "2px" }}
      onClick={() => onRemove(item)}
    >
      <span className="fa fa-trash-o" />
    </Button>
  );

  // Map a domain string to a list item
  const mapDomainsToListItems = domain => (
    <li key={domain} className="list-group-item">
      {api.loggedIn ? removeButton(domain) : null}
      <span
        style={{
          display: "table-cell",
          verticalAlign: "middle",
          height: "32px"
        }}
      >
        {domain}
      </span>
    </li>
  );

  let body;

  if (domains.length > 0) {
    body = domains.map(mapDomainsToListItems);
  } else {
    body = (
      <div className="alert alert-info" role="alert">
        {t("There are no domains in this list")}
      </div>
    );
  }

  return <ul className="list-group">{body}</ul>;
};

DomainList.propTypes = {
  domains: PropTypes.arrayOf(PropTypes.string),
  onRemove: PropTypes.func.isRequired
};

export default translate(["common", "lists"])(DomainList);

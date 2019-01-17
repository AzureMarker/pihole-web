/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  A Upstream DNS List Item
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from "react";
import PropTypes from "prop-types";
import { Button, ListGroupItem } from "reactstrap";

const DnsListItem = ({ address, onRemove }) => (
  <ListGroupItem>
    {address}
    <Button color="danger" size="sm" className="pull-right" onClick={onRemove}>
      <span className="far fa-trash-alt" />
    </Button>
  </ListGroupItem>
);

DnsListItem.propTypes = {
  address: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default DnsListItem;

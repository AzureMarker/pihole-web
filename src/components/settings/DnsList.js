/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * An Editable List of Upstream DNS Servers
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import PropTypes from "prop-types";
import { ListGroup } from "reactstrap";
import DnsListItem from "./DnsListItem";
import DnsListNewItem from "./DnsListNewItem";
import { isValidIpv4OptionalPort } from "../../util/validate";

/**
 * Check if an upstream address is unique and valid
 *
 * @param address the address to check
 * @param upstreams the list of current upstreams
 * @returns {boolean} if the upstream address is unique and valid
 */
export const isAddressValid = (address, upstreams) =>
  !upstreams.includes(address) && isValidIpv4OptionalPort(address);

const DnsList = ({ upstreams, onAdd, onRemove }) => (
  <ListGroup style={{ overflowY: "scroll", maxHeight: "350px" }}>
    {upstreams.map(upstream => (
      <DnsListItem
        key={upstream}
        onRemove={() => onRemove(upstream)}
        address={upstream}
      />
    ))}
    <DnsListNewItem
      onAdd={onAdd}
      isValid={address => isAddressValid(address, upstreams)}
      upstreams={upstreams}
    />
  </ListGroup>
);

DnsList.propTypes = {
  upstreams: PropTypes.arrayOf(PropTypes.string).isRequired,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default DnsList;

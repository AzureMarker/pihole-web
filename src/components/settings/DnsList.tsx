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
import { ListGroup } from "reactstrap";
import DnsListItem from "./DnsListItem";
import DnsListNewItem from "./DnsListNewItem";
import {
  isValidIpv4OptionalPort,
  isValidIpv6OptionalPort
} from "../../util/validate";

export interface DnsListProps {
  upstreams: Array<string>;
  onAdd: (upstream: string) => void;
  onRemove: (upstream: string) => void;
}

/**
 * Check if an upstream address is unique and valid
 *
 * @param address the address to check
 * @param upstreams the list of current upstreams
 * @returns {boolean} if the upstream address is unique and valid
 */
export const isAddressValid = (
  address: string,
  upstreams: Array<string>
): boolean => {
  return (
    !upstreams.includes(address) &&
    (isValidIpv4OptionalPort(address) || isValidIpv6OptionalPort(address))
  );
};

const DnsList = ({ upstreams, onAdd, onRemove }: DnsListProps) => (
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
      isValid={(address: string) => isAddressValid(address, upstreams)}
      upstreams={upstreams}
    />
  </ListGroup>
);

export default DnsList;

/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * A Upstream DNS List Item
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import { Button, ListGroupItem } from "reactstrap";

export interface DnsListItemProps {
  address: string;
  onRemove: () => void;
}

const DnsListItem = ({ address, onRemove }: DnsListItemProps) => (
  <ListGroupItem>
    {address}
    <Button color="danger" size="sm" className="float-right" onClick={onRemove}>
      <span className="far fa-trash-alt" />
    </Button>
  </ListGroupItem>
);

export default DnsListItem;

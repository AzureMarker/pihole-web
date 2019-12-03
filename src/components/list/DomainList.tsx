/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Domain List component
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import api from "../../util/api";
import { Button } from "reactstrap";
import Alert from "../common/Alert";

export interface DomainListProps extends WithTranslation {
  domains: Array<ApiDomainListItem>;
  onRemove: (domain: string) => void;
}

const DomainList = ({ domains, onRemove, t }: DomainListProps) => {
  // Create a button to remove the domain
  const removeButton = (item: string) => (
    <Button
      color="danger"
      size="sm"
      className="float-right"
      style={{ marginTop: "2px" }}
      onClick={() => onRemove(item)}
    >
      <span className="far fa-trash-alt" />
    </Button>
  );

  // Map a domain string to a list item
  const mapDomainsToListItems = (domain: ApiDomainListItem) => (
    <li key={domain.domain} className="list-group-item">
      {api.loggedIn ? removeButton(domain.domain) : null}
      <span className="d-table-cell align-middle" style={{ height: "32px" }}>
        {domain.domain}
      </span>
    </li>
  );

  let body;

  if (domains.length > 0) {
    body = domains.map(mapDomainsToListItems);
  } else {
    body = (
      <Alert
        type="info"
        message={t("There are no domains in this list")}
        dismissible={false}
      />
    );
  }

  return <ul className="list-group">{body}</ul>;
};

export default withTranslation(["common", "lists"])(DomainList);

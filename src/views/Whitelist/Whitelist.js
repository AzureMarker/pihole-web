import React from 'react';
import { api } from "../../utils";
import ListPage from "../../components/ListPage";

export default props => (
  <ListPage
    title="Whitelist"
    note={
      <div>
        <p>Note: Whitelisting a subdomain of a wildcard blocked domain is not possible.</p>
        <p>
          Some of the domains shown below are the ad list domains, which are automatically added in order to prevent
          ad lists being able to blacklist each other.
          See <a href="https://github.com/pi-hole/pi-hole/blob/master/adlists.default" target="_blank" rel="noopener noreferrer">here</a> for
          the default set of ad lists.
        </p>
      </div>
    }
    add={api.addWhitelist}
    remove={api.removeWhitelist}
    refresh={api.getWhitelist}
    {...props}/>
);

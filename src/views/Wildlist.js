import React from 'react';
import ListPage from "../components/ListPage";
import { api } from "../utils";

export default props => (
  <ListPage
    title="Blacklist (Wildcard)"
    note={(
      <p>
        Note: Only the domain and subdomains of the blocked domain will be blocked.
        You can not block in the regex sense.
      </p>
    )}
    add={api.addWildlist}
    remove={api.removeWildlist}
    refresh={api.getWildlist}
    {...props}/>
);

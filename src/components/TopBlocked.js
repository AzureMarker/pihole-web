/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Top Blocked component
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React from 'react';
import { translate } from 'react-i18next';
import { api } from '../utils';
import TopTable from './TopTable';

const TopBlocked = ({ t, ...props }) => (
  <TopTable
    {...props}
    title={t('Top Blocked Domains')}
    initialState={{
      total_blocked: 0,
      top_blocked: []
    }}
    headers={[
      t('Domain'),
      t('Hits'),
      t('Frequency')
    ]}
    emptyMessage={t('No Domains Found')}
    isEmpty={state => state.top_blocked.length === 0}
    apiCall={api.getTopBlocked}
    apiHandler={(self, res) => {
      self.setState({
        loading: false,
        total_blocked: res.blocked_queries,
        top_blocked: res.top_blocked
      });
    }}
    generateRows={state => {
      return state.top_blocked.map(item => {
        const percentage = item.count / state.total_blocked * 100;

        return (
          <tr key={item.domain}>
            <td>
              {item.domain}
            </td>
            <td>
              {item.count.toLocaleString()}
            </td>
            <td style={{ 'verticalAlign': 'middle' }}>
              <div className='progress'
                   title={
                     t('{{percent}}% of {{total}}', {
                       percent: percentage.toFixed(1),
                       total: state.total_blocked.toLocaleString()
                     })
                   }>
                <div className='progress-bar bg-warning' style={{ width: percentage + '%' }}/>
              </div>
            </td>
          </tr>
        );
      });
    }}/>
);

export default translate(['common', 'dashboard'])(TopBlocked);

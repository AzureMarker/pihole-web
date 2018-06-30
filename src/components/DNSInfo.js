/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Settings :: DHCP Information 
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Component} from 'react';
import { translate } from 'react-i18next';
import { api, makeCancelable } from '../utils';

class DNSInfo extends Component {
  state = {
        "conditional_forwarding": {
          "enabled": "---",
          "router_ip": "---",
          "domain": "---"
        },
        "options": {
          "fqdn_required": "---",
          "bogus_priv": "---",
          "dnssec": "---",
          "listening_type": "---",
        },
        "upstream_dns": [ "---" ]
    }

  constructor(props) {
    super(props);
    this.updateDNSInfo = this.updateDNSInfo.bind(this);
  }

  updateDNSInfo() {
    this.updateHandler = makeCancelable(api.getDNSInfo(), { repeat: this.updateDNSInfo, interval: 600000 });
    this.updateHandler.promise.then(res => {
      this.setState(res) 
    })
    .catch((err) => {
      if(!err.isCanceled) {
        this.setState({
          "upstream_dns": [ "-!-" ],
          "options": {
            "fqdn_required": "-!-",
            "bogus_priv": "-!-",
            "dnssec": "-!-",
            "listening_type": "-!-",
          },
          "conditional_forwarding": {
            "enabled": "-!-",
            "router_ip": "-!-",
            "domain": "-!-",
          }
        });
      }
    });
  }

  componentDidMount() {
    this.updateDNSInfo();
  }

  componentWillUnmount() {
    this.updateHandler.cancel();
  }

  render() {
    return (
      <div className="card border-0 bg-success stat-dbl-height-lock">
        <div className="card-body">
          <div className="card-icon">
            <i className="fa fa-binoculars fa-2x"/>
          </div>
        </div>
        <div className="card-img-overlay">
          <h3>DNS Information</h3>
          <div className="row">
            <div className="col-lg-4 col-sm-4 col-xs-4">
              <pre>
                <br/>
                Upstream DNS Servers:<br/>
                {this.state.upstream_dns.toString().replace(/,/g , "\n")}<br/>
                
              </pre>
            </div>
            <div className="col-lg-4 col-sm-4 col-xs-4">
              <pre>
                <br/>
                Interfaces listening on: {this.state.options.listening_type}<br/>
                Forward FQDNs only:      {this.state.options.fqdn_required.toString()} <br/>
                Private range privacy:   {this.state.options.bogus_priv.toString()}<br/>
                Use DNSSEC:              {this.state.options.dnssec.toString()}
              </pre>
            </div>
            <div className="col-lg-4 col-sm-4 col-xs-4">
              <pre>
                <br/>
                Conditional Forwarding<br/>
                Enabled:           {this.state.conditional_forwarding.enabled.toString()} <br/>
                Router IP:         {this.state.conditional_forwarding.router_ip.toString()}<br/>
                Local Domain Name: {this.state.conditional_forwarding.domain.toString()}<br/>
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default translate(['settings'])(DNSInfo);

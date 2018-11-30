/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  Web Interface
*  Settings :: DHCP
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */

import React, { Component } from "react";
import { translate } from "react-i18next";
import { ignoreCancel, makeCancelable } from "../../util";
import api from "../../util/api";
import DnsList from "./DnsList";
import { Button, Col, Form, FormGroup, Input, Label } from "reactstrap";

class DNSInfo extends Component {
  state = {
    upstream_dns: [],
    conditional_forwarding: {
      enabled: false,
      router_ip: "",
      domain: ""
    },
    options: {
      fqdn_required: false,
      bogus_priv: false,
      dnssec: false,
      listening_type: "single"
    }
  };

  constructor(props) {
    super(props);
    this.updateDNSInfo = this.updateDNSInfo.bind(this);
  }

  updateDNSInfo() {
    this.updateHandler = makeCancelable(api.getDNSInfo(), {
      repeat: this.updateDNSInfo,
      interval: 600000
    });
    this.updateHandler.promise
      .then(res => {
        this.setState(res);
      })
      .catch(ignoreCancel);
  }

  componentDidMount() {
    this.updateDNSInfo();
  }

  componentWillUnmount() {
    this.updateHandler.cancel();
  }

  handleUpstreamAdd = upstream => {
    this.setState({ upstream_dns: this.state.upstream_dns.concat(upstream) });
  };

  handleUpstreamRemove = upstream => {
    this.setState({
      upstream_dns: this.state.upstream_dns.filter(item => item !== upstream)
    });
  };

  render() {
    const { t } = this.props;

    return (
      <Form>
        <FormGroup row>
          <Col sm={6}>
            <h3>{t("Upstream DNS Servers")}</h3>
            <DnsList
              onAdd={this.handleUpstreamAdd}
              onRemove={this.handleUpstreamRemove}
              upstreams={this.state.upstream_dns}
            />
          </Col>
          <Col sm={6}>
            <h3>{t("Conditional Forwarding")}</h3>
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  checked={this.state.conditional_forwarding.enabled}
                  onChange={e =>
                    this.setState({
                      conditional_forwarding: {
                        ...this.state.conditional_forwarding,
                        enabled: e.target.checked
                      }
                    })
                  }
                />
                {t("Enabled")}
              </Label>
            </FormGroup>
            <FormGroup row>
              <Label for="routerIP" sm={5}>
                {t("Router IP")}
              </Label>
              <Col sm={7}>
                <Input
                  id="routerIP"
                  disabled={!this.state.conditional_forwarding.enabled}
                  value={this.state.conditional_forwarding.router_ip}
                  onChange={e =>
                    this.setState({
                      conditional_forwarding: {
                        ...this.state.conditional_forwarding,
                        router_ip: e.target.value
                      }
                    })
                  }
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="localDomain" sm={5}>
                {t("Local Domain Name")}
              </Label>
              <Col sm={7}>
                <Input
                  id="localDomain"
                  disabled={!this.state.conditional_forwarding.enabled}
                  value={this.state.conditional_forwarding.domain}
                  onChange={e =>
                    this.setState({
                      conditional_forwarding: {
                        ...this.state.conditional_forwarding,
                        domain: e.target.value
                      }
                    })
                  }
                />
              </Col>
            </FormGroup>
            <h3>{t("DNS Options")}</h3>
            <FormGroup row>
              <Label for="listeningBehavior" sm={5}>
                {t("Interface listening behavior")}
              </Label>
              <Col sm={7}>
                <Input
                  id="listeningBehavior"
                  type="select"
                  value={this.state.options.listening_type}
                  onChange={e =>
                    this.setState({
                      options: {
                        ...this.state.options,
                        listening_type: e.target.value
                      }
                    })
                  }
                >
                  <option>all</option>
                  <option>local</option>
                  <option>single</option>
                </Input>
              </Col>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  checked={this.state.options.fqdn_required}
                  onChange={e =>
                    this.setState({
                      options: {
                        ...this.state.options,
                        fqdn_required: e.target.checked
                      }
                    })
                  }
                />
                {t("Forward FQDNs only")}
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  checked={this.state.options.bogus_priv}
                  onChange={e =>
                    this.setState({
                      options: {
                        ...this.state.options,
                        bogus_priv: e.target.checked
                      }
                    })
                  }
                />
                {t("Only forward public reverse lookups")}
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  checked={this.state.options.dnssec}
                  onChange={e =>
                    this.setState({
                      options: {
                        ...this.state.options,
                        dnssec: e.target.checked
                      }
                    })
                  }
                />
                {t("Use DNSSEC")}
              </Label>
            </FormGroup>
          </Col>
        </FormGroup>
        <Button type="submit">{t("Apply")}</Button>
      </Form>
    );
  }
}

export default translate(["common", "settings"])(DNSInfo);

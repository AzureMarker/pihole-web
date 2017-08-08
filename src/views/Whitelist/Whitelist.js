import React, { Component } from 'react';
import DomainInput from "../../components/DomainInput";
import Alert from "../../components/Alert";
import { api, ignoreCancel, makeCancelable } from "../../utils";
import DomainList from "../../components/DomainList";

export default class Whitelist extends Component {
  state = {
    domains: [],
    infoMsg: "",
    successMsg: "",
    errorMsg: ""
  };

  constructor(props) {
    super(props);
    this.onAdd = this.onAdd.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }

  onAdd(domain) {
    if(domain.length > 0) {
      if(this.state.domains.includes(domain))
        this.setState({
          infoMsg: "",
          successMsg: "",
          errorMsg: domain + " is already added"
        });
      else {
        this.addHandler = makeCancelable(api.addWhitelist(domain));
        this.addHandler.promise.then(() => {
          this.setState(prevState => ({
            domains: [...prevState.domains, domain],
            infoMsg: "",
            successMsg: "Successfully added " + domain,
            errorMsg: ""
          }));
        }).catch(ignoreCancel);

        this.setState({ infoMsg: "Adding " + domain + " ..." });
      }
    }
  }

  onRemove(domain) {
    if(this.state.domains.includes(domain)) {
      const prevDomains = this.state.domains.slice();

      this.removeHandler = makeCancelable(api.removeWhitelist(domain));
      this.removeHandler.promise.catch(ignoreCancel).catch(() => {
        this.setState(prevState => ({
          domains: prevDomains,
          infoMsg: "",
          successMsg: "",
          errorMsg: "Failed to remove " + domain
        }));
      });

      this.setState(prevState => ({ domains: prevState.domains.filter(item => item !== domain) }));
    }
  }

  onRefresh() {
    this.refreshHandler = makeCancelable(api.getWhitelist());
    this.refreshHandler.promise.then(data => {
      this.setState({ domains: data.whitelist });
    }).catch(ignoreCancel);
  }

  componentDidMount() {
    this.onRefresh();
  }

  componentWillUnmount() {
    if(this.addHandler)
      this.addHandler.cancel();

    if(this.removeHandler)
      this.removeHandler.cancel();

    if(this.refreshHandler)
      this.refreshHandler.cancel();
  }

  render() {
    return (
      <div style={{ marginBottom: "24px" }}>
        <h2 className="text-center">Whitelist</h2>
        <br/>
        <DomainInput onAdd={this.onAdd} onRefresh={this.onRefresh}/>
        <p>Note: Whitelisting a subdomain of a wildcard blocked domain is not possible.</p>
        <p>
          Some of the domains shown below are the ad list domains, which are automatically added in order to prevent
          ad lists being able to blacklist each other.
          See <a href="https://github.com/pi-hole/pi-hole/blob/master/adlists.default" target="_blank" rel="noopener noreferrer">here</a> for
          the default set of ad lists.
        </p>
        {
          this.state.infoMsg
            ? <Alert message={this.state.infoMsg} type="info" onClick={() => this.setState({ infoMsg: "" })}/>
            : null
        }
        {
          this.state.successMsg
            ? <Alert message={this.state.successMsg} type="success" onClick={() => this.setState({ successMsg: "" })}/>
            : null
        }
        {
          this.state.errorMsg
            ? <Alert message={this.state.errorMsg} type="danger" onClick={() => this.setState({ errorMsg: "" })}/>
            : null
        }
        <DomainList domains={this.state.domains} onRemove={this.onRemove}/>
      </div>
    );
  }
}

import React, { Component } from 'react';
import DomainInput from "../../components/DomainInput";
import Alert from "../../components/Alert";

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
  }

  onAdd(domain) {
    if(domain.length > 0) {
      if(this.state.domains.includes(domain))
        this.setState({ errorMsg: "That domain is already added", successMsg: "", infoMsg: "" });
      else {
        this.setState(prevState => ({
          domains: [...prevState.domains, domain],
          successMsg: "Successfully added " + domain,
          infoMsg: "",
          errorMsg: ""
        }));
      }
    }
  }

  render() {
    return (
      <div>
        <DomainInput onAdd={this.onAdd} onRefresh={console.log}/>
        <p>Note: Whitelisting a subdomain of a wildcard blocked domain is not possible.</p>
        <p>
          Some of the domains shown below are the ad list domains, which are automatically added in order to prevent
          ad lists being able to blacklist each other.
          See <a href="https://github.com/pi-hole/pi-hole/blob/master/adlists.default" target="_blank" rel="noopener noreferrer">here</a> for
          the default set of ad lists.
        </p>
        {this.state.infoMsg ? Alert(this.state.infoMsg, "info", () => this.setState({ infoMsg: "" })) : null}
        {this.state.successMsg ? Alert(this.state.successMsg, "success", () => this.setState({ successMsg: "" })) : null}
        {this.state.errorMsg ? Alert(this.state.errorMsg, "danger", () => this.setState({ errorMsg: "" })) : null}
        <ul className="list-group">
          {
            this.state.domains.map(item => (
              <li key={item} className="list-group-item">
                <button className="btn btn-danger btn-sm pull-right" type="button">
                  <span className="fa fa-trash-o"/>
                </button>
                <span style={{display: "table-cell", verticalAlign: "middle", height: "32px"}}>
                  {item}
                </span>
              </li>
            ))
          }
        </ul>
      </div>
    );
  }
}

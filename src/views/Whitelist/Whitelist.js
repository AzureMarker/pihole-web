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
        this.setState({
          infoMsg: "",
          successMsg: "",
          errorMsg: domain + " is already added"
        });
      else {
        this.setState(prevState => ({
          domains: [...prevState.domains, domain],
          infoMsg: "",
          successMsg: "Successfully added " + domain,
          errorMsg: ""
        }));
      }
    }
  }

  onRemove(domain) {
    if(this.state.domains.includes(domain)) {
      //TODO: Run API call to remove domain
      this.setState(prevState => ({ domains: prevState.domains.filter(item => item !== domain) }));
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
        <ul className="list-group">
          {
            this.state.domains.map(item => (
              <li key={item} className="list-group-item">
                <button className="btn btn-danger btn-sm pull-right" type="button" onClick={() => this.onRemove(item)}>
                  <span className="fa fa-trash-o"/>
                </button>
                <span style={{ display: "table-cell", verticalAlign: "middle", height: "32px" }}>
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

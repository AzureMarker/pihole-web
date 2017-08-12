import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class DomainInput extends Component {
  state = {
    domain: ""
  };

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.onAdd = this.onAdd.bind(this);
  }

  handleChange(e) {
    this.setState({ domain: e.target.value });
  }

  onAdd() {
    this.props.onAdd(this.state.domain);
    this.setState({ domain: "" });
  }

  render() {
    return (
      <div className="form-group input-group">
        <input
          type="text" className="form-control" placeholder="Add a domain (example.com or sub.example.com)"
          value={this.state.domain} onKeyPress={(e) => e.charCode === 13 ? this.onAdd() : null}
          onChange={this.handleChange}
        />
        <span className="input-group-btn">
          <button onClick={this.onAdd} className="btn btn-secondary" type="button">
            Add
          </button>
          <button onClick={this.props.onRefresh} className="btn btn-secondary" type="button">
            <i className="fa fa-refresh"/>
          </button>
        </span>
      </div>
    );
  }
}

DomainInput.propTypes = {
  onAdd: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired
};

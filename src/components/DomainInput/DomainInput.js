import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class DomainInput extends Component {
  constructor(props) {
    super(props);
    this.onAdd = this.onAdd.bind(this);
  }

  onAdd() {
    this.props.onAdd(this.refs.input.value);
  }

  render() {
    return (
      <div className="form-group input-group">
        <input
          ref="input" type="text" className="form-control" onKeyPress={(e) => e.charCode === 13 ? this.onAdd() : null}
          placeholder="Add a domain (example.com or sub.example.com)"
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

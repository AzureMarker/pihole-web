import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class DomainList extends Component {
  render() {
    return (
      <ul className="list-group">
        {
          this.props.domains.map(item => (
            <li key={item} className="list-group-item">
              <button className="btn btn-danger btn-sm pull-right" type="button" onClick={() => this.props.onRemove(item)}>
                <span className="fa fa-trash-o"/>
              </button>
              <span style={{ display: "table-cell", verticalAlign: "middle", height: "32px" }}>
              {item}
            </span>
            </li>
          ))
        }
      </ul>
    );
  }
};

DomainList.propTypes = {
  domains: PropTypes.arrayOf(PropTypes.string).isRequired,
  onRemove: PropTypes.func.isRequired
};
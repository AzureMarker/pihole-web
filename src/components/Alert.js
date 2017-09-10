import React from 'react';
import PropTypes from 'prop-types';

const Alert = (props) => {
  return (
    <div className={"alert alert-" + props.type + " alert-dismissible fade show"}>
      <button type="button" className="close" onClick={props.onClick}>
        &times;
      </button>
      {props.message}
    </div>
  );
};

Alert.propTypes = {
  message: PropTypes.node.isRequired,
  type: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default Alert;

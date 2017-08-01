import React from 'react';

export default (message, type, onClick) => {
  return (
    <div className={"alert alert-" + type + " alert-dismissible fade show"}>
      <button type="button" className="close" onClick={onClick}>
        &times;
      </button>
      {message}
    </div>
  );
};

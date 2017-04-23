import React from 'react';

const ToolTip = props => (
  <div>
    <div
      style={{
        top: props.top,
        left: props.left,
        border: 'solid #666 0.1rem',
        position: 'fixed',
        backgroundColor: 'white',
        borderRadius: '0.4rem',
        padding: '0.4rem'
      }}
    >
      {props.children}
    </div>
  </div>
);

ToolTip.propTypes = {
  left: React.PropTypes.string,
  top: React.PropTypes.string,
  children: React.PropTypes.node
};

export default ToolTip;

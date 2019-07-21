import React from 'react';

import './Button.css';

export default function Button(props) {
  return (
    <div className="Button" onClick={props.action}>
      { props.children }
    </div>
  );
}

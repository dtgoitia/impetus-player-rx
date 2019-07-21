import React from 'react';

import './ProgressBar.css';
import { PLAYER_STEPS_PER_SECOND } from '../../constants';

export default function ProgressBar(props) {
  const style = {
    transition: `width ${1 / PLAYER_STEPS_PER_SECOND}s linear`,
    width: `${props.progress * 100}%`,
  }
  return (
    <div className="ProgressBar">
      <div style={style} className="ProgressBar-bar">
        &nbsp;
      </div>
    </div>
  );
}

import React from 'react';

import './ProgressBar.css';
import { PLAYER_STEPS_PER_SECOND } from '../../constants';
import { secondsToTime } from '../../utils';

export default function ProgressBar({progress, duration}) {
  const style = {
    transition: `width ${1 / PLAYER_STEPS_PER_SECOND}s linear`,
    width: `${progress * 100}%`,
  }
  const completed = secondsToTime(duration * progress);
  const remaining = secondsToTime(duration * (1 - progress));
  return (
    <div className="ProgressBar">
      <div style={style} className="ProgressBar-bar">
        &nbsp;
      </div>
      <div className="ProgressBar-completed">{ completed }</div>
      <div className="ProgressBar-remaining">-{ remaining }</div>
    </div>
  );
}

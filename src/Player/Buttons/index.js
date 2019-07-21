import React from 'react';

import Button from './Button';
import './Buttons.css';

export default function Buttons(props) {
  return (
    <div className="Buttons">
      <Button action={props.pause}>PAUSE</Button>
      <Button action={props.play}>PLAY</Button>
      <Button action={props.stop}>STOP</Button>
    </div>
  );
}

import React from 'react';

import Button from './Button';
import playerService from './../player-service';
import './Buttons.css';

export default class Buttons extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isPlaying: false };

    this.playerServiceSubscription = playerService
      .isPlaying$
      .subscribe(isPlaying => {
        this.setState({ isPlaying });
      });
  }

  componentWillUnmount() {
    this.playerServiceSubscription.unsubscribe();
  }

  render() {
    const playPauseButton = this.state.isPlaying
      ? <Button action={this.props.pause}>PAUSE</Button>
      : <Button action={this.props.play}>PLAY</Button>;

    return (
      <div className="Buttons">
        { playPauseButton }
        <Button action={this.props.stop}>STOP</Button>
        <Button action={this.props.restart}>RESTART TASK</Button>
      </div>
    );
  }
}
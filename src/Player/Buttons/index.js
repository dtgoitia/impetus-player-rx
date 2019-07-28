import React from 'react';

import Button from './Button';
import playerService from './../player-service';
import SpeechService from '../../services/speech-service';
import './Buttons.css';
import BeepService from '../../services/beep-service';

export default class Buttons extends React.Component {
  componentWillMount() {
    const stateSubscription = playerService.state$.subscribe(newState => {
      this.setState({ ...newState });
    });

    const isPlayingSubscription = playerService.isPlaying$.subscribe(isPlaying => {
      this.setState({ isPlaying });
    });

    this.subscription = [
      stateSubscription,
      isPlayingSubscription,
    ]
  }

  cleanUpSubscriptions() {
    this.subscription.forEach(subscription => {
      if (!!subscription && !subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }

  componentWillUnmount() {
    this.cleanUpSubscriptions();
  }

  testBeep() {
    BeepService.countDown(2);
  }

  testSpeak() {
    SpeechService.countDown(3, 'go!');
  }

  render() {
    const playPauseButton = this.state.isPlaying
      ? <Button action={this.props.pause}>PAUSE</Button>
      : <Button action={this.props.play}>PLAY</Button>;

    const stopButton = this.state.endReached
      ? <Button action={this.props.stop}>RESTART PRESET</Button>
      : <Button action={this.props.stop}>STOP</Button>;

    const restartTaskButton = this.state.endReached
      ? null
      : <Button action={this.props.restart}>RESTART TASK</Button>;

    return (
      <React.Fragment>
        <div className="Buttons">
          { this.props.endReached ? null : playPauseButton }
          { stopButton }
          { restartTaskButton }
        </div>
        <div className="Buttons">
          <Button action={this.props.previous}>PREVIOUS</Button>
          <Button action={this.props.next}>NEXT</Button>
          <Button action={this.testSpeak.bind(this)}>3, 2, 1... GO!</Button>
          <Button action={this.testBeep.bind(this)}>BEEP</Button>
        </div>
      </React.Fragment>
    );
  }
}

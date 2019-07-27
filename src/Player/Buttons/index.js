import React from 'react';

import Button from './Button';
import playerService from './../player-service';
import './Buttons.css';

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

  render() {
    const playPauseButton = this.state.isPlaying
      ? <Button action={this.props.pause}>PAUSE</Button>
      : <Button action={this.props.play}>PLAY</Button>;

    return (
      <div className="Buttons">
        { this.props.endReached ? null : playPauseButton }
        <Button action={this.props.stop}>STOP</Button>
        <Button action={this.props.restart}>RESTART TASK</Button>
        <Button action={this.props.previous}>PREVIOUS</Button>
        <Button action={this.props.next}>NEXT</Button>
      </div>
    );
  }
}
import React from 'react';

import { secondsToTime } from './../utils';
import Buttons from './Buttons';
import playerService from './player-service';
import ProgressBar from './ProgressBar';
import TaskLog from './TaskLog';
import './Player.css';

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.service = playerService;
  }

  componentWillMount() {
    this.subscription = this.service.state$.subscribe(newState => {
      this.setState({ ...newState });
    });
  }

  componentWillUnmount() {
    this.cleanUpSubscription();
  }

  render() {
    const formattedTime = secondsToTime(this.state.currentTime);
    const presetProgress = this.state.currentTime / this.state.presetDuration;
    const currentProgress = (this.state.currentTime - this.state.currentTask.start) / this.state.currentTask.duration;

    return (
      <div className="Player">
        <ProgressBar
          progress={currentProgress}
          duration={this.state.currentTask.duration} />

        <div className="current-task">
          { this.state.currentTask.name }
        </div>

        <div className="current-time">
          { formattedTime }
        </div>

        <div className="next-task">
          Next: {
            this.state.nextTask === null
              ? 'none'
              : this.state.nextTask.name
          }
        </div>

        <ProgressBar
          progress={presetProgress}
          duration={this.state.presetDuration} />

        <Buttons
          endReached={this.state.endReached}
          pause={this.pause.bind(this)}
          play={this.play.bind(this)}
          stop={this.stop.bind(this)}
          restart={this.restartTask.bind(this)}
          previous={this.previous.bind(this)}
          next={this.next.bind(this)} />
        
        <TaskLog tasks={this.state.completedTasks} />
      </div>
    );
  }

  cleanUpSubscription() {
    if (!!this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  next() {
    this.service.next();
  }

  pause() {
    this.service.pause();
  }

  play() {
    this.service.play();
  }

  previous() {
    this.service.previous();
  }

  resetPlayer() {
    this.service.resetPlayer();
  }

  restartTask() {
    this.service.restartTask();
  }

  stop() {
    this.pause();
    this.resetPlayer();
  }
}

export default Player;

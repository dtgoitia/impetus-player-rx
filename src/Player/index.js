import React from 'react';

import { secondsToTime } from './../utils';
import Buttons from './Buttons';
import playerService from './player-service';
import ProgressBar from './ProgressBar';
import TaskLog from './TaskLog';
import './Player.css';

class Player extends React.Component {
  componentWillMount() {
    this.subscription = playerService.state$.subscribe(newState => {
      this.setState({ ...newState });
    });
  }

  componentWillUnmount() {
    this.cleanUpSubscription();
  }

  render() {
    const remainingTaskTime = this.state.currentTask.end
      - (this.state.currentTime < this.state.currentTask.start
          ? this.state.currentTask.start
          : this.state.currentTime
    );
    const remainingTaskTimeFormatted = secondsToTime(remainingTaskTime, true);
    const presetProgress = this.state.currentTime / this.state.presetDuration;
    const currentProgress = (this.state.currentTime - this.state.currentTask.start) / this.state.currentTask.duration;
    const nextTaskDescription = this.state.nextTask === null
      ? 'none'
      : `${this.state.nextTask.name} (${secondsToTime(this.state.nextTask.duration, true)})`

    return (
      <div className="Player">
        <ProgressBar
          progress={currentProgress}
          duration={this.state.currentTask.duration} />

        <div className="current-task">
          { this.state.currentTask.name }
        </div>

        <div className="current-time">
          { remainingTaskTimeFormatted }
        </div>

        <div className="next-task">
          Next: { nextTaskDescription }
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
    playerService.next();
  }

  pause() {
    playerService.pause();
  }

  play() {
    playerService.play();
  }

  previous() {
    playerService.previous();
  }

  resetPlayer() {
    playerService.resetPlayer();
  }

  restartTask() {
    playerService.restartTask();
  }

  stop() {
    this.pause();
    this.resetPlayer();
  }
}

export default Player;

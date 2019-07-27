import React from 'react';

import { secondsToTime } from './../utils';
import Buttons from './Buttons';
import { playerService } from './player-service';
import ProgressBar from './ProgressBar';
import TaskLog from './TaskLog';
import './Player.css';

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.service = playerService;
    this.state = {
      tasks: this.service.task,
      completedTasks: [],
      currentTask: this.service.currentTask,
      currentTime: 0,
      presetDuration: this.service.presetDuration,
      endReached: false,
      nextTask: this.service.nextTask,
    }
  }

  componentWillUnmount() {
    this.cleanUpSubscription();
  }

  render() {
    const formattedTime = secondsToTime(this.state.currentTime);
    const progress = this.state.currentTime / this.state.presetDuration;

    return (
      <div className="Player">
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

        <ProgressBar progress={progress} />

        <Buttons
          pause={this.pause.bind(this)}
          play={this.play.bind(this)}
          stop={this.stop.bind(this)}
          restart={this.restartTask.bind(this)} />
        
        <TaskLog tasks={this.state.completedTasks} />
      </div>
    );
  }

  cleanUpSubscription() {
    if (!!this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  play() {
    this.service.play();
    this.subscription = this.service
      .timerState$
      .subscribe(state => {
        if (state) {
          this.setState({
            currentTime: state.time,
            currentTask: state.currentTask,
            nextTask: state.nextTask,
            completedTasks: state.completedTasks,
          });
        }
      });
  }

  pause() {
    this.service.pause();
  }

  resetPlayer() {
    this.service.resetPlayer();
    this.setState({
      currentTime: 0,
      currentTask: this.service.currentTask,
      nextTask: this.service.nextTask,
    });
  }

  restartTask() {
    this.service.restartTask();
    this.setState({
      currentTime: this.service.currentTask.start
    });
  }

  stop() {
    this.pause();
    this.resetPlayer();
  }
}

export default Player;

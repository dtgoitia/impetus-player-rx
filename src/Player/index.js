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
        } else {
          this.setState({ endReached: true });
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
      endReached: this.service.endReached,
    });
  }

  restartTask() {
    this.service.restartTask();
    this.setState({
      currentTime: this.service.currentTask.start,
      endReached: this.service.endReached,
    });
  }

  stop() {
    this.pause();
    this.resetPlayer();
  }
}

export default Player;

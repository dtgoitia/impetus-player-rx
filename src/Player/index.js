import React from 'react';

import { timer } from 'rxjs';
import { map } from 'rxjs/operators';

import { calculateDuration, getTask, getNextTask, secondsToTime } from './../utils';
import Buttons from './Buttons';
import ProgressBar from './ProgressBar';
import TaskLog from './TaskLog';
import { SAMPLE_PRESET, PLAYER_STEPS_PER_SECOND, MILLISECONDS_PER_SECOND } from './../constants';
import './Player.css';

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      completedTasks: [],
      currentTask: getTask(SAMPLE_PRESET, 0),
      currentTime: 0,
      duration: calculateDuration(SAMPLE_PRESET),
      endReached: false,
      nextTask: getNextTask(SAMPLE_PRESET, 0),
    }
  }

  componentWillUnmount() {
    this.cleanUpSubscriptions();
  }

  render() {
    const formattedTime = secondsToTime(this.state.currentTime);
    const progress = this.state.currentTime / this.state.duration;

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
          stop={this.stop.bind(this)} />
        
        <TaskLog tasks={this.state.completedTasks} />
      </div>
    );
  }

  play() {
    if (this.state.endReached) {
      this.setState({ endReached: false });
    }

    this.subscription = this.createTimerFrom(this.state.currentTime)
      .subscribe(time => {
        const lastTask = this.state.currentTask;
        const currentTask = getTask(SAMPLE_PRESET, time);
        const nextTask = getNextTask(SAMPLE_PRESET, time);
        const completedTasks = this.state.completedTasks;

        if (this.isTaskCompleted(lastTask, currentTask)) {  // TODO: think of a valid condition...
          completedTasks.push(lastTask);
        }

        if (currentTask === null) {
          // stop timer when there are no more tasks
          this.cleanUpSubscriptions();
          this.setState({ endReached: true });
          return;
        }

        this.setState({
          currentTime: time,
          currentTask,
          nextTask,
          completedTasks,
        });
      });
  }

  createTimerFrom(startTime) {
    const millisecondsPerStep = MILLISECONDS_PER_SECOND / PLAYER_STEPS_PER_SECOND;

    return timer(0, millisecondsPerStep)
      .pipe(
        map(stepIndex => startTime + stepIndex / PLAYER_STEPS_PER_SECOND),
      );
  }

  cleanUpSubscriptions() {
    if (!!this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  pause() {
    this.cleanUpSubscriptions();
  }

  resetPlayer() {
    this.setState({
      currentTime: 0,
      currentTask: getTask(SAMPLE_PRESET, 0),
      nextTask: getNextTask(SAMPLE_PRESET, 0),
    });
  }

  stop() {
    this.cleanUpSubscriptions();
    this.resetPlayer();
  }

  isTaskCompleted(lastTask, currentTask) {
    return (lastTask !== null && currentTask == null)
      || (lastTask.name !== currentTask.name);
  }
}

export default Player;

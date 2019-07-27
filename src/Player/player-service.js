import { getTaskByTime, calculateDuration, getNextTaskByTime } from "../utils";
import { MILLISECONDS_PER_SECOND, PLAYER_STEPS_PER_SECOND, SAMPLE_PRESET } from "../constants";

import { timer, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';

function tasksAreValid(tasks) {
  return true;  // TODO: implement
}

function inflateTasks(rawTasks) {
  let lastTime = 0;
  return rawTasks
    .map(task => {
      const start = lastTime;
      const end = lastTime + task.duration;
      lastTime = end;
      return { ...task, start, end };
    });
}

function isTaskCompleted(lastTask, currentTask) {
  return (lastTask !== null && currentTask == null)
    || (lastTask.name !== currentTask.name);
}

function createTimerFrom(startTime, scheduler) {
  const millisecondsPerStep = MILLISECONDS_PER_SECOND / PLAYER_STEPS_PER_SECOND;

  return timer(0, millisecondsPerStep, scheduler)
    .pipe(
      tap(stepIndex => {
        console.log(stepIndex);
      }),
      map(stepIndex => startTime + stepIndex / PLAYER_STEPS_PER_SECOND),
    );
}

class PlayerService {
  completedTasks = [];
  currentTask = null;
  currentTime = 0;
  endReached = false;
  nextTask = null;
  playing = false;
  presetDuration;
  tasks = [];

  _timer;

  constructor(rawTasks, timer$) {
    if (!tasksAreValid(rawTasks)) {
      throw TypeError('Tasks are not valid');
    }

    this._timer = timer;

    this._stopTimer$ = new Subject();
    this.stopTimer$ = this._stopTimer$.asObservable();
    this._stopTimer$.subscribe(() => {
      this._isPlaying$.next(false);
    });

    this._isPlaying$ = new Subject();
    this.isPlaying$ = this._isPlaying$.asObservable();
    this._isPlaying$.subscribe(isPlaying => {
      this.playing = isPlaying;
    });
    
    this.tasks = inflateTasks(rawTasks);
    this.presetDuration = calculateDuration(this.tasks);
    this.resetPlayer();
  }

  pause() {
    this._stopTimer$.next();
  }

  play() {
    this._isPlaying$.next(true);
    if (this.endReached) {
      // TODO: add test. I think this is to start playing from the beginning
      // once the preset has finished
      this.endReached = false;
    }

    const timer$ = this._timer$
      ? this._timer$
      : createTimerFrom(this.currentTime);

    this.timerState$ = timer$
      .pipe(
        map(time => {
          const currentTask = getTaskByTime(this.tasks, time);
          if (currentTask) {
            return { time, currentTask };
          }
          this.endReached = true;
          return null;
        }),
        map(data => {
          if (data === null) return null;
          const { time, currentTask } = data;
          const lastTask = this.currentTask;
          const nextTask = getNextTaskByTime(this.tasks, time);
          const previouslyCompletedTasks = this.completedTasks;

          const completedTasks = isTaskCompleted(lastTask, currentTask)
            ? [...previouslyCompletedTasks, lastTask]
            : previouslyCompletedTasks;

          return {
            time,
            currentTask,
            nextTask,
            completedTasks,
          };
        }),
        tap(data => {
          if (!data) return;
          this.currentTime = data.time;
          this.currentTask = data.currentTask;
          this.completedTasks = data.completedTasks;
        }),
        takeUntil(this._stopTimer$),
      );
  }

  resetPlayer() {
    this._stopTimer$.next();
    this.currentTime = 0;
    this.currentTask = getTaskByTime(this.tasks, 0);
    this.nextTask = getNextTaskByTime(this.tasks, 0);
  }

  restartTask() {
    this.pause();
    this.currentTime = this.currentTask.start;
  }
}

const playerService = new PlayerService(SAMPLE_PRESET);

export {
  PlayerService,
  playerService,
};

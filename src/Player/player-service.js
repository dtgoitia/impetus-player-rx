import {
  getTaskByTime,
  calculateDuration,
  getNextTaskByTime,
  isTaskCompleted
} from "../utils";
import {
  MILLISECONDS_PER_SECOND,
  PLAYER_STEPS_PER_SECOND,
  SAMPLE_PRESET
} from "../constants";

import { timer, Subject, BehaviorSubject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

function tasksAreValid(tasks) {
  return true;  // TODO: implement
}

function inflateTasks(rawTasks) {
  let lastTime = 0;
  return rawTasks
    .map((task, i) => {
      const start = lastTime;
      const end = lastTime + task.duration;
      lastTime = end;
      return { id: i, ...task, start, end };
    });
}

function createTimerFrom(startTime) {
  const millisecondsPerStep = MILLISECONDS_PER_SECOND / PLAYER_STEPS_PER_SECOND;

  return timer(0, millisecondsPerStep)
    .pipe(
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
  // presetDuration;
  tasks = [];
  constructor(rawTasks) {
    if (!tasksAreValid(rawTasks)) {
      throw TypeError('Tasks are not valid');
    }

    this._isPlaying$ = new Subject();

    this._killTimer$ = new Subject();
    this._killTimer$.subscribe(() => {
      this.cleanUpSubscription();
      this._isPlaying$.next(false);
    });

    const tasks = inflateTasks(rawTasks);
    const presetDuration = calculateDuration(tasks);
    const currentTask = getTaskByTime(tasks, 0);
    const nextTask = getNextTaskByTime(tasks, 0);
    const initialState = {
      tasks,
      presetDuration,
      currentTime: 0,
      currentTask,
      nextTask,
      completedTasks: [],
      endReached: false,
    };
    this._state$ = new BehaviorSubject(initialState);
    this._state$.subscribe(state => {
      this.state = state;
    });
  }

  get isPlaying$() { return this._isPlaying$.asObservable(); }

  get state$() { return this._state$.asObservable(); }

  cleanUpSubscription() {
    if (!!this._subscription && !this._subscription.closed) {
      this._subscription.unsubscribe();
    }
  }

  next() {
    this._jumpToTaskByIndex(this.state.currentTask.id + 1);
  }

  pause() {
    this._killTimer();
  }

  play() {
    this._isPlaying$.next(true);
    if (this.endReached) {
      // TODO: add test. I think this is to start playing from the beginning
      // once the preset has finished
      this.endReached = false;
    }

    const timer$ = createTimerFrom(this.state.currentTime)
    this._subscription = timer$
      .pipe(takeUntil(this._killTimer$))
      .subscribe(time => {
        const oldState = this.state;

        // TODO: stick this in a function =============================
        // function reduceNewState(time, oldState) { }
        const lastTask = oldState.currentTask;
        const previouslyCompletedTasks = oldState.completedTasks;
        const currentTask = getTaskByTime(oldState.tasks, time);
        const nextTask = getNextTaskByTime(oldState.tasks, time);
        const completedTasks = isTaskCompleted(lastTask, currentTask)
          ? [...previouslyCompletedTasks, lastTask]
          : previouslyCompletedTasks;
        const endReached = currentTask === null
          ? true
          : false;
        
        const newState = endReached
          ? {
              ...oldState,
              completedTasks,
              endReached,
            }
          : {
              ...oldState,
              currentTime: time,
              currentTask,
              nextTask,
              completedTasks,
              endReached,
            };
        // TODO: stick this in a function =============================

        this._state$.next(newState);
        if (newState.endReached) {
          this._killTimer();
        }
      });

    this._state$.subscribe(newState => {
      this.currentTask = newState.currentTask;
      this.currentTime = newState.time;
      this.nextTask = newState.nextTask;
      this.completedTasks = newState.completedTasks;
      this.endReached = newState.endReached;
    })
  }

  previous() {
    let targetIndex = this.state.currentTask.id - 1;
    if (this.state.endReached) {
      targetIndex++;
    }
    if (this.state.currentTask.id === 0) {
      targetIndex = 0;
    }
    this._jumpToTaskByIndex(targetIndex);
  }

  resetPlayer() {
    this.pause();
    this._setCurrentTaskByIndex(0);
  }

  restartTask() {
    this.pause();
    this._setCurrentTaskByIndex(this.state.currentTask.id);
  }

  _jumpToTaskByIndex(index) {
    this.pause();
    this._setCurrentTaskByIndex(index);
  }

  _killTimer() {
    this._killTimer$.next();
  }

  _setCurrentTaskByIndex(index) {
    const tasks = this.state.tasks;
    const task = tasks[index];
    const lastTask = tasks[tasks.length - 1];
    const newState = {
      ...this.state,
      currentTask: task
        ? task
        : lastTask,
      currentTime: task
        ? task.start
        : lastTask.end,
      endReached: task
        ? false
        : true,
    };
    
    const nextTask = tasks[index + 1];
    if (nextTask === undefined) {
      newState.nextTask = null;
    } else {
      newState.nextTask = nextTask;
    }

    this._state$.next(newState);
  }
}

const playerService = new PlayerService(SAMPLE_PRESET);

export default playerService;
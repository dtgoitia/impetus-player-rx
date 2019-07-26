import { getTaskIndex, getNextTask, secondsToTime } from './index.js';
import { SAMPLE_PRESET } from '../constants.js';

xdescribe('utils', () => {
  const tasks = SAMPLE_PRESET;

  describe(getTaskIndex.name, () => {
    const lastTaskIndex = tasks.length - 1;
    const lastTask = tasks[lastTaskIndex];
    const lastTaskEndTime = lastTask.start + lastTask.duration;

    it('should return the first task on start', () => {
      expect(getTaskIndex(tasks, 0)).toEqual(0);
    });

    it('should return the index of the task that starts at any given time', () => {
      expect(getTaskIndex(tasks, tasks[0].start)).toEqual(0);
      expect(getTaskIndex(tasks, tasks[1].start)).toEqual(1);
      expect(getTaskIndex(tasks, tasks[2].start)).toEqual(2);
    });

    it('should return the index of the last task when time matches last task end time', () => {
      expect(getTaskIndex(tasks, lastTaskEndTime)).toEqual(lastTaskIndex);
    });

    it('should return the null when the time exceeds the time covered by the tasks', () => {
      expect(getTaskIndex(tasks, lastTaskEndTime + 1)).toEqual(null);
    });

    it('should return the correct index at any given time', () => {
      expect(getTaskIndex(tasks, 0)).toEqual(0);
      expect(getTaskIndex(tasks, 1)).toEqual(0);
      expect(getTaskIndex(tasks, 2)).toEqual(0);
      expect(getTaskIndex(tasks, 3)).toEqual(1);
      expect(getTaskIndex(tasks, 4)).toEqual(1);
      expect(getTaskIndex(tasks, 5)).toEqual(1);
      expect(getTaskIndex(tasks, 6)).toEqual(1);
      expect(getTaskIndex(tasks, 7)).toEqual(1);
      expect(getTaskIndex(tasks, 8)).toEqual(2);
      expect(getTaskIndex(tasks, 9)).toEqual(2);
      expect(getTaskIndex(tasks, 10)).toEqual(2);
      expect(getTaskIndex(tasks, 11)).toEqual(null);
    });
  });

  describe(getNextTask.name, () => {
    it('should return next task index if it exists', () => {
      expect(getNextTask(tasks, 0)).toEqual(tasks[1]);
      expect(getNextTask(tasks, 1)).toEqual(tasks[1]);
      expect(getNextTask(tasks, 2)).toEqual(tasks[1]);
      expect(getNextTask(tasks, 3)).toEqual(tasks[2]);
      expect(getNextTask(tasks, 4)).toEqual(tasks[2]);
      expect(getNextTask(tasks, 5)).toEqual(tasks[2]);
      expect(getNextTask(tasks, 6)).toEqual(tasks[2]);
      expect(getNextTask(tasks, 7)).toEqual(tasks[2]);
    });
    
    it('should return null if next task does not exist', () => {
      expect(getNextTask(tasks, 8)).toEqual(null);
      expect(getNextTask(tasks, 9)).toEqual(null);
      expect(getNextTask(tasks, 10)).toEqual(null);
      expect(getNextTask(tasks, 11)).toEqual(null);
    });
  });

  describe(secondsToTime.name, () => {
    it('should format times over 1h', () => {
      const timeLongerThanHour = 3601;
      expect(secondsToTime(timeLongerThanHour)).toEqual("01:00:01");
    });

    it('should format times under 1h', () => {
      const timeShorterThanHour = 131;
      expect(secondsToTime(timeShorterThanHour)).toEqual("02:11");
    });

    it('should format times with below-second precision', () => {
      const timeWithSecondFractions = 3.7;
      expect(secondsToTime(timeWithSecondFractions)).toEqual("00:03");
    });
  });
});

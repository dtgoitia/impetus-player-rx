const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_MINUTE = 60;

export function calculateDuration(tasks) {
  return tasks
    .map(task => task.duration)
    .reduce((accumulator, value) => accumulator + value);
}

export function getTaskIndex(tasks, time) {
  if (time === 0) {
    return 0;
  }

  for (let index = 0; index < tasks.length; index++) {
    const task = tasks[index];
    const end = task.start + task.duration;

    if (task.start <= time && time < end) {
      return index;
    };

    if (index === tasks.length - 1 && time === end) {
      return tasks.length - 1;
    }
  }

  return null;
}


export function getTaskByTime(tasks, time) {
  if (time === 0) {
    return tasks[0];
  }

  const currentTaskIndex = getTaskIndex(tasks, time);
  return currentTaskIndex !== null
    ? tasks[currentTaskIndex]
    : null;
}

export function getNextTaskByTime(tasks, time) {
  if (tasks.length <= 1) {
    return null;
  }

  const lastIndex = tasks.length - 1;
  const taskIndex = getTaskIndex(tasks, time);

  if (taskIndex === null) {
    return null;
  }

  if (taskIndex < lastIndex) {
    return tasks[taskIndex + 1];
  }

  return null;
}

export function secondsToTime(totalSeconds) {
  const pad = number => `0${number}`.slice(-2);
  let secondsLeft = totalSeconds;

  const hours = Math.floor(secondsLeft / SECONDS_PER_HOUR);
  secondsLeft = secondsLeft - hours * SECONDS_PER_HOUR;

  const minutes = Math.floor(secondsLeft / SECONDS_PER_MINUTE);
  secondsLeft = secondsLeft - minutes * SECONDS_PER_MINUTE;

  const seconds = Math.floor(secondsLeft);
  
  return hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;
}

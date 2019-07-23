import React from 'react';

import './TaskLog.css';

const createTask = ({duration, name}) => {
  return (
    <li className="task">
      <div className="duration">{ duration }</div>
      <div className="name">{ name }</div>
    </li>
  );
};

export default function TaskLog({tasks}) {
  return (
    <ul className="TaskLog">
      { tasks.map(createTask) }
    </ul>
  );
}

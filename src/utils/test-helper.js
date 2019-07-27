import { TEMPLATE_INFLATED_TASK } from "../constants";

function createTask({
  name = TEMPLATE_INFLATED_TASK.name,
  duration = TEMPLATE_INFLATED_TASK.duration,
  start = TEMPLATE_INFLATED_TASK.start,
  end = TEMPLATE_INFLATED_TASK.end,
}) {
  return { name, duration, start, end };
} 

const TestHelper = {
  createTask,
};

export default TestHelper;


const sleep = (waitTimeInMs) => new Promise((resolve) => setTimeout(resolve, waitTimeInMs));

const TaskUtils = {
  sleep,
};

export default TaskUtils;

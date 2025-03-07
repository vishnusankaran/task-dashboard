import * as React from "react";

import type { Task, TaskArray } from "@/types";

type TaskContextType = {
  tasks: TaskArray;
  fetchTasks: () => void;
  result: object;
  activeTask: Task | null;
  setActiveTask: React.Dispatch<React.SetStateAction<Task | null>>;
};

export const TaskContext = React.createContext<TaskContextType>({
  tasks: [],
  fetchTasks: () => {},
  result: {},
  activeTask: null,
  setActiveTask: () => {},
});

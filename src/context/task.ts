import * as React from "react";

import type { Task, TaskArray } from "@/types";

type result = {
  fetching?: boolean;
  error?: string;
  data?: object | object[];
};

type TaskContextType = {
  tasks: TaskArray;
  fetchTasks: (options?: object) => void;
  result: result;
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

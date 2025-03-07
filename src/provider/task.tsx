import * as React from "react";
import { useQuery } from "urql";
import { TaskContext } from "@/context/task";
import { UserContext } from "@/context/user";
import { getAllTasks } from "@/queries/tasks";
import type { Task, TaskArray } from "@/types";

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [user] = React.useContext(UserContext);
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);
  const [tasks, setTasks] = React.useState<TaskArray>([]);
  const [result, fetchTasks] = useQuery({
    query: getAllTasks,
    pause: true,
  });

  React.useEffect(() => {
    const updatedTasks = result?.data?.task?.map(
      ({ id, title, description, dueDate, status }: Task) => ({
        id,
        title,
        description,
        status,
        dueDate: new Date(dueDate),
        user,
      }),
    );
    setTasks(updatedTasks ?? []);
  }, [result, setTasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        fetchTasks,
        result: { fetching: result.fetching, error: result.error },
        activeTask,
        setActiveTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

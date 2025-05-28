"use client";

import * as React from "react";
import { TaskContext } from "@/context/task";
import type { Task } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Assuming Badge is wanted
import { format } from "date-fns"; // Assuming date formatting is wanted

export function EisenhowerMatrix() {
  const { tasks, fetchTasks, result } = React.useContext(TaskContext);

  React.useEffect(() => {
     if (!tasks.length && !result.fetching) { // Only fetch if tasks are not loaded and not already fetching
        fetchTasks();
     }
  }, [fetchTasks, tasks.length, result.fetching]);

  if (result?.fetching && !tasks.length) return <p className="text-center p-4">Loading tasks...</p>;
  if (result?.error) return <p className="text-center p-4 text-red-500">Error loading tasks: {result?.error?.message}</p>;
  if (!tasks.length) return <p className="text-center p-4">No tasks available to display.</p>;

  const urgentImportant: Task[] = [];
  const notUrgentImportant: Task[] = [];
  const urgentNotImportant: Task[] = [];
  const notUrgentNotImportant: Task[] = [];

  tasks.forEach(task => {
    // Ensure boolean values for importance and urgency
    const isUrgent = !!task.urgency;
    const isImportant = !!task.importance;

    if (isUrgent && isImportant) {
      urgentImportant.push(task);
    } else if (!isUrgent && isImportant) {
      notUrgentImportant.push(task);
    } else if (isUrgent && !isImportant) {
      urgentNotImportant.push(task);
    } else { // Not Urgent & Not Important
      notUrgentNotImportant.push(task);
    }
  });

  const renderTaskList = (taskList: Task[], quadrantTitle: string) => (
    <Card className="flex flex-col"> {/* Added flex flex-col for consistent height if needed */}
      <CardHeader>
        <CardTitle>{quadrantTitle}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow"> {/* Added flex-grow to allow content to expand */}
        {taskList.length > 0 ? (
          <ul className="space-y-3">
            {taskList.map((task: Task) => (
              <li key={task.id} className="p-3 border rounded-lg shadow-sm hover:shadow-lg transition-shadow bg-card">
                <h3 className="font-semibold text-lg mb-1">{task.title}</h3>
                {task.description && <p className="text-sm text-muted-foreground mb-2">{task.description}</p>}
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Due: {format(new Date(task.dueDate), "PPP")}</p>
                  <p>Status: <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>{task.status}</Badge></p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No tasks in this category.</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-primary">Eisenhower Matrix</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderTaskList(urgentImportant, "Urgent & Important (Do First)")}
        {renderTaskList(notUrgentImportant, "Important & Not Urgent (Schedule)")}
        {renderTaskList(urgentNotImportant, "Urgent & Not Important (Delegate)")}
        {renderTaskList(notUrgentNotImportant, "Not Urgent & Not Important (Eliminate)")}
      </div>
    </div>
  );
}

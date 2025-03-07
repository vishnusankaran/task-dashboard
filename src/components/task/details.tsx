import * as React from "react";
import { useMutation } from "urql";
import { Button } from "@/components/ui/button";
import { SquareChevronRight, Trash2 } from "lucide-react";
import { EditTaskForm } from "@/components/task/edit-form";
import { DeleteTaskDialog } from "@/components/task/delete-dialog";
import { User } from "@/components/task/user";
import { TaskContext } from "@/context/task";
import { deleteSingleTask } from "@/queries/tasks";

export const TaskDetails = React.memo(function ({
  handleCollapse,
}: {
  handleCollapse: () => void;
}) {
  const { fetchTasks, activeTask } = React.useContext(TaskContext);
  const [_, deleteTask] = useMutation(deleteSingleTask);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-start gap-2 bg-background py-2">
        <div className="ml-3 flex grow items-center">
          <Button variant={"ghost"} onClick={handleCollapse}>
            <SquareChevronRight size="sm" />
            Collapse
          </Button>
        </div>
        <DeleteTaskDialog
          onDelete={async (e) => {
            await deleteTask({
              where: {
                id: {
                  eq: activeTask?.id,
                },
              },
            });
            fetchTasks({ requestPolicy: "network-only" });
          }}
        >
          <Button variant={"ghost"}>
            <Trash2 size="sm" />
            Delete
          </Button>
        </DeleteTaskDialog>
      </div>
      <div className="flex h-full grow flex-col rounded-tr-md rounded-br-md bg-accent p-6">
        <div className="flex grow flex-col">
          {activeTask && <EditTaskForm {...activeTask} />}
        </div>
        <div className="">
          <User showName={true} user={activeTask?.user} />
        </div>
      </div>
    </div>
  );
});

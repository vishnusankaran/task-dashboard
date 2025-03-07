import * as React from "react";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useMutation } from "urql";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DeleteTaskDialog } from "@/components/task/delete-task-dialog";
import { deleteSingleTask } from "@/queries/tasks";
import { TaskContext } from "@/context/task";

export function TaskActions({
  id,
  handleChange,
}: {
  id: string;
  handleChange: (event: React.MouseEvent, action: string) => void;
}) {
  const { fetchTasks } = React.useContext(TaskContext);
  const [_, deleteTask] = useMutation(deleteSingleTask);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        onClick={(e) => handleChange(e, "delete")}
      >
        <DropdownMenuItem className="cursor-pointer">
          <DeleteTaskDialog
            onDelete={async (e) => {
              e.stopPropagation();
              e.preventDefault();
              await deleteTask({
                where: {
                  id: {
                    eq: id,
                  },
                },
              });
              fetchTasks({ requestPolicy: "network-only" });
            }}
          >
            <Button size="xs" variant={"ghost"}>
              <Trash2 size="sm" />
              Delete
            </Button>
          </DeleteTaskDialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

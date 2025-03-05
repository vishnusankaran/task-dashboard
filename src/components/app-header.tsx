import * as React from "react";

import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AddTaskDrawer } from "@/components/task/add-task-drawer";

// Add type at the top
type StatusRecord = Record<string, boolean>;
type StatusType = "pending" | "in-progress" | "completed";
const statuses: StatusType[] = ["pending", "in-progress", "completed"];

export function AppHeader() {
  const [selectedStatuses, setSelectedStatuses] = React.useState<StatusRecord>(
    {},
  );

  return (
    <header className="flex h-16 w-full grow gap-2 px-2 py-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex grow items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2" />

        <div className="flex w-full gap-4">
          <div className="flex gap-1">
            {statuses.map((status) => (
              <Button
                variant={`${selectedStatuses[status] ? status : "outline"}`}
                onClick={() => {
                  setSelectedStatuses({
                    ...selectedStatuses,
                    [status]: !selectedStatuses[status],
                  });
                }}
              >
                {status} - 2
              </Button>
            ))}
          </div>
          <div className="flex grow-1"></div>
          <AddTaskDrawer>
            <Button>
              <Plus />
              Add Task
            </Button>
          </AddTaskDrawer>
        </div>
      </div>
    </header>
  );
}

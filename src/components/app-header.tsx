import * as React from "react";

import { ChevronDown, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

// Add type at the top
type StatusRecord = Record<string, boolean>;
type StatusType = "pending" | "in-progress" | "completed";

export function AppHeader() {
  const [selectedStatuses, setSelectedStatuses] = React.useState<StatusRecord>(
    {},
  );
  const statusArray = Object.entries(selectedStatuses)
    .filter((entry) => entry[1])
    .map(([key]) => key as StatusType);

  return (
    <header className="flex h-16 w-full grow gap-2 px-2 py-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex grow items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2" />

        <div className="flex w-full gap-4">
          <div className="flex gap-1">
            {["pending", "in-progress", "completed"].map((status) => (
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
          <Button>
            <Plus />
            Add Task
          </Button>
        </div>
      </div>
    </header>
  );
}

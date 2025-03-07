import * as React from "react";
import { useLocation } from "react-router";
import { Plus, RefreshCw } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AddDrawer } from "@/components/task/add-drawer";

import { TaskContext } from "@/context/task";
import { StatusFilterContext } from "@/context/filter";

import { StatusType } from "@/types";

const allStatuses: StatusType[] = ["pending", "in-progress", "completed"];

export function AppHeader() {
  const location = useLocation();
  const { tasks, fetchTasks, result } = React.useContext(TaskContext);
  const { statuses, addStatusFilter, removeStatusFilter } =
    React.useContext(StatusFilterContext);

  const updatedStatuses = allStatuses.map((status) => ({
    status,
    count: tasks.filter((task) => task.status === status).length,
  }));

  return (
    <header className="flex h-16 w-full grow gap-2 px-2 py-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex grow items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2" />

        <div className="flex w-full gap-4">
          <div className="flex items-center gap-1">
            {!["/pending", "/in-progress", "/completed"].includes(
              location.pathname,
            ) ? (
              updatedStatuses.map(({ status, count }, idx) => (
                <Button
                  key={idx}
                  variant={`${statuses[status] ? status : "outline"}`}
                  onClick={() => {
                    if (!statuses[status]) {
                      addStatusFilter(status);
                    } else {
                      removeStatusFilter(status);
                    }
                  }}
                >
                  {count} {status}
                </Button>
              ))
            ) : (
              <span className="capitalize">
                {location.pathname.split("/")[1]} Tasks
              </span>
            )}
          </div>
          <div className="flex grow-1"></div>

          <Button
            variant="ghost"
            onClick={() => fetchTasks({ requestPolicy: "network-only" })}
            className={`${result?.fetching ? "animate-spin" : ""}`}
            disabled={result?.fetching}
          >
            <RefreshCw />
          </Button>
          <AddDrawer>
            <Button>
              <Plus />
              Add Task
            </Button>
          </AddDrawer>
        </div>
      </div>
    </header>
  );
}

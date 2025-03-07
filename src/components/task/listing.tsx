"use client";

import * as React from "react";
import { useLocation } from "react-router";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import type { Task } from "@/types";
import { AddTaskDrawer } from "@/components/task/add-task-drawer";
import { TaskDetails } from "@/components/task/details";

import { StatusFilterContext } from "@/context/filter";
import { TaskContext } from "@/context/task";

export function TaskListing() {
  const location = useLocation();
  const { activeTask, setActiveTask, tasks, fetchTasks, result } =
    React.useContext(TaskContext);
  const { statuses } = React.useContext(StatusFilterContext);

  const [enableResize, setEnableResize] = React.useState<boolean>(false);
  const rightPanel = React.useRef(null);
  const leftPanel = React.useRef(null);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  React.useEffect(() => {
    fetchTasks();
  }, []);

  React.useEffect(() => {
    if (["/completed"].includes(location.pathname)) {
      setColumnFilters([
        {
          id: "status",
          value: "completed",
        },
      ]);
    } else {
      setColumnFilters([
        {
          id: "status",
          value: Object.entries(statuses)
            .filter(([_, val]) => val)
            .map(([key]) => key),
        },
      ]);
    }
  }, [statuses, location.pathname]);

  const table = useReactTable<Task>({
    data: tasks,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const expandTaskDetails = (task: Task) => {
    setActiveTask(task);
    setEnableResize(true);
    leftPanel.current?.resize(60);
    rightPanel.current?.resize(40);
  };

  const collapseTaskDetails = React.useCallback(() => {
    setEnableResize(false);
    setActiveTask(null);
    leftPanel.current?.resize(100);
    rightPanel.current?.resize(0);
  }, [leftPanel, rightPanel, setEnableResize, setActiveTask]);

  if (result?.fetching) return <p>Loading...</p>;
  if (result?.error) return <p>Oh no... {result?.error?.message}</p>;

  const allTasks = table.getPrePaginationRowModel().rows;

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="w-full md:min-w-[450px]"
    >
      <ResizablePanel
        defaultSize={enableResize ? 60 : 100}
        ref={leftPanel}
        className="transition-[width] duration-200 ease-linear"
      >
        <div className="w-full">
          <div className="flex flex-col">
            {!!allTasks?.length &&
              table.getHeaderGroups().map((headerGroup) => (
                <div key={headerGroup.id} className="flex gap-2 p-2">
                  {headerGroup.headers.map((header) => {
                    return (
                      ((enableResize &&
                        !["description"].includes(header.column.id)) ||
                        !enableResize) && (
                        <div
                          key={header.id}
                          className={`m-auto box-border text-sm font-medium text-slate-500 ${header.column.id === "title" || header.column.id === "description" ? "grow" : ""}`}
                          style={{
                            width:
                              header.column.getSize() !== 0
                                ? header.column.getSize()
                                : "",
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </div>
                      )
                    );
                  })}
                </div>
              ))}
            {!!allTasks?.length && (
              <div
                className={`box-border rounded-md border ${enableResize ? "rounded-tr-none rounded-br-none" : ""}`}
              >
                {allTasks.map((row) => (
                  <div
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`flex cursor-pointer items-center justify-center gap-2 border-b-1 p-2 hover:bg-accent ${activeTask?.id === row.original.id ? "bg-accent" : ""}`}
                    onClick={() => {
                      expandTaskDetails(row.original);
                    }}
                  >
                    {row.getVisibleCells().map(
                      (cell) =>
                        ((enableResize &&
                          !["description"].includes(cell.column.id)) ||
                          !enableResize) && (
                          <div
                            key={cell.id}
                            data-type={cell.column.id}
                            className={`${cell.column.id === "title" || cell.column.id === "description" ? "grow" : ""}`}
                            style={{
                              width:
                                cell.column.getSize() !== 0
                                  ? cell.column.getSize()
                                  : "",
                            }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </div>
                        ),
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-2 py-4">
            {table.getFilteredRowModel().rows.length ? (
              <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredRowModel().rows.length}{" "}
                {table.getFilteredRowModel().rows.length > 1
                  ? "tasks to complete."
                  : "task to complete."}
              </div>
            ) : (
              <div className="flex-1 text-center text-sm text-muted-foreground">
                <AddTaskDrawer>
                  <Button variant="outline">
                    <Plus />
                    Add a new task
                  </Button>
                </AddTaskDrawer>
              </div>
            )}

            <div className="space-x-2"></div>
          </div>
        </div>
      </ResizablePanel>
      {enableResize && <ResizableHandle className="cursor-e-resize" />}
      <ResizablePanel
        ref={rightPanel}
        defaultSize={enableResize ? 40 : 0}
        className="transition-[flex] duration-300 ease-linear"
      >
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={75}>
            <TaskDetails handleCollapse={collapseTaskDetails} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

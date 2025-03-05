"use client";

import * as React from "react";
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
import { SquareChevronRight, Trash2 } from "lucide-react";
import { tasks } from "@/mocks/tasks";
import { columns } from "./columns";
import type { Task } from "@/types";
import { EditTaskForm } from "@/components/task/edit-task-form";
import { DeleteTaskDialog } from "./delete-task-dialog";

export function TaskListing() {
  const [enableResize, setEnableResize] = React.useState<boolean>(false);
  const rightPanel = React.useRef(null);
  const leftPanel = React.useRef(null);
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

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

  const expandTaskDetails = (task) => {
    setActiveTask(task);
    setEnableResize(true);
    leftPanel.current?.resize(60);
    rightPanel.current?.resize(40);
  };

  const collapseTaskDetails = () => {
    setEnableResize(false);
    setActiveTask(null);
    leftPanel.current?.resize(100);
    rightPanel.current?.resize(0);
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="w-full md:min-w-[450px]"
    >
      <ResizablePanel
        defaultSize={100}
        ref={leftPanel}
        className="transition-[width] duration-200 ease-linear"
      >
        <div className="w-full">
          <div className="flex flex-col">
            {table.getHeaderGroups().map((headerGroup) => (
              <div key={headerGroup.id} className="flex gap-2 p-2">
                {headerGroup.headers.map((header) => {
                  return (
                    ((enableResize &&
                      !["description"].includes(header.column.id)) ||
                      !enableResize) && (
                      <div
                        key={header.id}
                        className={`m-auto box-border text-sm font-medium text-slate-500 ${header.column.id === "description" ? "grow" : ""}`}
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
            <div
              className={`box-border rounded-md border ${enableResize ? "rounded-tr-none rounded-br-none" : ""}`}
            >
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <div
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`flex cursor-pointer items-center justify-center gap-2 border-b-1 p-2 px-4 hover:bg-accent ${activeTask?.id === row.original.id ? "bg-accent" : ""}`}
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
                            className={`${cell.column.id === "description" ? "grow" : ""}`}
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
                ))
              ) : (
                <div>Add Task +</div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              {/* <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button> */}
            </div>
          </div>
        </div>
      </ResizablePanel>
      {enableResize && <ResizableHandle className="cursor-e-resize" />}
      <ResizablePanel
        ref={rightPanel}
        defaultSize={0}
        className="bg-accent transition-[flex] duration-300 ease-linear"
      >
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={75}>
            <div className="flex h-[52px] items-center justify-start gap-2 bg-background">
              <div className="ml-3 flex grow items-center">
                <Button variant={"ghost"} onClick={collapseTaskDetails}>
                  <SquareChevronRight size="sm" />
                  Collapse
                </Button>
              </div>
              <DeleteTaskDialog onDelete={() => {}}>
                <Button variant={"ghost"}>
                  <Trash2 size="sm" />
                  Delete
                </Button>
              </DeleteTaskDialog>
            </div>
            <div className="flex h-full grow p-6">
              {activeTask && <EditTaskForm {...activeTask} />}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

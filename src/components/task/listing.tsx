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
import { Button } from "@/components/ui/button";
import { tasks } from "@/mocks/tasks";
import { columns } from "./columns";
import type { Task } from "@/types";

export function TaskListing() {
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

  return (
    <div className="w-full">
      <div className="flex flex-col">
        {table.getHeaderGroups().map((headerGroup) => (
          <div key={headerGroup.id} className="flex gap-2 p-2">
            {headerGroup.headers.map((header) => {
              return (
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
              );
            })}
          </div>
        ))}
        <div className="box-border rounded-md border px-2">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <div
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="flex items-center justify-center gap-2 border-b-1 p-2"
              >
                {row.getVisibleCells().map((cell) => (
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
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
          <Button
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
          </Button>
        </div>
      </div>
    </div>
  );
}

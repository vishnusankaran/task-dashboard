import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserAvatar } from "@/components/task/user-avatar";
import type { Task, User } from "@/types";

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "status",
    header: "",
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant={row.getValue("status")}
            className="flex h-5 w-5 items-center justify-center rounded-full"
          >
            {" "}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{row.getValue("status")}</p>
        </TooltipContent>
      </Tooltip>
    ),
    size: 24,
    filterFn: (row, columnId, filterValues) => {
      // If no filter values are selected, show all rows
      if (!filterValues.length) return true;

      // Check if the row's value is in the array of selected filter values
      return filterValues.includes(row.getValue(columnId));
    },
  },
  {
    accessorKey: "user",
    header: "",
    cell: ({ row }) => {
      const user: User = row.getValue("user");

      return (
        typeof user === "object" && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <UserAvatar user={user} />
              </span>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{user?.name}</p>
            </TooltipContent>
          </Tooltip>
        )
      );
    },
    size: 24,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="text-sm capitalize">{row.getValue("title")}</div>
    ),
    size: 0,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("description")}</div>
    ),
    size: 0,
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="relative left-[-12px] pr-0 pl-0"
        >
          Due Date
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-xs capitalize">
        {(row.getValue("dueDate") as Date).toLocaleDateString("en-GB", {
          month: "short",
          day: "numeric",
        })}
      </div>
    ),
    size: 100,
  },
];

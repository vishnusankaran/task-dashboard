import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TaskActions } from "@/components/task/task-actions";
import { UserAvatar } from "@/components/task/user-avatar";
import type { Task, User } from "@/types";

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: "",
    // header: ({ table }) => (
    //   <Checkbox
    //     checked={
    //       table.getIsAllPageRowsSelected() ||
    //       (table.getIsSomePageRowsSelected() && "indeterminate")
    //     }
    //     onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //     aria-label="Select all"
    //   />
    // ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 24,
  },
  {
    accessorKey: "user",
    header: "",
    cell: ({ row }) => {
      const user: User = row.getValue("user");

      return <UserAvatar user={user} />;
    },
    size: 24,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="text-sm capitalize">{row.getValue("title")}</div>
    ),
    size: 400,
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.getValue("status")}>{row.getValue("status")}</Badge>
    ),
    size: 100,
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
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <TaskActions handleChange={() => {}} />;
    },
    size: 32,
  },
];

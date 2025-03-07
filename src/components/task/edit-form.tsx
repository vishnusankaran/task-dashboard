import * as React from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useMutation } from "urql";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Task } from "@/types";
import { updateSingleTask } from "@/queries/tasks";
import { TaskContext } from "@/context/task";

const statuses = ["pending", "in-progress", "completed"] as const;

const statusEnum = z.enum(statuses);

const formSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: "Minimum of 3 characters",
    })
    .max(50, {
      message: "Max limit of 50 characters",
    }),
  description: z
    .string()
    .min(0)
    .max(300, {
      message: "Max limit of 300 characters",
    })
    .optional(),
  status: statusEnum,
  dueDate: z.date(),
});

export const EditTaskForm = (props: Task) => {
  const { setActiveTask, result, fetchTasks } = React.useContext(TaskContext);
  const [_, updateTask] = useMutation(updateSingleTask);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: props.title,
      description: props.description,
      status: props.status,
      dueDate: props.dueDate,
    },
  });

  React.useEffect(() => {
    form.reset(props);
  }, [form, props]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    await updateTask({
      set: {
        ...values,
        dueDate: values.dueDate.toISOString(),
      },
      where: {
        id: {
          eq: props.id,
        },
      },
    });

    fetchTasks({ requestPolicy: "network-only" });
    setActiveTask({ ...props, ...values });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  className="bg-background"
                  autoFocus
                  placeholder="What do you want to call the task.."
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-32 bg-background"
                  placeholder="Describe the task in detail.."
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon />
                      {format(field.value, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={{ before: new Date() }}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full cursor-pointer bg-background">
                    <SelectValue placeholder="Update Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      {statuses.map((status, idx) => (
                        <SelectItem
                          key={idx}
                          className="cursor-pointer"
                          value={status}
                        >
                          {status}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <Button
          disabled={result.fetching}
          type="submit"
          className={`w-full ${result.fetching ? "animate-pulse" : ""}`}
        >
          Save
        </Button>
      </form>
    </Form>
  );
};

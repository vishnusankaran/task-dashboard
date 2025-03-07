import * as React from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { gql, useMutation } from "urql";

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";
import { addNewTask } from "@/queries/tasks";

const statusEnum = z.enum(["pending", "in-progress", "completed"]);

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

export const AddForm = ({ onDone }: { onDone: (response: object) => void }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "pending",
      dueDate: new Date(),
    },
  });

  const [_, addTask] = useMutation(addNewTask);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await addTask({
      values: [
        {
          ...values,
          dueDate: values.dueDate.toISOString(),
          id: crypto.randomUUID(),
        },
      ],
    });

    toast("Task added", {
      description: values?.title,
    });
    onDone(response);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
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
                  className="min-h-32"
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
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
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

        <Button type="submit" className="w-full">
          Add
        </Button>
      </form>
    </Form>
  );
};

import * as React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { TaskContext } from "@/context/task";
import { Button } from "@/components/ui/button";
import { AddForm } from "@/components/task/add-form";

export function AddDrawer({ children }: { children: React.ReactNode }) {
  const { fetchTasks } = React.useContext(TaskContext);
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer open={open}>
      <DrawerTrigger onClick={() => setOpen(true)} asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Task</DrawerTitle>
            <DrawerDescription>Add a new task for yourself</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <AddForm
                onDone={() => {
                  setOpen(false);
                  fetchTasks({ requestPolicy: "network-only" });
                }}
              />
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose
              onClick={() => {
                setOpen(false);
              }}
              asChild
            >
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

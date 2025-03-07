import { Routes, Route } from "react-router";

import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { TaskListing } from "@/components/task/listing";
import { Toaster } from "@/components/ui/sonner";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

import { UserProvider } from "@/provider/user";
import { StatusFilterProvider } from "@/provider/filter";
import { TaskProvider } from "@/provider/task";
import { ApiProvider } from "@/provider/api";

export default function App() {
  return (
    <ApiProvider>
      <UserProvider>
        <StatusFilterProvider>
          <TaskProvider>
            <TooltipProvider>
              <Routes>
                <Route
                  path="/:status?"
                  element={
                    <SidebarProvider>
                      <AppSidebar />
                      <SidebarInset>
                        <div className="flex w-full border-b">
                          <AppHeader />
                        </div>
                        <div className="flex flex-1 flex-col p-4 pt-0">
                          <TaskListing />
                        </div>
                      </SidebarInset>
                      <Toaster />
                    </SidebarProvider>
                  }
                />
              </Routes>
            </TooltipProvider>
          </TaskProvider>
        </StatusFilterProvider>
      </UserProvider>
    </ApiProvider>
  );
}

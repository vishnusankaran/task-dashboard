import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { TaskListing } from "@/components/task/listing";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { UserProvider } from "@/provider/user-provider";

export default function App() {
  return (
    <UserProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex w-full">
            <AppHeader />
          </div>
          <div className="flex flex-1 flex-col p-4 pt-0">
            <TaskListing />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </UserProvider>
  );
}

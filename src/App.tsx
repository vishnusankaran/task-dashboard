import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { TaskListing } from "@/components/task/listing";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function App() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="flex flex-1 flex-col p-4 pt-0">
          <TaskListing />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

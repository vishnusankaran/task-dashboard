import * as React from "react";
import { Bomb, ListCheck } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { ProjectLogo } from "@/components/project-logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { UserContext } from "@/context/user";

// This is sample data.
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: Bomb,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Tasks",
      url: "#",
      icon: ListCheck,
      isActive: true,
      items: [
        {
          title: "All Tasks",
          url: "/",
          isActive: true,
        },
        {
          title: "Completed Tasks",
          url: "/completed",
          isActive: true,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user] = React.useContext(UserContext);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ProjectLogo teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

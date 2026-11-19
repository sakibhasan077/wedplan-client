import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const sidebarMenuItem = {
  customer: [

  ],
  vendor:[

  ],
  admin: [
    
  ]

}

export function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        {/* {projects.map((project) => (
          <SidebarMenuItem key={project.name}>
            <SidebarMenuButton render={<a href={project.url} />}>
              <project.icon />
              <span>{project.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))} */}
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

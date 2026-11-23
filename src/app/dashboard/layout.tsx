import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { isBlockUser } from "@/lib/core/server-session";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  await isBlockUser()
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="min-w-0">
        <DashboardTopbar />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
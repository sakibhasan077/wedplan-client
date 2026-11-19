import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="flex-1">
        <div className="border-b border-border p-2 md:hidden">
          <SidebarTrigger />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
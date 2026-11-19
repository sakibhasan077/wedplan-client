"use client";

import { Bell } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useClientSession } from "@/lib/core/client-session";

type Role = "customer" | "vendor" | "admin";

const dashboardTitles: Record<Role, string> = {
  customer: "Customer Dashboard",
  vendor: "Vendor Dashboard",
  admin: "Admin Dashboard",
};

export function DashboardTopbar() {
  const { session, isPending } = useClientSession();
  const roleValue =
    session?.user && "role" in session.user && typeof session.user.role === "string"
      ? session.user.role
      : "customer";
  const role: Role =
    roleValue === "vendor" || roleValue === "admin" ? roleValue : "customer";

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <SidebarTrigger className="md:hidden" />
        {isPending ? (
          <Skeleton className="h-6 w-40" />
        ) : (
          <h1 className="truncate font-heading text-lg font-semibold sm:text-xl">
            {dashboardTitles[role]}
          </h1>
        )}
      </div>

      <div
        className="relative flex size-9 shrink-0 items-center justify-center"
        role="img"
        aria-label="Notifications"
      >
        {isPending ? (
          <Skeleton className="size-5 rounded-full" />
        ) : (
          <>
            <Bell className="size-5" aria-hidden="true" />
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-primary" />
          </>
        )}
      </div>
    </header>
  );
}
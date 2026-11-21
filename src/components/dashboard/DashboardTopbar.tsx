"use client";

import Image from "next/image";
import { Bell } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useClientSession } from "@/lib/core/client-session";
import { VendorPlanBadge } from "@/components/dashboard/VendorPlanBadge";

type Role = "customer" | "vendor" | "admin";

const dashboardTitles: Record<Role, string> = {
  customer: "Customer Dashboard",
  vendor: "Vendor Dashboard",
  admin: "Admin Dashboard",
};

export function DashboardTopbar() {
  const { session, isPending } = useClientSession();
  const user = session?.user;
  const roleValue =
    user && "role" in user && typeof user.role === "string"
      ? user.role
      : "customer";
  const role: Role =
    roleValue === "vendor" || roleValue === "admin" ? roleValue : "customer";
  const userName = user?.name?.trim() || "User";

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

      <div className="flex shrink-0 items-center gap-3">
        <div
          className="relative flex size-9 items-center justify-center"
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

        {role === "vendor" && !isPending && (
          <div className="flex items-center gap-2 border-l border-border pl-3">
            {user?.image ? (
              <Image
                src={user.image}
                alt=""
                width={32}
                height={32}
                unoptimized
                className="size-8 rounded-full object-cover"
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
              >
                {userName.charAt(0).toUpperCase()}
              </span>
            )}
            <span className="hidden max-w-28 truncate text-sm font-medium sm:block">
              {userName}
            </span>
            <VendorPlanBadge subscriptionPlan={user?.subscriptionPlan} />
          </div>
        )}
      </div>
    </header>
  );
}
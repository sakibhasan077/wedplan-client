"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  CalendarDays,
  Crown,
  HandCoins,
  Home,
  LayoutDashboard,
  LogOut,
  PackagePlus,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Store,
  Users,
  WalletCards,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useClientSession } from "@/lib/core/client-session";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

type Role = "customer" | "vendor" | "admin";

type MenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

function DashboardSidebarSkeleton() {
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="border-b border-sidebar-border p-3 group-data-[collapsible=icon]:p-2">
        {state === "expanded" ? (
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-10 w-36" />
            <SidebarTrigger className="size-9 border border-sidebar-border bg-card text-sidebar-foreground" />
          </div>
        ) : (
          <SidebarTrigger className="mx-auto size-9 border border-sidebar-border bg-card text-sidebar-foreground" />
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-3 py-4 group-data-[collapsible=icon]:px-2">
          <SidebarMenu className="gap-1">
            {Array.from({ length: 6 }, (_, index) => (
              <SidebarMenuItem key={index}>
                <div className="flex h-11 items-center gap-3 rounded-lg px-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
                  <Skeleton className="size-4 shrink-0 rounded-md" />
                  <Skeleton className="h-4 w-24 group-data-[collapsible=icon]:hidden" />
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto border-t border-sidebar-border p-3 group-data-[collapsible=icon]:px-2">
        <div className="flex items-center gap-3 px-1 py-2 group-data-[collapsible=icon]:justify-center">
          <Skeleton className="size-11 shrink-0 rounded-full" />
          <Skeleton className="h-4 w-24 group-data-[collapsible=icon]:hidden" />
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
      </SidebarFooter>
    </Sidebar>
  );
}

const sharedItems: MenuItem[] = [
  { label: "Home", href: "/", icon: Home },
];

const roleMenuItems: Record<Role, MenuItem[]> = {
  customer: [
    { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    { label: "My Bookings", href: "/dashboard/customer/bookings", icon: CalendarDays },
    { label: "Profile Settings", href: "/profile", icon: Settings },
  ],
  vendor: [
    { label: "Overview", href: "/dashboard/vendor", icon: LayoutDashboard },
    { label: "My Services", href: "/dashboard/vendor/services", icon: BriefcaseBusiness },
    { label: "Add Service", href: "/dashboard/vendor/services/add", icon: PackagePlus },
    { label: "Booking Requests", href: "/dashboard/vendor/bookings", icon: ShoppingBag },
    { label: "Subscription", href: "/dashboard/vendor/subscription", icon: Crown },
    { label: "Profile Settings", href: "/profile", icon: Settings },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: ShieldCheck },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Manage Services", href: "/dashboard/admin/services", icon: HandCoins },
    { label: "Transactions", href: "/dashboard/admin/transactions", icon: WalletCards },
    { label: "Profile Settings", href: "/profile", icon: Settings },
  ],
};

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useSidebar();
  const { session, isPending } = useClientSession();
  const user = session?.user;

  const roleValue =
    user && "role" in user && typeof user.role === "string"
      ? user.role
      : "customer";
  const role: Role =
    roleValue === "vendor" || roleValue === "admin" ? roleValue : "customer";

  const menuItems = [...sharedItems, ...roleMenuItems[role]];
  const activeHref = menuItems
    .filter((item) =>
      item.href === "/"
        ? pathname === "/"
        : pathname === item.href || pathname.startsWith(`${item.href}/`),
    )
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
  const userName = user?.name?.trim() || "User";
  const userInitial = userName.charAt(0).toUpperCase();
  const isExpanded = state === "expanded";

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push("/sign-in"),
      },
    });
  };

  if (isPending) {
    return <DashboardSidebarSkeleton />;
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="border-b border-sidebar-border p-3 group-data-[collapsible=icon]:p-2">
        {isExpanded ? (
          <div className="flex items-center justify-between gap-2">
            <Link href="/" className="flex min-w-0 items-center">
              <Image
                src="/images/logo.png"
                alt="WedPlan"
                width={150}
                height={48}
                className="h-10 w-auto object-contain"
                priority
              />
            </Link>
            <SidebarTrigger className="size-9 border border-sidebar-border bg-card text-sidebar-foreground" />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <SidebarTrigger className="size-9 border border-sidebar-border bg-card text-sidebar-foreground" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-3 py-4 group-data-[collapsible=icon]:px-2">
          <SidebarMenu className="gap-1">
            {menuItems.map((item) => {
              return (
                <SidebarMenuItem key={`${item.label}-${item.href}`}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    isActive={item.href === activeHref}
                    tooltip={item.label}
                    size="lg"
                    className="h-11 rounded-lg px-3 text-sm font-medium data-[active=true]:bg-primary data-[active=true]:text-primary-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2"
                  >
                    <item.icon className="ml-3"/>
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto border-t border-sidebar-border p-3 group-data-[collapsible=icon]:px-2">
        <div className="flex items-center gap-3 px-1 py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          {user?.image ? (
            <Image
              src={user.image}
              alt={userName}
              width={44}
              height={44}
              unoptimized
              className="size-11 rounded-full object-cover"
            />
          ) : (
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {userInitial}
            </div>
          )}
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">{userName}</p>
            <p className="text-xs capitalize text-muted-foreground">{role}</p>
          </div>
        </div>
        <SidebarMenuButton
          onClick={handleLogout}
          tooltip="Logout"
          size="lg"
          className="h-10 px-3 text-sm group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2"
        >
          <LogOut className="ml-3" />
          <span>Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}

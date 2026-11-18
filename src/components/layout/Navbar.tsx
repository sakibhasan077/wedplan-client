"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useClientSession } from "@/lib/core/client-session";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

function NavbarSkeleton() {
  return (
    <nav
      aria-label="Primary navigation"
      className="sticky top-0 z-50 border-b border-border bg-background"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-1">
          <Skeleton className="h-12 w-36" />
          <div className="hidden items-center gap-8 md:flex">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-28" />
          </div>
          <Skeleton className="hidden h-9 w-28 rounded-full md:block" />
          <Skeleton className="size-9 md:hidden" />
        </div>
      </div>
    </nav>
  );
}

export default function Navbar() {
  const { session, isPending } = useClientSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const user = session?.user;

  if (isPending) {
    return <NavbarSkeleton />;
  }

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Services", href: "/services" },
  ];

  const role =
    user && "role" in user && typeof user.role === "string"
      ? user.role
      : "customer";
  const dashboardHref =
    role === "admin"
      ? "/dashboard/admin"
      : role === "vendor"
        ? "/dashboard/vendor"
        : "/dashboard/customer";
  const userInitial = user?.name?.trim().charAt(0).toUpperCase() || "U";

  const handleLogout = async () => {
    setLogoutError(null);


      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/sign-in"); // redirect to login page
          },
          onError(err) {
            setLogoutError(
              err instanceof Error
                ? err.message
                : "Unable to sign out. Please try again.",
            );
          },
        },
      });
    //   if (result.error) {
    //     throw new Error(result.error.message || "Unable to sign out.");
    //   }

    //   router.refresh();
    //   router.push("/sign-in");
    // } catch (error) {
    //   setLogoutError(
    //     error instanceof Error
    //       ? error.message
    //       : "Unable to sign out. Please try again.",
    //   );
    // }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-1">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="WedPlan"
              width={160}
              height={45}
              priority
              className="h-14 w-auto object-contain"
            />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-sans text-sm font-medium transition-colors ${
                    isActive
                      ? "border-b-2 border-primary pb-1 text-primary"
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <DropdownMenu
                open={isProfileMenuOpen}
                onOpenChange={setIsProfileMenuOpen}
              >
                <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-border bg-card p-1.5 pr-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt=""
                      width={32}
                      height={32}
                      unoptimized
                      className="size-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex size-8 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                      {userInitial}
                    </span>
                  )}
                  <span className="hidden max-w-36 truncate sm:inline">
                    {user.name || "My Account"}
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className="size-4 text-muted-foreground"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="px-2 py-2">
                      <span className="block truncate text-sm font-semibold text-foreground">
                        {user.name || "My Account"}
                      </span>
                      <span className="block truncate text-xs font-normal text-muted-foreground">
                        {user.email}
                      </span>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  {logoutError && (
                    <p
                      role="alert"
                      className="px-2 py-1 text-xs text-destructive"
                    >
                      {logoutError}
                    </p>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    render={<Link href={dashboardHref} />}
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard aria-hidden="true" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    render={<Link href="/profile" />}
                    onClick={() => setIsOpen(false)}
                  >
                    <UserRound aria-hidden="true" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="bg-red-50 text-red-700 focus:bg-red-100 focus:text-red-800 dark:bg-red-950/40 dark:text-red-300 dark:focus:bg-red-950/70 dark:focus:text-red-200"
                  >
                    <LogOut aria-hidden="true" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden items-center gap-6 md:flex">
                <Link
                  href="/sign-in"
                  className="font-sans text-sm font-medium text-foreground transition-colors hover:text-primary"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="rounded-full bg-primary px-6 py-2 font-sans text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <div className="flex md:hidden">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-foreground transition-colors hover:text-primary focus:outline-none"
                aria-label="Toggle navigation menu"
                aria-expanded={isOpen}
              >
                {isOpen ? (
                  <X className="size-6" />
                ) : (
                  <Menu className="size-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="space-y-4 border-t border-border bg-background px-4 pt-3 pb-6 md:hidden">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`font-sans text-sm font-medium transition-colors ${
                    isActive
                      ? "font-semibold text-primary"
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {!user && (
            <div className="flex flex-col gap-3 border-t border-border pt-4">
              <Link
                href="/sign-in"
                onClick={() => setIsOpen(false)}
                className="max-w-40 text-center font-sans text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setIsOpen(false)}
                className="max-w-40 rounded-full bg-primary py-2.5 text-center font-sans text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

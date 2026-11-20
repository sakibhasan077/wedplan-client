"use client";

import type { ChangeEvent, FormEvent } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";

export default function UserSearchAndFilter() {
  const param = useSearchParams();
  const router = useRouter();
  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const search = data.search;
    const params = new URLSearchParams(param.toString());
    params.set("search", search as string);
    router.push(`/dashboard/admin/users?${params.toString()}`);

    // TODO: Add search behavior.
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const role = event.target.value;
    const params = new URLSearchParams(param.toString());
    params.set("role", role as string);
    router.push(`/dashboard/admin/users?${params.toString()}`);
  };

  return (
    <div className="mb-8 grid gap-3 sm:grid-cols-[minmax(0,1fr)_250px]">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Input
            name="search"
            placeholder="Search by name or email"
            aria-label="Search by name or email"
            className="h-10 pr-10"
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon-sm"
            aria-label="Search users"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            <Search aria-hidden="true" />
          </Button>
        </div>
      </form>
      <div className="relative">
        <label
          htmlFor="role-filter"
          className="absolute -top-2 left-2 z-10 bg-card px-1 text-xs text-muted-foreground"
        >
          Role
        </label>
        <select
          id="role-filter"
          name="role"
          onChange={handleRoleChange}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="vendor">Vendor</option>
          <option value="customer">Customer</option>
        </select>
      </div>
    </div>
  );
}

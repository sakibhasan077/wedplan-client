"use client";

import type { FormEvent } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminServiceSearchAndFilter() {
  const searchParams = useSearchParams();
  const router = useRouter()
  // filter by search
  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData (event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const search = data.search;
    const urlSearch = new URLSearchParams(searchParams.toString());
    urlSearch.set("search",search as string);
    router.push(`/dashboard/admin/services?${urlSearch.toString()}`)
  };

  // filter by category
  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const category = event.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", category as string);

    router.push(`/dashboard/admin/services?${params.toString()}`)
  };

  const handleStatusChange =(event: React.ChangeEvent<HTMLSelectElement>) => {
    const status = event.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", status as string);

    router.push(`/dashboard/admin/services?${params.toString()}`)
  };

  return (
    <div className="mb-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px_180px]">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Input
            name="search"
            placeholder="Search by service or vendor"
            aria-label="Search by service or vendor"
            className="h-10 pr-10"
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon-sm"
            aria-label="Search services"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            <Search aria-hidden="true" />
          </Button>
        </div>
      </form>

      <select
        name="category"
        aria-label="Filter by category"
        onChange={handleCategoryChange}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <option value="">All Categories</option>
        <option value="Photography & Videography">Photography &amp; Videography</option>
        <option value="Wedding Venues">Wedding Venues</option>
        <option value="Decoration & Florist">Decoration &amp; Florist</option>
        <option value="Catering Services">Catering Services</option>
        <option value="Makeup & Styling">Makeup &amp; Styling</option>
        <option value="Wedding Fashion">Wedding Fashion</option>
      </select>

      <select
        name="status"
        aria-label="Filter by status"
        onChange={handleStatusChange}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>
  );
}

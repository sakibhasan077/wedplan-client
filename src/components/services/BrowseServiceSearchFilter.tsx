"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Service } from "@/types/type";
import { useRouter, useSearchParams } from "next/navigation";




export default function BrowseServiceSearchFilter({services}:{services:Service[]}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchValue = searchParams.get("search") || "";
  const locationValue = searchParams.get("location") || "";
  const categoryValue = searchParams.get("category") || "";
  const sortValue = searchParams.get("sort") || "";

  const setQueryValue = (name: string, value: string) => {
    const query = new URLSearchParams(searchParams.toString());
    if (value) {
      query.set(name, value);
    } else {
      query.delete(name);
    }
    router.push(`/services${query.toString() ? `?${query.toString()}` : ""}`);
  };

  // handle search
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchInput = String(new FormData(e.currentTarget).get("search") || "").trim();
    setQueryValue("search", searchInput);
  };
  const handleLocation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const locationInput = String(new FormData(e.currentTarget).get("location") || "").trim();
    setQueryValue("location", locationInput);
  };
  const changeCategory = (e: React.ChangeEvent<HTMLSelectElement>) =>{
    const categoryInput = e.currentTarget.value;
    setQueryValue("category", categoryInput);
  }
  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) =>{
    const sortInput = e.currentTarget.value;
    setQueryValue("sort", sortInput);
  }

  const categories = [...new Set(services.map((service) => service.category).filter(Boolean))];

  return (
    <div
      className="mt-6 rounded-xl border border-border bg-card p-4 shadow-sm"
    >
      <div className="grid items-end gap-4 md:grid-cols-2 lg:grid-cols-5">
        <form onSubmit={handleSearch}>
        <label className="text-xs font-semibold text-foreground">
          Search by name
          <div className="relative mt-1.5">
            <Input
              type="search"
              name="search"
              defaultValue={searchValue}
              placeholder="e.g. wedding photography"
              className="h-9 pr-9"
            />
            <button
              type="submit"
              aria-label="Search services"
              className="absolute right-2.5 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
            >
              <Search className="size-4" />
            </button>
          </div>
        </label>
        </form>
        <label className="text-xs font-semibold text-foreground">
          Category
          <select
            name="category"
            value={categoryValue}
            onChange={changeCategory}
            className="mt-1.5 h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <form onSubmit={handleLocation}>
        <label className="text-xs font-semibold text-foreground">
          Location
          <div className="relative mt-1.5">
            <Input
              type="text"
              name="location"
              defaultValue={locationValue}
              placeholder="e.g. Dhaka"
              className="h-9 pr-9"
            />
            <button
              type="submit"
              aria-label="location"
              className="absolute right-2.5 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
            >
              <Search className="size-4" />
            </button>

          </div>
        </label>
        </form>

        <label className="text-xs font-semibold text-foreground">
          Sort by price
          <select
            name="sort"
            value={sortValue}
            onChange={handleSort}
            className="mt-1.5 h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
          >
            <option value="">Default order</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </label>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9"
          onClick={() => router.push("/services")}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}

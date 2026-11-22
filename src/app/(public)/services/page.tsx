import type { Metadata } from "next";
import { getBrowseService } from "@/lib/actions/services";
import type { Service } from "@/types/type";
import BrowseServiceSearchFilter from "@/components/services/BrowseServiceSearchFilter";
import BrowseServiceCard from "@/components/services/BrowseServiceCard";

export const metadata: Metadata = {
  title: "Browse Wedding Services - WedPlan",
  description:
    "Find photographers, venues, decorators, caterers and other wedding services.",
};

const BrowseServices = async ({searchParams}:{searchParams: Promise<{ [key: string]: string | string[] | undefined }>}) => {
  const params = await searchParams;
  const query = new URLSearchParams();

  const getValue = (name: "search" | "category" | "location" | "sort") => {
    const value = params[name];
    return typeof value === "string" ? value : "";
  };

  const search = getValue("search");
  const category = getValue("category");
  const location = getValue("location");
  const sort = getValue("sort");

  if (search) query.set("search", search);
  if (category) query.set("category", category);
  if (location) query.set("location", location);
  if (sort) query.set("sort", sort);

  const result = await getBrowseService(query.toString());
  const fetchedServices: Service[] = Array.isArray(result) ? result : [];

  let services = fetchedServices.filter((service) => {
    const matchesSearch =
      !search ||
      service.serviceName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      !category ||
      service.category.toLowerCase() === category.toLowerCase();
    const matchesLocation =
      !location ||
      service.location.toLowerCase().includes(location.toLowerCase());

    return matchesSearch && matchesCategory && matchesLocation;
  });

  if (sort === "asc") {
    services = [...services].sort((a, b) => Number(a.price) - Number(b.price));
  }
  if (sort === "desc") {
    services = [...services].sort((a, b) => Number(b.price) - Number(a.price));
  }
  return (
    <main className="w-full bg-background pb-10">
      <section className=" px-4 py-6 sm:px-6 sm:py-7">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-heading text-3xl leading-tight font-semibold sm:text-4xl">
            Browse Wedding Services
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-5 text-muted-foreground">
            Find photographers, venues, decorators, caterers and more, all from
            vendors approved by WedPlan.
          </p>

          <BrowseServiceSearchFilter services={services}/>

          <p className="mt-5 text-xs font-medium text-primary">
            Showing {services.length}{" "}
            {services.length === 1 ? "service" : "services"}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-5 sm:px-6">
        {services.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <BrowseServiceCard key={service._id} service={service} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card px-4 py-12 text-center text-sm text-muted-foreground">
            No wedding services found.
          </div>
        )}
      </section>
    </main>
  );
};

export default BrowseServices;
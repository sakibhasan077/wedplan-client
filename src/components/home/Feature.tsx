import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getBrowseService } from "@/lib/actions/services";
import BrowseServiceCard from "@/components/services/BrowseServiceCard";
import type { Service } from "@/types/type";

export default async function Feature() {
  const result = await getBrowseService();
  const services: Service[] = Array.isArray(result) ? result : [];
  const featuredServices = services.slice(0, 6);

  return (
    <section className="bg-background px-6 py-14 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-3xl leading-tight font-semibold text-foreground sm:text-4xl">
              Featured Wedding Services
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Thoughtfully chosen professionals for your day.
            </p>
          </div>

          <Link
            href="/services"
            className="mb-1 flex shrink-0 items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary-hover"
          >
            Browse all services
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>

        {featuredServices.length > 0 ? (
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((service) => (
              <BrowseServiceCard key={service._id} service={service} />
            ))}
          </div>
        ) : (
          <div className="mt-7 rounded-xl border border-border bg-card px-4 py-12 text-center text-sm text-muted-foreground">
            No featured wedding services available.
          </div>
        )}
      </div>
    </section>
  );
}
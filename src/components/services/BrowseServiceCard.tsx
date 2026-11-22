"use client"
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Service } from "@/types/type";
import { useClientSession } from "@/lib/core/client-session";

type BrowseServiceCardProps = {
  service: Service;
};

export default function BrowseServiceCard({
  service,
}: BrowseServiceCardProps) {
  const image = service.images?.[0] || service.imageUrl;
  const vendorName =
    service.vendorName || service.vendor?.name || "Wedding Vendor";
  const vendorInitial = vendorName.charAt(0).toUpperCase();

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="p-4 pb-3">
        <span className="inline-flex rounded-md bg-accent px-2.5 py-1 text-[10px] font-semibold text-accent-foreground">
          {service.category}
        </span>
      </div>

      <div className="relative h-44 bg-muted">
        {image ? (
          <Image
            src={image}
            alt={service.serviceName}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Image
              src="/images/choose-1.png"
              alt=""
              width={34}
              height={34}
              className="size-9 opacity-50"
            />
          </div>
        )}
      </div>

      <div className="p-4">
        <h2 className="line-clamp-1 font-heading text-lg font-semibold">
          {service.serviceName}
        </h2>

        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="size-3.5" />
          {service.location}
        </p>

        <div className="mt-3 flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
            {
              vendorInitial
            }
          </span>
          <span className="text-xs font-medium text-foreground">
            {vendorName}
          </span>
          <span className="rounded-full bg-secondary px-2 py-1 text-[9px] font-semibold text-muted-foreground">
            Premium
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <p className="text-sm font-semibold text-primary">
            BDT {Number(service.price).toLocaleString()}
          </p>
          <Button
            nativeButton = {false}
            render={<Link href={`/services/${service._id}`} />}
            size="sm"
            className="rounded-md px-4"
          >
            View Details
          </Button>
        </div>
      </div>
    </article>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Check, Clock3, MapPin, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Service } from "@/types/type";
import { updateServices } from "@/lib/actions/services";
import { DeleteDialog } from "./DeleteServiceDialog";

type VendorServiceListProps = {
  service: Service;
};

const VendorServiceList = ({ service }: VendorServiceListProps) => {
  const [isActive, setIsActive] = useState(service.isActive);
  const [isDeleted, setIsDeleted] = useState(false);
  const handleAvailabilityChange = async () => {
    setIsActive((current) => !current);
    const result = await updateServices(service._id, { isActive: !isActive });
  };


  const formattedPrice = new Intl.NumberFormat("en-BD").format(service.price);

  if (isDeleted) {
    return null;
  }

  return (
    <article className="mt-4 flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-4">
      <div className="flex min-w-0 items-center gap-4">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
          {service.imageUrl ? (
            <Image
              src={service.imageUrl}
              alt={service.serviceName}
              fill
              unoptimized
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
              No image
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-heading text-lg font-semibold leading-tight sm:text-xl">
              {service.serviceName}
            </h2>

            {service.status === "approved" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-status-approved-bg px-2.5 py-1 text-xs font-medium text-status-approved-text">
                <Check className="size-3" aria-hidden="true" />
                Approved
              </span>
            )}

            {service.status === "pending" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-status-pending-bg px-2.5 py-1 text-xs font-medium text-status-pending-text">
                <Clock3 className="size-3" aria-hidden="true" />
                Pending
              </span>
            )}

            {service.status === "rejected" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-status-rejected-bg px-2.5 py-1 text-xs font-medium text-status-rejected-text">
                <X className="size-3" aria-hidden="true" />
                Rejected
              </span>
            )}
          </div>

          <p className="mt-1 truncate text-sm text-muted-foreground">
            {service.category}
            <span className="mx-1.5" aria-hidden="true">•</span>
            ৳{formattedPrice}
          </p>

          <p className="mt-1.5 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-4 shrink-0 text-gold" aria-hidden="true" />
            {service.location}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-3 sm:shrink-0 sm:border-0 sm:pt-0">
        <label className="flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm text-muted-foreground">
          <span>{isActive ? "Active" : "Inactive"}</span>
          <button
            type="button"
            role="switch"
            aria-checked={isActive}
            aria-label={`${isActive ? "Deactivate" : "Activate"} ${service.serviceName}`}
            onClick={handleAvailabilityChange}
            className={`relative h-6 w-11 rounded-full border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 ${
              isActive
                ? "border-primary bg-primary"
                : "border-border bg-muted-foreground/25"
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                isActive ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </label>

        <Button
          variant="outline"
          size="sm"
          render={
            <Link href={`/dashboard/vendor/services/${service._id}/edit`} />
          }
          nativeButton={false}
          aria-label={`Edit ${service.serviceName}`}
        >
          <Pencil aria-hidden="true" />
          Edit
        </Button>

        <DeleteDialog serviceId={service._id}></DeleteDialog>
      </div>
    </article>
  );
};

export default VendorServiceList;

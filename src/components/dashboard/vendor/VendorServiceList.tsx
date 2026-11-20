"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Clock3, MapPin, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Service } from "@/types/type";

type VendorServiceListProps = {
  services: Service[];
};

export default function VendorServiceList({
  services: initialServices,
}: VendorServiceListProps) {
  const [services, setServices] = useState(initialServices);

  const handleAvailability = (serviceId: string) => {
    setServices((currentServices) =>
      currentServices.map((service) =>
        service._id === serviceId
          ? { ...service, isActive: !service.isActive }
          : service,
      ),
    );
  };

  const handleDelete = (serviceId: string) => {
    setServices((currentServices) =>
      currentServices.filter((service) => service._id !== serviceId),
    );
  };

  const formatPrice = (price: number) =>
    `৳${new Intl.NumberFormat("en-BD").format(price)}`;

  if (services.length === 0) {
    return (
      <div className="mt-5 rounded-xl border border-border bg-card px-6 py-12 text-center">
        <h2 className="font-heading text-xl font-semibold">
          No services found
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a service to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-5 space-y-4">
      {services.map((service) => (
        <article
          key={service._id}
          className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-[0_2px_8px_rgba(48,43,43,0.06)] sm:flex-row sm:items-center sm:justify-between sm:p-5"
        >
          <div className="flex min-w-0 items-start gap-4">
            <div className="size-18 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-20">
              {service.imageUrl ? (
                <img
                  src={service.imageUrl}
                  alt={service.serviceName}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                  Image
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate font-heading text-lg font-semibold sm:text-xl">
                  {service.serviceName}
                </h2>

                {service.status === "approved" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-status-approved-bg px-2 py-1 text-xs text-status-approved-text">
                    <Check className="size-3" />
                    Approved
                  </span>
                )}

                {service.status === "pending" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-status-pending-bg px-2 py-1 text-xs text-status-pending-text">
                    <Clock3 className="size-3" />
                    Pending
                  </span>
                )}

                {service.status === "rejected" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-status-rejected-bg px-2 py-1 text-xs text-status-rejected-text">
                    <X className="size-3" />
                    Rejected
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                {service.category}
                <span className="mx-2">•</span>
                {formatPrice(service.price)}
              </p>

              <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-4" />
                {service.location}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-border pt-4 sm:justify-end sm:border-t-0 sm:pt-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Active</span>
              <button
                type="button"
                role="switch"
                aria-checked={service.isActive}
                aria-label={`${service.isActive ? "Disable" : "Enable"} ${service.serviceName}`}
                onClick={() => handleAvailability(service._id)}
                className={`relative h-7 w-12 shrink-0 rounded-full border transition-all duration-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 ${
                  service.isActive
                    ? "border-primary bg-primary shadow-[0_2px_8px_rgba(201,108,120,0.35)]"
                    : "border-border bg-muted-foreground/20"
                }`}
              >
                <span
                  className={`absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                    service.isActive ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                render={
                  <Link
                    href={`/dashboard/vendor/services/${service._id}/edit`}
                  />
                }
                nativeButton={false}
              >
                <Pencil />
                Edit
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(service._id)}
              >
                <Trash2 />
                Delete
              </Button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

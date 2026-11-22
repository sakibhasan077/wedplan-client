"use client"

import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import type { Service } from "@/types/type";

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
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-[0_2px_14px_rgba(48,43,43,0.08)]"
    >
      <div className="relative h-44 overflow-hidden bg-muted">
        {image ? (
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.35 }}
          >
            <Image
              src={image}
              alt={service.serviceName}
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          </motion.div>
        ) : (
          <Image
            src="/images/choose-1.png"
            alt=""
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="px-4 pt-4 pb-3">
        <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          {service.category}
        </p>

        <h2 className="mt-1 line-clamp-1 font-heading text-[17px] font-semibold text-foreground">
          {service.serviceName}
        </h2>

        <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <MapPin className="size-3.5" />
          {service.location}
        </p>

        <div className="mt-3 flex items-center gap-2 pb-3">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-[9px] font-semibold text-muted-foreground">
            {vendorInitial}
          </span>
          <span className="truncate text-[11px] font-medium text-foreground">
            {vendorName}
          </span>
        </div>

        <Button
          nativeButton={false}
          render={<Link href={`/services/${service._id}`} />}
          size="sm"
          className="h-9 w-full rounded-md text-[11px]"
        >
          View Details
          <span aria-hidden="true">→</span>
        </Button>
      </div>
    </motion.article>
  );
}

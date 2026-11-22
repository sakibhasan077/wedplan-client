"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {  deleteServiceByAdmin, updateServicesByAdmin } from "@/lib/actions/services";
import type { Service } from "@/types/type";

type AdminServiceCardProps = {
  service: Service;
};

export default function AdminServiceCard({ service }: AdminServiceCardProps) {
  const [status, setStatus] = useState<Service["status"]>(service.status);
  const [isActive, setIsActive] = useState(service.isActive);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const image = service.imageUrl || service.images?.[0];
  const vendorName =
    service.vendorName || service.vendor?.name || "Unknown vendor";
  const vendorEmail = service.vendorEmail || service.vendor?.email;
  const formattedPrice = new Intl.NumberFormat("en-BD").format(service.price);

  const handleStatusChange = async (nextStatus: "approved" | "rejected") => {
    setIsUpdating(true);
    try {
      await updateServicesByAdmin(service._id, { status: nextStatus });
      setStatus(nextStatus);
    } catch (error) {
      console.error("Failed to update service status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvailabilityChange = async () => {
    const nextIsActive = !isActive;
    setIsUpdating(true);
    try {
      await updateServicesByAdmin(service._id, { isActive: nextIsActive });
      setIsActive(nextIsActive);
    } catch (error) {
      console.error("Failed to update service availability:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsUpdating(true);
    try {
      await deleteServiceByAdmin(service._id);
      setIsDeleteDialogOpen(false);
      setIsDeleted(true);
    } catch (error) {
      console.error("Failed to delete service:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isDeleted) {
    return null;
  }

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-4">
      <div className="flex min-w-0 items-center gap-4">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-28">
          {image ? (
            <Image
              src={image}
              alt={service.serviceName}
              fill
              unoptimized
              sizes="112px"
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
            <h2 className="font-heading text-base font-semibold leading-tight sm:text-lg">
              {service.serviceName}
            </h2>
            {status === "pending" && (
              <span className="rounded-full bg-status-pending-bg px-2.5 py-1 text-xs font-medium text-status-pending-text">
                Pending
              </span>
            )}
            {status === "approved" && (
              <span className="rounded-full bg-status-approved-bg px-2.5 py-1 text-xs font-medium text-status-approved-text">
                Approved
              </span>
            )}
            {status === "rejected" && (
              <span className="rounded-full bg-status-rejected-bg px-2.5 py-1 text-xs font-medium text-status-rejected-text">
                Rejected
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            {service.category}
            <span className="mx-1.5" aria-hidden="true">•</span>
            ৳{formattedPrice}
            <span className="mx-1.5" aria-hidden="true">•</span>
            {service.location}
          </p>

          <p className="mt-1.5 truncate text-sm text-muted-foreground">
            Vendor: {vendorName}
            {vendorEmail ? ` - ${vendorEmail}` : ""}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-3 sm:shrink-0 sm:border-0 sm:pt-0">
        {status !== "approved" && (
          <Button
            type="button"
            size="sm"
            disabled={isUpdating}
            onClick={() => handleStatusChange("approved")}
            className="bg-status-approved text-white hover:bg-status-approved/90"
          >
            <Check aria-hidden="true" />
            Approve
          </Button>
        )}

        {status !== "rejected" && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUpdating}
            onClick={() => handleStatusChange("rejected")}
          >
            <X aria-hidden="true" />
            Reject
          </Button>
        )}

        {status === "approved" && (
          <label className="flex h-9 items-center gap-2 rounded-lg px-2 text-sm text-muted-foreground">
            <span>{isActive ? "Active" : "Inactive"}</span>
            <button
              type="button"
              role="switch"
              aria-checked={isActive}
              aria-label={`${isActive ? "Deactivate" : "Activate"} ${service.serviceName}`}
              disabled={isUpdating}
              onClick={handleAvailabilityChange}
              className={`relative h-6 w-11 rounded-full border transition-colors ${
                isActive
                  ? "border-status-approved bg-status-approved"
                  : "border-border bg-muted-foreground/25"
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform ${
                  isActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </label>
        )}

        <Dialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <DialogTrigger
            render={
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={isUpdating}
              >
                <Trash2 aria-hidden="true" />
                Delete
              </Button>
            }
          />
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Delete Service</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &quot;{service.serviceName}&quot;?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline">Cancel</Button>} />
              <Button
                type="button"
                variant="destructive"
                disabled={isUpdating}
                onClick={handleDelete}
              >
                <Trash2 aria-hidden="true" />
                Delete Service
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </article>
  );
}

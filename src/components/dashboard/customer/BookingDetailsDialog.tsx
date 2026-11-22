"use client";

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
import { Button } from "@/components/ui/button";

type BookingDetailsDialogProps = {
  serviceName: string;
  category: string;
  vendorName: string;
  eventDate: string;
  eventLocation: string;
  requestedDate: string;
  status: string;
  message?: string;
};

export default function BookingDetailsDialog({
  serviceName,
  category,
  vendorName,
  eventDate,
  eventLocation,
  requestedDate,
  status,
  message,
}: BookingDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger className="inline-flex h-8 items-center rounded-md border border-border px-3 text-[11px] font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        View Details
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            Booking Details
          </DialogTitle>
          <DialogDescription>
            Information about your request for {serviceName}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground">{category}</p>
            <h3 className="mt-1 font-heading text-lg font-semibold">
              {serviceName}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Vendor: <span className="font-medium text-foreground">{vendorName}</span>
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-3 rounded-lg bg-muted/60 p-3 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Event date</dt>
              <dd className="mt-1 font-medium">{eventDate}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Status</dt>
              <dd className="mt-1 font-medium capitalize">{status}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Event location</dt>
              <dd className="mt-1 font-medium">{eventLocation || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Requested on</dt>
              <dd className="mt-1 font-medium">{requestedDate}</dd>
            </div>
          </dl>

          <div>
            <h4 className="text-xs font-semibold">Your message</h4>
            <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
              {message?.trim() || "No additional message was included."}
            </p>
          </div>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline">Close</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { updateStatus } from "@/lib/actions/bookings";

type BookingStatusActionsProps = {
  bookingId: string;
};

export default function BookingStatusActions({
  bookingId,
}: BookingStatusActionsProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (status: "Accepted" | "Rejected") => {
    setIsUpdating(true);

    try {
      await updateStatus(bookingId, status);
      toast.success(`Booking ${status.toLowerCase()}.`);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to update booking.",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="mt-3 flex gap-2">
      <Button
        type="button"
        size="sm"
        disabled={isUpdating}
        onClick={() => handleUpdate("Accepted")}
        className="h-8 px-4"
      >
        {isUpdating ? "Updating..." : "Accept"}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isUpdating}
        onClick={() => handleUpdate("Rejected")}
        className="h-8 border-primary/50 px-4 text-primary hover:bg-accent hover:text-primary"
      >
        Reject
      </Button>
    </div>
  );
}

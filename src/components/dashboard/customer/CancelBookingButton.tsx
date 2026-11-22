"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { cancelBooking } from "@/lib/actions/bookings";

type CancelBookingButtonProps = {
  bookingId: string;
};

export default function CancelBookingButton({
  bookingId,
}: CancelBookingButtonProps) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    setIsCancelling(true);

    try {
      await cancelBooking(bookingId);
      toast.success("Booking cancelled successfully.");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to cancel booking.",
      );
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={isCancelling}
      onClick={handleCancel}
      className="h-8 border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
    >
      {isCancelling ? "Cancelling..." : "Cancel Booking"}
    </Button>
  );
}

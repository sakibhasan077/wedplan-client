"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { CalendarDays, LockKeyhole, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useClientSession } from "@/lib/core/client-session";
import { addBookings } from "@/lib/actions/bookings";
import { useRouter } from "next/navigation";

type BookingRequestFormProps = {
  serviceId: string;
  vendorId: string;
};

export default function BookingRequestForm({
  serviceId,
  vendorId,
}: BookingRequestFormProps) {
  const { session, isPending } = useClientSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const role =
    session?.user && "role" in session.user
      ? String(session.user.role)
      : "customer";
  const canBook = Boolean(session?.user);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    const user = session?.user;

    if (!user) {
      toast.error("Sign in to request a booking.");
      router.push("/sign-in");
      return;
    }
    if(user.isBlocked){
      toast.error("You are Blocked.You can't book ");
      router.push("/unauthorized")
      return
    }

    if (role === "vendor" && vendorId === user.id) {
      toast.error("Vendors cannot request bookings for their own services.");
      router.push("/services");
      return;
    }

    if (role === "admin") {
      toast.error("Admins cannot request bookings for services.");
      router.push("/services");
      return;
    }

    if (isPending || !canBook) {
      toast.error("Your account is still loading. Please try again.");
      return;
    }

    const formData = new FormData(form);

    const booking = {
      serviceId,
      vendorId,
      customerId: user.id,
      eventDate: String(formData.get("eventDate") || ""),
      eventLocation: String(formData.get("eventLocation") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };

    setIsSubmitting(true);

    try {
      await addBookings(booking);
      toast.success("Booking request sent successfully.");
      form.reset();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to send your booking request.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <aside className="h-fit rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <h2 className="font-heading text-2xl font-semibold">
        Request a Booking
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Reserve this vendor for your wedding date and share celebration details.
      </p>

      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium">
          Event Date
          <div className="relative mt-1.5">
            <Input
              type="date"
              name="eventDate"
              required
              min={new Date().toISOString().slice(0, 10)}
              className="h-10"
              disabled={!canBook || isPending || isSubmitting}
            />
            <CalendarDays
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
          </div>
        </label>

        <label className="block text-sm font-medium">
          Event Location / Venue
          <div className="relative mt-1.5">
            <Input
              name="eventLocation"
              required
              maxLength={150}
              placeholder="e.g. Meadowwood Estate, Napa, CA"
              className="h-10 pr-9"
              disabled={!canBook || isPending || isSubmitting}
            />
            <MapPin
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
          </div>
        </label>

        <label className="block text-sm font-medium">
          Additional Message (Optional)
          <textarea
            name="message"
            rows={4}
            maxLength={1000}
            placeholder="Share your guest count, timeline, or special preferences..."
            disabled={!canBook || isPending || isSubmitting}
            className="mt-1.5 w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </label>

        {canBook ? (
          <Button
            type="submit"
            disabled={isPending || isSubmitting}
            className="h-11 w-full"
          >
            {isSubmitting ? "Sending request..." : "Send Booking Request"}
          </Button>
        ) : (
          <Button
            nativeButton={false}
            render={<Link href="/sign-in" />}
            className="h-11 w-full"
          >
            Sign in to request a booking
          </Button>
        )}
      </form>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <LockKeyhole className="size-3.5" aria-hidden="true" />
        {session?.user
          ? "Only customers can request a booking."
          : "Sign in as a customer to request a booking."}
      </p>
    </aside>
  );
}

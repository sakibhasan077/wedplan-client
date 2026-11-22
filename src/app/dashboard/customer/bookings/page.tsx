import Image from "next/image";
import Link from "next/link";
import {
  Ban,
  CheckCircle2,
  Clock3,
  ImageIcon,
  MapPin,
  XCircle,
} from "lucide-react";
import { getMyBooking } from "@/lib/actions/bookings";
import { getServerSession } from "@/lib/core/server-session";
import { getServiceById } from "@/lib/actions/services";
import { getUserById } from "@/lib/actions/users";
import CancelBookingButton from "@/components/dashboard/customer/CancelBookingButton";
import BookingDetailsDialog from "@/components/dashboard/customer/BookingDetailsDialog";
import type { Service } from "@/types/type";

type BookingRecord = {
  _id: string;
  serviceId: string;
  vendorId: string;
  eventDate: string;
  eventLocation: string;
  message?: string;
  status: string;
  createdAt: string;
};

type VendorDetails = {
  name?: string;
  businessName?: string;
  image?: string;
};

const BookingPage = async () => {
  const session = await getServerSession();
  const customerId = session?.user?.id;

  if (!customerId) {
    return (
      <main className="p-5 sm:p-7">
        <h1 className="font-heading text-2xl font-semibold">My Bookings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to view your booking requests.
        </p>
      </main>
    );
  }

  const result = await getMyBooking(
    `customerId=${encodeURIComponent(customerId)}`,
  );
  const records: BookingRecord[] = Array.isArray(result) ? result : [];
  const bookings = await Promise.all(
    records.map(async (booking) => {
      const [serviceResult, vendorResult] = await Promise.all([
        getServiceById(booking.serviceId),
        getUserById(booking.vendorId),
      ]);
      const vendor: VendorDetails =
        vendorResult?.user ?? vendorResult ?? {};

      return {
        ...booking,
        service: serviceResult as Service,
        vendorName:
          vendor.businessName || vendor.name || "Wedding Vendor",
        vendorImage: vendor.image,
      };
    }),
  );

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return "—";

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(parsedDate);
  };

  const statusStyles: Record<string, string> = {
    pending: "bg-status-pending-bg text-status-pending-text",
    accepted: "bg-status-approved-bg text-status-approved-text",
    rejected: "bg-status-rejected-bg text-status-rejected-text",
    cancelled: "bg-secondary text-muted-foreground",
  };

  const statusIcons: Record<string, typeof Clock3> = {
    pending: Clock3,
    accepted: CheckCircle2,
    rejected: XCircle,
    cancelled: Ban,
  };

  return (
    <main className="min-h-full bg-background px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-5">
          <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
            My Bookings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track every booking request you have sent to vendors.
          </p>
        </header>

        {bookings.length > 0 ? (
          <div className="space-y-3">
            {bookings.map((booking) => {
              const status = booking.status.toLowerCase();
              const StatusIcon = statusIcons[status] || Clock3;
              const statusStyle =
                statusStyles[status] || "bg-secondary text-muted-foreground";
              const serviceImage =
                booking.service.images?.[0] || booking.service.imageUrl;

              return (
                <article
                  key={booking._id}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-start sm:gap-4 sm:p-4"
                >
                  <div className="relative flex h-24 w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary sm:size-20">
                    {serviceImage ? (
                      <Image
                        src={serviceImage}
                        alt={booking.service.serviceName}
                        fill
                        unoptimized
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <ImageIcon
                        className="size-6 text-gold"
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[11px] text-muted-foreground">
                          {booking.service.category}
                        </p>
                        <h2 className="mt-0.5 truncate font-heading text-base font-semibold">
                          {booking.service.serviceName}
                        </h2>
                      </div>
                      <span
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium capitalize ${statusStyle}`}
                      >
                        <StatusIcon className="size-3" aria-hidden="true" />
                        {status}
                      </span>
                    </div>

                    <div className="mt-1.5 flex items-center gap-2">
                      {booking.vendorImage ? (
                        <Image
                          src={booking.vendorImage}
                          alt=""
                          width={20}
                          height={20}
                          unoptimized
                          className="size-5 rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex size-5 items-center justify-center rounded-full bg-accent text-[9px] font-semibold text-accent-foreground">
                          {booking.vendorName.charAt(0).toUpperCase()}
                        </span>
                      )}
                      <span className="text-[11px] text-foreground">
                        {booking.vendorName}
                      </span>
                    </div>

                    <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1 text-[10px]">
                      <p>
                        <span className="block text-muted-foreground">
                          Event date
                        </span>
                        <span className="font-medium">
                          {formatDate(booking.eventDate)}
                        </span>
                      </p>
                      <p>
                        <span className="block text-muted-foreground">
                          Event location
                        </span>
                        <span className="inline-flex items-center gap-1 font-medium">
                          <MapPin className="size-3 text-muted-foreground" />
                          {booking.eventLocation || "—"}
                        </span>
                      </p>
                      <p>
                        <span className="block text-muted-foreground">
                          Requested on
                        </span>
                        <span className="font-medium">
                          {formatDate(booking.createdAt)}
                        </span>
                      </p>
                    </div>

                    <div className="mt-2.5 flex flex-wrap gap-2">
                      <BookingDetailsDialog
                        serviceName={booking.service.serviceName}
                        category={booking.service.category}
                        vendorName={booking.vendorName}
                        eventDate={formatDate(booking.eventDate)}
                        eventLocation={booking.eventLocation}
                        requestedDate={formatDate(booking.createdAt)}
                        status={status}
                        message={booking.message}
                      />
                      {status === "pending" && (
                        <CancelBookingButton bookingId={booking._id} />
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card px-4 py-12 text-center">
            <p className="font-heading text-lg font-semibold">
              No booking requests yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse wedding services and send a booking request to get started.
            </p>
            <Link
              href="/services"
              className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
            >
              Browse services
            </Link>
          </div>
        )}

        {bookings.length > 0 && (
          <p className="mt-4 text-[11px] text-muted-foreground">
            Only pending requests can be cancelled.
          </p>
        )}
      </div>
    </main>
  );
};

export default BookingPage;
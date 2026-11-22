import Image from "next/image";
import {
  CheckCircle2,
  Clock3,
  ImageIcon,
  MapPin,
  XCircle,
} from "lucide-react";
import { getBookingByVendor } from "@/lib/actions/bookings";
import { getServerSession } from "@/lib/core/server-session";
import { getServiceById } from "@/lib/actions/services";
import { getUserById } from "@/lib/actions/users";
import BookingStatusActions from "@/components/dashboard/vendor/BookingStatusActions";
import type { Service } from "@/types/type";

type BookingRecord = {
  _id: string;
  serviceId: string;
  customerId: string;
  eventDate: string;
  eventLocation: string;
  message?: string;
  status: string;
  createdAt: string;
};

type CustomerDetails = {
  name?: string;
  email?: string;
  image?: string;
};

const formatDate = (date: string) => {
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
};

const BookingPage = async () => {
  const session = await getServerSession();
  const vendorId = session?.user?.id;

  if (!vendorId) {
    return (
      <main className="p-5 sm:p-7">
        <h1 className="font-heading text-2xl font-semibold">
          Booking Requests
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to view your booking requests.
        </p>
      </main>
    );
  }

  const result = await getBookingByVendor(
    `vendorId=${encodeURIComponent(vendorId)}`,
  );
  const records: BookingRecord[] = Array.isArray(result) ? result : [];
  const bookings = await Promise.all(
    records.map(async (booking) => {
      const [serviceResult, customerResult] = await Promise.all([
        getServiceById(booking.serviceId),
        getUserById(booking.customerId),
      ]);
      const customer: CustomerDetails =
        customerResult?.user ?? customerResult ?? {};

      return {
        ...booking,
        service: serviceResult as Service,
        customerName: customer.name || "Customer",
        customerEmail: customer.email || "Email unavailable",
        customerImage: customer.image,
      };
    }),
  );

  const statusStyles: Record<string, string> = {
    pending: "bg-status-pending-bg text-status-pending-text",
    accepted: "bg-status-approved-bg text-status-approved-text",
    rejected: "bg-status-rejected-bg text-status-rejected-text",
  };

  const statusIcons: Record<string, typeof Clock3> = {
    pending: Clock3,
    accepted: CheckCircle2,
    rejected: XCircle,
  };

  return (
    <main className="min-h-full bg-background px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-5">
          <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
            Booking Requests
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review requests from customers and accept or reject them.
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
                  className="rounded-xl border border-border bg-card p-3 shadow-sm sm:p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      {booking.customerImage ? (
                        <Image
                          src={booking.customerImage}
                          alt=""
                          width={32}
                          height={32}
                          unoptimized
                          className="size-8 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
                          {booking.customerName.charAt(0).toUpperCase()}
                        </span>
                      )}
                      <div className="min-w-0">
                        <h2 className="truncate text-xs font-semibold">
                          {booking.customerName}
                        </h2>
                        <p className="truncate text-[10px] text-muted-foreground">
                          {booking.customerEmail}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium capitalize ${statusStyle}`}
                    >
                      <StatusIcon className="size-3" aria-hidden="true" />
                      {status}
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-center gap-2 rounded-lg bg-muted/60 p-2">
                    <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-secondary">
                      {serviceImage ? (
                        <Image
                          src={serviceImage}
                          alt={booking.service.serviceName}
                          fill
                          unoptimized
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <ImageIcon
                          className="size-4 text-gold"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[10px] text-muted-foreground">
                        {booking.service.category}
                      </p>
                      <p className="truncate font-heading text-xs font-semibold">
                        {booking.service.serviceName}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5 flex flex-wrap gap-x-6 gap-y-1 text-[10px]">
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

                  <div className="mt-2.5 rounded-lg border border-border px-3 py-2">
                    <p className="text-[9px] text-muted-foreground">
                      Customer message
                    </p>
                    <p className="mt-0.5 whitespace-pre-wrap text-[11px]">
                      {booking.message?.trim() || "No message provided."}
                    </p>
                  </div>

                  {status === "pending" ? (
                    <BookingStatusActions bookingId={booking._id} />
                  ) : (
                    <p className="mt-2.5 text-[10px] text-muted-foreground">
                      This request has been processed.
                    </p>
                  )}
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
              Customer requests for your services will appear here.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default BookingPage;
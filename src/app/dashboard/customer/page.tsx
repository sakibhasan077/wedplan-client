import Link from "next/link";
import {
  CalendarDays,
  CircleCheck,
  CircleX,
  Clock3,
} from "lucide-react";
import { redirect } from "next/navigation";
import { getCustomerOverview } from "@/lib/actions/overview";
import { getServerSession } from "@/lib/core/server-session";

type CustomerOverviewData = {
  totalBookings: number;
  pendingBookings: number;
  acceptedBookings: number;
  rejectedBookings: number;
};

const CustomerDashboard = async () => {
  const session = await getServerSession();
  const customerId = session?.user?.id;

  if (!customerId) {
    redirect("/sign-in");
  }

  const result = (await getCustomerOverview(customerId)) as CustomerOverviewData;

  const stats = [
    {
      label: "Total Booking Requests",
      value: result.totalBookings,
      icon: CalendarDays,
      iconStyle: "bg-accent text-accent-foreground",
    },
    {
      label: "Pending Bookings",
      value: result.pendingBookings,
      icon: Clock3,
      iconStyle: "bg-status-pending-bg text-status-pending-text",
    },
    {
      label: "Accepted Bookings",
      value: result.acceptedBookings,
      icon: CircleCheck,
      iconStyle: "bg-status-approved-bg text-status-approved-text",
    },
    {
      label: "Rejected Bookings",
      value: result.rejectedBookings,
      icon: CircleX,
      iconStyle: "bg-status-rejected-bg text-status-rejected-text",
    },
  ];

  return (
    <main className="min-h-full bg-background px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          <h1 className="font-heading text-3xl font-semibold sm:text-4xl">
            Customer Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep track of the booking requests you have sent to vendors.
          </p>
        </header>

        <section
          aria-label="Booking statistics"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                className="min-h-32 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="max-w-36 text-sm font-medium leading-5 text-muted-foreground">
                    {stat.label}
                  </h2>
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${stat.iconStyle}`}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-3 font-heading text-4xl font-semibold leading-none">
                  {stat.value.toLocaleString()}
                </p>
              </article>
            );
          })}
        </section>

        <section className="mt-5 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="font-heading text-xl font-semibold sm:text-2xl">
            Still planning your big day?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Explore photographers, venues, decorators and more from approved
            vendors.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <Link
              href="/services"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Browse Services
            </Link>
            <Link
              href="/dashboard/customer/bookings"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              View My Bookings
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default CustomerDashboard;
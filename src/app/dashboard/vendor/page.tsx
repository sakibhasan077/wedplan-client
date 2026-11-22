import Link from "next/link";
import {
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  Crown,
  LayoutGrid,
} from "lucide-react";
import { redirect } from "next/navigation";
import { getVendorOverview } from "@/lib/actions/overview";
import { getServerSession } from "@/lib/core/server-session";

type VendorOverviewData = {
  totalServices: number;
  activeServices: number;
  pendingRequests: number;
  acceptedBookings: number;
  subscriptionPlan: string;
};

const VendorDashboard = async () => {
  const session = await getServerSession();
  const vendorId = session?.user?.id;

  if (!vendorId) {
    redirect("/sign-in");
  }

  const result = (await getVendorOverview(vendorId)) as VendorOverviewData;
  const isPremium = result.subscriptionPlan.toLowerCase() === "premium";
  const serviceLimit = 3;
  const usagePercent = isPremium
    ? 100
    : Math.min((result.activeServices / serviceLimit) * 100, 100);

  const stats = [
    {
      label: "Total Services",
      value: result.totalServices,
      icon: LayoutGrid,
      color: "bg-accent text-accent-foreground",
    },
    {
      label: "Active Services",
      value: result.activeServices,
      icon: CheckCircle2,
      color: "bg-accent text-accent-foreground",
    },
    {
      label: "Pending Booking Requests",
      value: result.pendingRequests,
      icon: Clock3,
      color: "bg-gold-muted text-gold",
      needsReply: true,
    },
    {
      label: "Accepted Bookings",
      value: result.acceptedBookings,
      icon: CalendarCheck2,
      color: "bg-accent text-accent-foreground",
    },
  ];

  return (
    <main className="min-h-full bg-background px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          <h1 className="font-heading text-3xl font-semibold sm:text-4xl">
            Vendor Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A quick look at your services and booking requests.
          </p>
        </header>

        <section
          aria-label="Vendor statistics"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                className={`min-h-36 rounded-2xl border bg-card p-5 shadow-sm sm:p-6 ${
                  stat.needsReply ? "border-gold/60" : "border-border"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </h2>
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${stat.color}`}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <p className="font-heading text-4xl font-semibold leading-none">
                    {stat.value.toLocaleString()}
                  </p>
                  {stat.needsReply && (
                    <span className="rounded-full bg-gold-muted px-2.5 py-1 text-[10px] font-semibold text-gold">
                      Needs reply
                    </span>
                  )}
                </div>

                {stat.needsReply && (
                  <Link
                    href="/dashboard/vendor/bookings"
                    className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover"
                  >
                    Review requests
                    <span aria-hidden="true">→</span>
                  </Link>
                )}
              </article>
            );
          })}

          <article className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6 lg:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-medium text-muted-foreground">
                Current Subscription Plan
              </h2>
              <span className="flex size-9 items-center justify-center rounded-xl bg-gold-muted text-gold">
                <Crown className="size-4" aria-hidden="true" />
              </span>
            </div>

            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <span className="inline-flex rounded-full bg-secondary px-3 py-1.5 text-sm font-semibold capitalize">
                  {isPremium ? "Premium plan" : "Free plan"}
                </span>
                <p className="mt-2 text-xs text-muted-foreground">
                  {isPremium
                    ? "Unlimited active services"
                    : `${result.activeServices} of ${serviceLimit} active services used`}
                </p>
                {!isPremium && (
                  <div
                    className="mt-1.5 h-1.5 max-w-60 overflow-hidden rounded-full bg-secondary"
                    role="progressbar"
                    aria-label="Active service limit used"
                    aria-valuemin={0}
                    aria-valuemax={serviceLimit}
                    aria-valuenow={Math.min(result.activeServices, serviceLimit)}
                  >
                    <div
                      className="h-full rounded-full bg-gold transition-[width]"
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                )}
              </div>

              {!isPremium && (
                <Link
                  href="/dashboard/vendor/subscription"
                  className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
                >
                  Upgrade to Premium
                </Link>
              )}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
};

export default VendorDashboard;
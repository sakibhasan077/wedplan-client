import Link from "next/link";
import {
  Clock3,
  CreditCard,
  Heart,
  LayoutGrid,
  Store,
  UsersRound,
} from "lucide-react";
import { getAdminOverview } from "@/lib/actions/overview";

type AdminOverviewData = {
  totalUsers: number;
  totalVendors: number;
  totalCustomers: number;
  totalServices: number;
  pendingServices: number;
  totalTransactions: number;
};

const AdminDashboard = async () => {
  const result = (await getAdminOverview()) as AdminOverviewData;

  const stats = [
    {
      label: "Total Registered Users",
      value: result.totalUsers,
      icon: UsersRound,
      color: "bg-accent text-accent-foreground",
    },
    {
      label: "Total Vendors",
      value: result.totalVendors,
      icon: Store,
      color: "bg-accent text-accent-foreground",
    },
    {
      label: "Total Customers",
      value: result.totalCustomers,
      icon: Heart,
      color: "bg-accent text-accent-foreground",
    },
    {
      label: "Total Services",
      value: result.totalServices,
      icon: LayoutGrid,
      color: "bg-gold-muted text-gold",
    },
    {
      label: "Pending Services",
      value: result.pendingServices,
      icon: Clock3,
      color: "bg-gold-muted text-gold",
      needsReview: true,
    },
    {
      label: "Total Transactions",
      value: result.totalTransactions,
      icon: CreditCard,
      color: "bg-gold-muted text-gold",
    },
  ];

  return (
    <main className="min-h-full bg-background px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          <h1 className="font-heading text-3xl font-semibold sm:text-4xl">
            Admin Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A quick look at everything happening on WedPlan.
          </p>
        </header>

        <section
          aria-label="Platform statistics"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                className={`min-h-32 rounded-2xl border bg-card p-5 shadow-sm sm:p-6 ${
                  stat.needsReview
                    ? "border-gold/60"
                    : "border-border"
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
                  {stat.needsReview && (
                    <span className="rounded-full bg-gold-muted px-2.5 py-1 text-[10px] font-semibold text-gold">
                      Needs review
                    </span>
                  )}
                </div>

                {stat.needsReview && (
                  <Link
                    href="/dashboard/admin/services?status=pending"
                    className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover"
                  >
                    Review pending services
                    <span aria-hidden="true">→</span>
                  </Link>
                )}
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
};

export default AdminDashboard;
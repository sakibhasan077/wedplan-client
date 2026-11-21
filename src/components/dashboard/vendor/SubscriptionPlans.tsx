"use client";

import { Check, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

type SubscriptionPlansProps = {
  subscriptionPlan: string;
  activeServiceCount: number;
};

export default function SubscriptionPlans({
  subscriptionPlan,
  activeServiceCount,
}: SubscriptionPlansProps) {
  const isPremium = subscriptionPlan === "premium";

  const handleUpgradeToPremium = () => {};

  const freeFeatures = [
    "Maximum 3 Active Services",
    "Basic Vendor Dashboard",
    "Booking Request Management",
  ];

  const premiumFeatures = [
    "Unlimited Active Services",
    "Premium Vendor Badge",
    "Featured Service Placement",
    "All Free Plan Features",
  ];

  return (
    <section className="mx-auto w-full max-w-6xl">
      <header>
        <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
          Subscription Plans
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose the plan that fits your wedding business. Premium unlocks
          unlimited services and featured placement.
        </p>
      </header>

      <div className="mt-5 flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3 sm:px-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Active Plan Status
          </p>
          <p className="mt-1 flex items-center gap-2 text-sm font-semibold">
            {isPremium ? "Premium Plan" : "Free Plan"}
            <span className="font-normal text-muted-foreground">
              {isPremium
                ? "Unlimited Active Services"
                : `${Math.min(activeServiceCount, 3)} / 3 Active Services`}
            </span>
          </p>
        </div>

        {!isPremium && (
          <form action="/api/checkout_sessions" method="POST">
            <section>
              <Button type="submit" role="link" size="sm" onClick={handleUpgradeToPremium}>
                <Crown aria-hidden="true" />
                Upgrade to Premium
              </Button>
            </section>
          </form>
        )}
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <article
          className={`rounded-xl border bg-card p-5 sm:p-6 ${
            isPremium ? "border-border" : "border-primary"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-heading text-xl font-semibold">Free Plan</h2>
            {!isPremium && (
              <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                Current Plan
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Ideal for boutique vendors getting started on WedPlan.
          </p>

          <div className="mt-5 flex items-end gap-1">
            <span className="font-heading text-3xl font-semibold">$0</span>
            <span className="pb-1 text-sm text-muted-foreground">/ month</span>
          </div>

          <ul className="mt-5 space-y-3">
            {freeFeatures.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Check
                  aria-hidden="true"
                  className="size-4 shrink-0 text-primary"
                />
                {feature}
              </li>
            ))}
          </ul>
        </article>

        <article
          className={`rounded-xl border bg-card p-5 sm:p-6 ${
            isPremium ? "border-primary" : "border-border"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <Crown aria-hidden="true" className="size-5 text-gold" />
              <h2 className="font-heading text-xl font-semibold">
                Premium Plan
              </h2>
            </div>
            <span className="rounded-full bg-gold-muted px-2.5 py-1 text-xs font-medium text-gold">
              Recommended
            </span>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Built for established wedding studios scaling bookings.
          </p>

          <div className="mt-5 flex items-end gap-1">
            <span className="font-heading text-3xl font-semibold">$29</span>
            <span className="pb-1 text-sm text-muted-foreground">/ month</span>
          </div>

          <ul className="mt-5 space-y-3">
            {premiumFeatures.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Check
                  aria-hidden="true"
                  className="size-4 shrink-0 text-primary"
                />
                {feature}
              </li>
            ))}
          </ul>

          {isPremium ? (
            <Button type="button" size="lg" className="mt-6 w-full" disabled>
              <Crown aria-hidden="true" />
              Current Plan
            </Button>
          ) : (
            <form action="/api/checkout_sessions" method="POST">
              <section>
                <Button
                  type="submit"
                  role="link"
                  size="lg"
                  className="mt-6 w-full"
                >
                  <Crown aria-hidden="true" />
                  Upgrade to Premium
                </Button>
              </section>
            </form>
          )}
        </article>
      </div>
    </section>
  );
}

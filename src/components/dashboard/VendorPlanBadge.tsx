import { Crown } from "lucide-react";

type VendorPlanBadgeProps = {
  subscriptionPlan?: string | null;
};

export function VendorPlanBadge({
  subscriptionPlan,
}: VendorPlanBadgeProps) {
  const isPremium = subscriptionPlan?.toLowerCase() === "premium";
  const label = isPremium ? "Premium" : "Free";

  return (
    <span
      aria-label={`Vendor plan: ${label}`}
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
        isPremium
          ? "bg-gold-muted text-gold"
          : "bg-secondary text-muted-foreground"
      }`}
    >
      {isPremium && <Crown className="size-3" aria-hidden="true" />}
      {label}
    </span>
  );
}

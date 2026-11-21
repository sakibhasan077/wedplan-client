import type { Metadata } from "next";
import SubscriptionPlans from "@/components/dashboard/vendor/SubscriptionPlans";
import { countServices } from "@/lib/actions/services";
import { getServerSession } from "@/lib/core/server-session";

export const metadata: Metadata = {
  title: "Subscription Plans",
  description: "Choose the WedPlan subscription that fits your business.",
};

const SubscriptionPage = async () => {
  const session = await getServerSession();
  const vendorId = session?.user?.id;
  const countResult = vendorId
    ? await countServices(`vendorId=${vendorId}`)
    : { count: 0 };

  const subscriptionPlan =
    "subscriptionPlan" in (session?.user ?? {})
      ? String(session?.user.subscriptionPlan ?? "free").toLowerCase()
      : "free";
  const activeServiceCount =
    typeof countResult?.count === "number" ? countResult.count : 0;

  return (
    <main className="p-4 sm:p-6">
      <SubscriptionPlans
        subscriptionPlan={subscriptionPlan}
        activeServiceCount={activeServiceCount}
      />
    </main>
  );
};

export default SubscriptionPage;
import type { Metadata } from "next";
import SubscriptionPlans from "@/components/dashboard/vendor/SubscriptionPlans";
import { countServices } from "@/lib/actions/services";
import { getServerSession } from "@/lib/core/server-session";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Subscription Plans",
  description: "Choose the WedPlan subscription that fits your business.",
};

const SubscriptionPage = async ({ searchParams }: { searchParams: Promise<{ canceled?: string }> }) => {
  const session = await getServerSession();
  const vendorId = session?.user?.id;

  const { canceled } = await searchParams;

  if (canceled) {
    toast.error("Subscription canceled. You can continue using the free plan.");
    redirect("/dashboard/vendor/subscription/cancel");
  }
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
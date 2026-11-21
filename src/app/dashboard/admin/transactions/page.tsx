import type { Metadata } from "next";
import { CalendarDays, Crown, WalletCards } from "lucide-react";
import { getPaymentHistory } from "@/lib/actions/payment";

export const metadata: Metadata = {
  title: "Transactions — WedPlan",
  description: "Review the read-only log of vendor subscription payments.",
};

type VendorInfo = {
  name?: string;
  email?: string;
  businessName?: string;
};

type Transaction = {
  _id?: string;
  id?: string;
  stripeSessionId?: string;
  vendor?: VendorInfo | string;
  vendorId?: VendorInfo | string;
  vendorName?: string;
  vendorEmail?: string;
  plan?: string;
  amount?: number;
  currency?: string;
  status?: string;
  createdAt?: string;
  date?: string;
};

function getVendorInfo(transaction: Transaction) {
  const vendor = transaction.vendor ?? transaction.vendorId;
  const vendorDetails = typeof vendor === "object" ? vendor : undefined;
  const vendorId = typeof vendor === "string" ? vendor : undefined;

  return {
    name:
      vendorDetails?.businessName ??
      vendorDetails?.name ??
      transaction.vendorName ??
      (vendorId ? `Vendor ${vendorId}` : "Vendor information unavailable"),
    email: vendorDetails?.email ?? transaction.vendorEmail,
  };
}

function formatAmount(amount?: number, currency = "USD") {
  if (typeof amount !== "number" || !Number.isFinite(amount)) return "—";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getStatusDetails(status?: string) {
  const normalizedStatus = status?.toLowerCase() ?? "";

  if (normalizedStatus === "successful" || normalizedStatus === "completed") {
    return {
      label: "Completed",
      className: "bg-status-approved-bg text-status-approved-text",
    };
  }

  if (normalizedStatus === "pending") {
    return {
      label: "Pending",
      className: "bg-status-pending-bg text-status-pending-text",
    };
  }

  if (
    normalizedStatus === "failed" ||
    normalizedStatus === "cancelled" ||
    normalizedStatus === "canceled"
  ) {
    return {
      label: normalizedStatus === "failed" ? "Failed" : "Cancelled",
      className: "bg-status-rejected-bg text-status-rejected-text",
    };
  }

  return {
    label: status || "Unknown",
    className: "bg-muted text-muted-foreground",
  };
}

const TransactionsPage = async () => {
  const result: unknown = await getPaymentHistory();

  if (!Array.isArray(result)) {
    throw new Error("Payment history response must be an array.");
  }

  const transactions = result as Transaction[];
  console.log(transactions);

  return (
    <main className="p-4 sm:p-6">
      <section className="mx-auto max-w-6xl rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <header className="mb-5 flex items-start gap-3 border-b border-border pb-5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gold-muted text-gold">
            <WalletCards className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
              Platform Transactions
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Read-only audit log of subscription payments. Payment statuses
              are managed by verified Stripe events.
            </p>
          </div>
        </header>

        {transactions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border px-4 py-12 text-center">
            <CalendarDays
              className="mx-auto size-8 text-muted-foreground"
              aria-hidden="true"
            />
            <h2 className="mt-3 font-medium">No transactions yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Subscription payments will appear here when recorded.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Vendor
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Plan
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Amount
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Transaction Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions.map((transaction, index) => {
                  const vendor = getVendorInfo(transaction);
                  const status = getStatusDetails(transaction.status);
                  const key =
                    transaction._id ??
                    transaction.id ??
                    transaction.stripeSessionId ??
                    `${transaction.createdAt ?? transaction.date ?? "transaction"}-${index}`;

                  return (
                    <tr
                      key={key}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                            {vendor.name.charAt(0).toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-card-foreground">
                              {vendor.name}
                            </p>
                            {vendor.email && (
                              <p className="truncate text-xs text-muted-foreground">
                                {vendor.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-muted px-2.5 py-1 text-xs font-medium capitalize text-gold">
                          <Crown className="size-3.5" aria-hidden="true" />
                          {transaction.plan || "Premium"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 font-semibold text-card-foreground">
                        {formatAmount(transaction.amount, transaction.currency)}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                        >
                          <span className="size-1.5 rounded-full bg-current" />
                          {status.label}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-muted-foreground">
                        {formatDate(transaction.createdAt ?? transaction.date)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-4 text-xs text-muted-foreground">
          Transaction records are view-only. Only verified payment processing
          can update payment status.
        </p>
      </section>
    </main>
  );
};

export default TransactionsPage;
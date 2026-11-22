import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const dashboardByRole: Record<string, string> = {
  admin: "/dashboard/admin",
  vendor: "/dashboard/vendor",
  customer: "/dashboard/customer",
};

export const metadata = { title: "Access Denied | WedPlan" };

export default async function UnauthorizedPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = (session?.user as { role?: string } | undefined)?.role;
  const dashboardHref = role ? dashboardByRole[role] : null;

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#FAF7F2] px-4 py-16">
      <div className="w-full max-w-lg rounded-2xl border border-[#EAE3DA] bg-white p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F6E7E9]">
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#AA5360"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="4" y="11" width="16" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
        </div>

        <p className="mt-6 text-sm font-semibold tracking-widest text-[#B89A62]">
          ERROR 403
        </p>
        <h1 className="mt-2 font-serif text-4xl text-[#302B2B]">Access Denied</h1>
        <p className="mt-4 leading-relaxed text-[#77716F]">
          You do not have permission to view this page. If you think this is a
          mistake, please sign in with the correct account.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {dashboardHref ? (
            <Link
              href={dashboardHref}
              className="inline-flex min-h-11 items-center rounded-lg bg-[#AA5360] px-6 font-semibold text-white hover:bg-[#8F4350]"
            >
              Go to my dashboard
            </Link>
          ) : (
            <Link
              href="/signin"
              className="inline-flex min-h-11 items-center rounded-lg bg-[#AA5360] px-6 font-semibold text-white hover:bg-[#8F4350]"
            >
              Sign In
            </Link>
          )}
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-lg border border-[#8F877E] bg-white px-6 font-semibold text-[#302B2B] hover:bg-[#F3ECE3]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
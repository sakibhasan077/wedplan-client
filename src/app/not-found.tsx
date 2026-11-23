import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page Not Found — WedPlan",
  description: "The page you are looking for could not be found.",
};

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <section className="w-full max-w-xl rounded-2xl border border-border bg-card px-6 py-10 text-center shadow-sm sm:px-10">
        <p className="font-heading text-7xl font-semibold text-primary">404</p>
        <h1 className="mt-4 font-heading text-2xl font-semibold sm:text-3xl">
          We couldn&apos;t find that page
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          The page may have moved, or the link may be incorrect. Try returning
          home or browsing our wedding services.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button
            render={<Link href="/" />}
            nativeButton={false}
            size="lg"
          >
            Back to home
          </Button>
          <Button
            render={<Link href="/services" />}
            nativeButton={false}
            size="lg"
            variant="outline"
          >
            Browse services
          </Button>
        </div>
      </section>
    </main>
  );
}

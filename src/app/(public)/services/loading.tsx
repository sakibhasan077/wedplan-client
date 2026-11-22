import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="w-full bg-background pb-10">
      <section className="bg-card px-4 py-6 sm:px-6 sm:py-7">
        <div className="mx-auto max-w-7xl">
          <Skeleton className="h-10 w-72 max-w-full" />
          <Skeleton className="mt-3 h-4 w-full max-w-xl" />

          <div className="mt-6 rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="grid items-end gap-4 md:grid-cols-2 lg:grid-cols-5">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index}>
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="mt-1.5 h-9 w-full" />
                </div>
              ))}
              <Skeleton className="h-9 w-full" />
            </div>
          </div>

          <Skeleton className="mt-5 h-3 w-28" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-5 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-border bg-card"
            >
              <div className="p-4 pb-3">
                <Skeleton className="h-5 w-32" />
              </div>
              <Skeleton className="h-44 w-full rounded-none" />
              <div className="p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="mt-2 h-3 w-24" />
                <div className="mt-3 flex items-center gap-2">
                  <Skeleton className="size-7 rounded-full" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-7 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

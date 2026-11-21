
import type { Metadata } from "next";
import AdminServiceSearchAndFilter from "@/components/dashboard/admin/AdminServiceSearchAndFilter";
import AdminServiceCard from "@/components/dashboard/admin/AdminServiceCard";
import { getAdminServices } from "@/lib/actions/services";
import type { Service } from "@/types/type";

export const metadata: Metadata = {
  title: "Manage Services - WedPlan",
  description: "Review submissions and manage published wedding services.",
};

const AdminServicePage = async({searchParams}:{searchParams: Promise<{ [key: string]: string | string[] | undefined }>}) => {
  const params = await searchParams;
  const query = new URLSearchParams(params as Record<string,string>).toString();
  const servicesData = await getAdminServices(query);
  const services: Service[] = Array.isArray(servicesData)
    ? servicesData
    : [];

  return (
    <main className="p-4 sm:p-6">
      <section className="mx-auto max-w-6xl rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <header className="mb-5">
          <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
            Manage Services
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review submissions and manage published wedding services.
          </p>
        </header>

        <AdminServiceSearchAndFilter />

        <div className="space-y-3">
          {services.map((service) => (
            <AdminServiceCard key={service._id} service={service} />
          ))}

          {services.length === 0 && (
            <div className="rounded-xl border border-border px-4 py-10 text-center text-sm text-muted-foreground">
              No services found.
            </div>
          )}
        </div>

        <p className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
          <span aria-hidden="true">ⓘ</span>
          Only approved and active services appear on Browse Services.
        </p>
      </section>
    </main>
  );
};

export default AdminServicePage;
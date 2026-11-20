import { Button } from "@/components/ui/button";
import VendorServiceList from "@/components/dashboard/vendor/VendorServiceList";
import { getServicesByVendorId } from "@/lib/actions/services";
import { useServerSession } from "@/lib/core/server-session";
import { Service } from "@/types/type";
import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My Services",
  description: "Manage your wedding services and availability.",
};

const ServicesPage = async () => {
  const session = await useServerSession();
  const vendorId = session?.user?.id;
  const servicesData = await getServicesByVendorId(vendorId as string);

  const services: Service[] = Array.isArray(servicesData) ? servicesData : [];

  return (
    <main className="p-4 sm:p-6">
      <div className="mx-auto max-w-295">
        <section className="rounded-xl border border-border bg-card px-5 py-5 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
                My Services
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your wedding services and availability.
              </p>
            </div>

            <Button
              render={<Link href="/dashboard/vendor/services/add" />}
              nativeButton={false}
              size="lg"
              className="shrink-0"
            >
              <Plus />
              <span className="hidden sm:inline">Add Service</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
          <VendorServiceList services={services} />
        </section>
      </div>
    </main>
  );
};

export default ServicesPage;

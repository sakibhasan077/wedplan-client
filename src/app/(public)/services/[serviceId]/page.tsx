import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { getServiceById } from "@/lib/actions/services";
import { getUserById } from "@/lib/actions/users";
import type { Service } from "@/types/type";
import BookingRequestForm from "@/components/services/BookingRequestForm";
import ServiceImageGallery from "@/components/services/ServiceImageGallery";

type VendorDetails = {
  name?: string;
  businessName?: string;
  image?: string;
  location?: string;
  email?: string;
};

const BrowsDetailsPage = async ({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) => {
  const { serviceId } = await params;
  const serviceData = (await getServiceById(serviceId)) as Service | null;
  if (!serviceData) {
    notFound();
  }

  const vendorDetails = await getUserById(serviceData.vendorId);
  const vendor: VendorDetails =
    vendorDetails?.user ?? vendorDetails ?? {};
  const vendorName =
    vendor.businessName || vendor.name || serviceData.vendorName || "Wedding Vendor";
  const images = serviceData.images?.length
    ? serviceData.images
    : serviceData.imageUrl
      ? [serviceData.imageUrl]
      : [];

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:py-8">
      <div className="mx-auto max-w-7xl">
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground"
        >
          <Link href="/" className="hover:text-primary">Home</Link>
          <span aria-hidden="true">&gt;</span>
          <Link href="/services" className="hover:text-primary">Wedding Services</Link>
          <span aria-hidden="true">&gt;</span>
          <span className="text-foreground">{serviceData.serviceName}</span>
        </nav>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)]">
          <div className="space-y-5">
            <ServiceImageGallery
              images={images}
              serviceName={serviceData.serviceName}
            />

            <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                {serviceData.category}
              </p>
              <div className="mt-1 flex flex-wrap items-start justify-between gap-3">
                <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
                  {serviceData.serviceName}
                </h1>
                <p className="text-lg font-semibold text-primary">
                  BDT {Number(serviceData.price).toLocaleString()}
                </p>
              </div>
              <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4 text-primary" aria-hidden="true" />
                {serviceData.location}
              </p>
              <p className="mt-5 whitespace-pre-line text-sm leading-7 text-muted-foreground">
                {serviceData.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
                <span>Wedding service</span>
                <span>{serviceData.category}</span>
                <span>{serviceData.location}</span>
              </div>
            </section>

            <section className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
              {vendor.image ? (
                <Image
                  src={vendor.image}
                  alt=""
                  width={64}
                  height={64}
                  unoptimized
                  className="size-16 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-accent font-heading text-2xl text-accent-foreground">
                  {vendorName.charAt(0).toUpperCase()}
                </span>
              )}
              <div>
                <h2 className="font-heading text-lg font-semibold">
                  {vendorName}
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  A trusted wedding professional offering {serviceData.category.toLowerCase()} services.
                </p>
                {(vendor.location || serviceData.location) && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="size-3.5 text-primary" aria-hidden="true" />
                    {vendor.location || serviceData.location}
                  </p>
                )}
              </div>
            </section>
          </div>

          <BookingRequestForm
            serviceId={serviceData._id}
            vendorId={serviceData.vendorId}
          />
        </div>
      </div>
    </main>
  );
};

export default BrowsDetailsPage;
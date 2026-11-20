import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EditServiceForm from "@/components/dashboard/vendor/EditServiceForm";
import { getServiceById } from "@/lib/actions/services";
import type { Service } from "@/types/type";

export const metadata: Metadata = {
  title: "Edit Service — WedPlan",
  description: "Update the details of your wedding service.",
};

type EditPageProps = {
  params: Promise<{ serviceId: string }>;
};

export default async function EditPage({ params }: EditPageProps) {
  const { serviceId } = await params;
  const service = (await getServiceById(serviceId)) as Service | null;

  if (!service) {
    notFound();
  }

  return <EditServiceForm service={service} />;
}

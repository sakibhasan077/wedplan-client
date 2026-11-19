import type { Metadata } from "next";
import AddServices from "@/components/dashboard/vendor/AddServices";

export const metadata: Metadata = {
  title: "Add a Service — WedPlan",
  description: "Add a wedding service to your WedPlan vendor profile.",
};

export default function AddServicePage() {
  return <AddServices />;
}

import type { Metadata } from "next";
import { ServicesView } from "@/components/pages/ServicesView";
import { fr } from "@/data/translations";

export const metadata: Metadata = {
  title: fr.meta.services.title,
  description: fr.meta.services.description,
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return <ServicesView />;
}

import type { Metadata } from "next";
import { ServicesView } from "@/components/pages/ServicesView";
import { JsonLd } from "@/components/seo/JsonLd";
import { fr } from "@/data/translations";
import { breadcrumb, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: fr.meta.services.title,
  description: fr.meta.services.description,
  path: "/services",
});

const crumbs = breadcrumb([{ name: "Services", path: "/services" }]);

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={crumbs} />
      <ServicesView />
    </>
  );
}

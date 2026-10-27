import type { Metadata } from "next";
import { ContactView } from "@/components/pages/ContactView";
import { JsonLd } from "@/components/seo/JsonLd";
import { fr } from "@/data/translations";
import { breadcrumb, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: fr.meta.contact.title,
  description: fr.meta.contact.description,
  path: "/contact",
});

const crumbs = breadcrumb([{ name: "Contact", path: "/contact" }]);

export default function ContactPage() {
  return (
    <>
      <JsonLd data={crumbs} />
      <ContactView />
    </>
  );
}

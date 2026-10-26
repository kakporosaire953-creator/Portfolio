import type { Metadata } from "next";
import { ContactView } from "@/components/pages/ContactView";
import { fr } from "@/data/translations";

export const metadata: Metadata = {
  title: fr.meta.contact.title,
  description: fr.meta.contact.description,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactView />;
}

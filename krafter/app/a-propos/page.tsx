import type { Metadata } from "next";
import { AboutView } from "@/components/pages/AboutView";
import { fr } from "@/data/translations";

export const metadata: Metadata = {
  title: fr.meta.about.title,
  description: fr.meta.about.description,
  alternates: { canonical: "/a-propos" },
};

export default function AboutPage() {
  return <AboutView />;
}

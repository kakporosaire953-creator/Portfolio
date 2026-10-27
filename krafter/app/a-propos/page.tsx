import type { Metadata } from "next";
import { AboutView } from "@/components/pages/AboutView";
import { JsonLd } from "@/components/seo/JsonLd";
import { fr } from "@/data/translations";
import { breadcrumb, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: fr.meta.about.title,
  description: fr.meta.about.description,
  path: "/a-propos",
});

const crumbs = breadcrumb([{ name: "À propos", path: "/a-propos" }]);

export default function AboutPage() {
  return (
    <>
      <JsonLd data={crumbs} />
      <AboutView />
    </>
  );
}

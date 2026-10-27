import type { Metadata } from "next";
import { SkillsView } from "@/components/pages/SkillsView";
import { JsonLd } from "@/components/seo/JsonLd";
import { fr } from "@/data/translations";
import { breadcrumb, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: fr.meta.skills.title,
  description: fr.meta.skills.description,
  path: "/competences",
});

const crumbs = breadcrumb([{ name: "Compétences", path: "/competences" }]);

export default function SkillsPage() {
  return (
    <>
      <JsonLd data={crumbs} />
      <SkillsView />
    </>
  );
}

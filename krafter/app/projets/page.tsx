import type { Metadata } from "next";
import { ProjectsView } from "@/components/pages/ProjectsView";
import { JsonLd } from "@/components/seo/JsonLd";
import { fr } from "@/data/translations";
import { breadcrumb, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: fr.meta.projects.title,
  description: fr.meta.projects.description,
  path: "/projets",
});

const crumbs = breadcrumb([{ name: "Projets", path: "/projets" }]);

export default function ProjectsPage() {
  return (
    <>
      <JsonLd data={crumbs} />
      <ProjectsView />
    </>
  );
}

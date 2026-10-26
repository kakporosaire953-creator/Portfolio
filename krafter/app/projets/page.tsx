import type { Metadata } from "next";
import { ProjectsView } from "@/components/pages/ProjectsView";
import { fr } from "@/data/translations";

export const metadata: Metadata = {
  title: fr.meta.projects.title,
  description: fr.meta.projects.description,
  alternates: { canonical: "/projets" },
};

export default function ProjectsPage() {
  return <ProjectsView />;
}

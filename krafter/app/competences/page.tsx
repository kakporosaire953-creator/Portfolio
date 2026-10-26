import type { Metadata } from "next";
import { SkillsView } from "@/components/pages/SkillsView";
import { fr } from "@/data/translations";

export const metadata: Metadata = {
  title: fr.meta.skills.title,
  description: fr.meta.skills.description,
  alternates: { canonical: "/competences" },
};

export default function SkillsPage() {
  return <SkillsView />;
}

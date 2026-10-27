import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyView } from "@/components/pages/CaseStudyView";
import { getProject, projects } from "@/data/projects";
import { asset } from "@/lib/utils/asset";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Projet introuvable · THE KRAFTER" };

  return {
    title: `${project.title} · étude de cas · THE KRAFTER`,
    description: project.summary.fr,
    alternates: { canonical: `/projets/${project.slug}` },
    openGraph: {
      title: `${project.title} · THE KRAFTER`,
      description: project.summary.fr,
      images:
        project.cover.kind === "image"
          ? [{ url: project.cover.src, width: project.cover.width, height: project.cover.height }]
          : [asset("/og.jpg")],
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return <CaseStudyView project={project} />;
}

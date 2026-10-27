import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyView } from "@/components/pages/CaseStudyView";
import { JsonLd } from "@/components/seo/JsonLd";
import { getProject, projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { asset } from "@/lib/utils/asset";
import { SITE_URL, breadcrumb, pageMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Projet introuvable · THE KRAFTER", robots: { index: false } };

  const image =
    project.cover.kind === "image"
      ? {
          url: project.cover.src,
          width: project.cover.width,
          height: project.cover.height,
          alt: project.cover.alt.fr,
        }
      : undefined;

  return pageMetadata({
    title: `${project.title} · étude de cas · THE KRAFTER`,
    description: project.summary.fr,
    path: `/projets/${project.slug}`,
    image,
    type: "article",
    keywords: [project.title, ...project.stack, "étude de cas", "design", "développement"],
  });
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const url = `${SITE_URL}/projets/${project.slug}`;
  const image =
    project.cover.kind === "image" ? `${SITE_URL}${asset(project.cover.src)}` : `${SITE_URL}/og.jpg`;

  // A case study is a real, dated creative work: describe it as such.
  const work = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: `${project.title} · ${project.tagline.fr}`,
    description: project.summary.fr,
    url,
    image,
    dateCreated: project.year,
    inLanguage: "fr",
    genre: "Étude de cas",
    creator: {
      "@type": "Person",
      name: profile.fullName,
      url: SITE_URL,
    },
    keywords: project.stack.join(", "),
  };

  return (
    <>
      <JsonLd data={work} />
      <JsonLd data={breadcrumb([
        { name: "Projets", path: "/projets" },
        { name: project.title, path: `/projets/${project.slug}` },
      ])} />
      <CaseStudyView project={project} />
    </>
  );
}

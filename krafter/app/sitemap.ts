import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { SITE_URL } from "@/lib/seo";

// Required so `output: "export"` can prerender this route (GitHub Pages build).
export const dynamic = "force-static";

const ROUTES: { path: string; priority: number; changeFrequency: "monthly" | "weekly" }[] = [
  { path: "", priority: 1, changeFrequency: "monthly" },
  { path: "/projets", priority: 0.9, changeFrequency: "monthly" },
  { path: "/services", priority: 0.8, changeFrequency: "monthly" },
  { path: "/a-propos", priority: 0.7, changeFrequency: "monthly" },
  { path: "/competences", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.4, changeFrequency: "weekly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // The export is regenerated on every publish, so the build stamp is the
  // truthful "last modified" for each document.
  const now = new Date();
  // Canonicals use the trailing-slash URLs the export actually serves.
  const url = (route: string) => `${SITE_URL}${route}/`;

  return [
    ...ROUTES.map((route) => ({
      url: url(route.path),
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...projects.map((project) => ({
      url: url(`/projets/${project.slug}`),
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}

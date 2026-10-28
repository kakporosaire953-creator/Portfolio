import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { SITE_UPDATED, SITE_URL } from "@/lib/seo";

// Required so `output: "export"` can prerender this route (static export build).
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
  // One honest date for the whole site, bumped by hand when content changes.
  // Canonicals use the trailing-slash URLs the export actually serves.
  const lastModified = new Date(`${SITE_UPDATED}T09:00:00Z`);
  const url = (route: string) => `${SITE_URL}${route}/`;

  return [
    ...ROUTES.map((route) => ({
      url: url(route.path),
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...projects.map((project) => ({
      url: url(`/projets/${project.slug}`),
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}

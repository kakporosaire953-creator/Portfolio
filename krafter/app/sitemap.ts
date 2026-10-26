import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";

// Required so `output: "export"` can prerender this route (GitHub Pages build).
export const dynamic = "force-static";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kakpo-rosaire.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/a-propos", "/services", "/projets", "/competences", "/blog", "/contact"];
  const now = new Date();

  return [
    ...routes.map((route) => ({
      url: `${BASE}${route}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
    ...projects.map((project) => ({
      url: `${BASE}/projets/${project.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}

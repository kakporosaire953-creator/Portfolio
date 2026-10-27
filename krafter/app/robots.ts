import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Required so `output: "export"` can prerender this route (GitHub Pages build).
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Nothing secret here, but there is no point crawling the build assets.
        disallow: ["/_next/", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

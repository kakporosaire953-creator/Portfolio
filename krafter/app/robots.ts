import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Required so `output: "export"` can prerender this route (static export build).
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /_next must stay crawlable: Google needs the CSS and JS chunks to
        // render the page. Only an empty API folder is pointless.
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from "@/lib/seo";
import { BASE_PATH } from "@/lib/utils/asset";

// Prerendered with the rest of the export.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_TITLE,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    lang: "fr",
    start_url: `${BASE_PATH}/`,
    scope: `${BASE_PATH}/`,
    display: "standalone",
    background_color: "#faf8f3",
    theme_color: "#faf8f3",
    icons: [
      { src: `${BASE_PATH}/icon-192.png`, sizes: "192x192", type: "image/png", purpose: "any" },
      { src: `${BASE_PATH}/icon-512.png`, sizes: "512x512", type: "image/png", purpose: "any" },
      { src: `${BASE_PATH}/icon-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

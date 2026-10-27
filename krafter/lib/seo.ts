import type { Metadata } from "next";
import { profile } from "@/data/profile";

/**
 * One place for everything search engines and social cards read.
 *
 * The canonical production URL is the GitHub Pages site. Set
 * `NEXT_PUBLIC_SITE_URL` when the portfolio moves to its own domain: every
 * canonical, sitemap entry and Open Graph URL follows automatically.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://kakporosaire953-creator.github.io/Portfolio"
).replace(/\/$/, "");

export const SITE_NAME = "THE KRAFTER";

export const SITE_TITLE = "THE KRAFTER · Rosaire Kakpo · Frontend Developer × UI/UX Designer";

export const SITE_DESCRIPTION =
  "Portfolio de Rosaire Kakpo, THE KRAFTER. Frontend developer et UI/UX designer basé à Cotonou, Bénin : design éditorial, interfaces React et produits numériques.";

export const OG_IMAGE = {
  url: "/og.jpg",
  width: 1200,
  height: 630,
  alt: "THE KRAFTER · Rosaire Kakpo, frontend developer × UI/UX designer",
};

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

type PageMetaInput = {
  title: string;
  description: string;
  /** Route without trailing slash, e.g. "/projets". */
  path: string;
  image?: { url: string; width?: number; height?: number; alt?: string };
  type?: "website" | "article" | "profile";
  keywords?: string[];
};

/**
 * Complete metadata for a page: title, description, canonical, Open Graph and
 * Twitter card. Every page gets all four, so a shared link never falls back to
 * a half-empty card.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  keywords,
}: PageMetaInput): Metadata {
  const url = `${SITE_URL}${path === "/" ? "/" : path}`;
  // Next.js prefixes the deployment base path onto metadata images itself,
  // so these stay root-relative and are never doubled.
  const ogImage = image
    ? {
        url: image.url,
        width: image.width ?? OG_IMAGE.width,
        height: image.height ?? OG_IMAGE.height,
        alt: image.alt ?? title,
      }
    : OG_IMAGE;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: `${SITE_URL}${path === "/" ? "/" : path}` },
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      locale: "fr_FR",
      alternateLocale: ["en_US"],
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}

/** Person + WebSite graph, injected once in the root layout. */
export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: profile.fullName,
        alternateName: SITE_NAME,
        url: SITE_URL,
        image: `${SITE_URL}/images/portrait-hero.jpg`,
        jobTitle: "Frontend developer & UI/UX designer",
        email: `mailto:${profile.email}`,
        sameAs: [profile.github],
        address: {
          "@type": "PostalAddress",
          addressLocality: profile.city,
          addressCountry: "BJ",
        },
        knowsAbout: [
          "Frontend development",
          "UI/UX design",
          "React",
          "Next.js",
          "TypeScript",
          "GSAP",
          "Design systems",
          "E-commerce",
        ],
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: ["fr", "en"],
        description: SITE_DESCRIPTION,
        publisher: { "@id": PERSON_ID },
        author: { "@id": PERSON_ID },
      },
    ],
  };
}

/** Breadcrumb trail for a sub page, so search results show the path. */
export function breadcrumb(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.name,
        item: `${SITE_URL}${item.path}`,
      })),
    ],
  };
}

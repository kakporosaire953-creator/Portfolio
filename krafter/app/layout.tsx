import type { Metadata, Viewport } from "next";
import fs from "node:fs";
import path from "node:path";
import "@fontsource-variable/instrument-sans";
import "@fontsource-variable/instrument-sans/wght-italic.css";
import "@fontsource-variable/bodoni-moda";
import "@fontsource-variable/bodoni-moda/wght-italic.css";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import "./styles/chrome.css";
import "./styles/pages.css";

import { Providers } from "@/components/layout/Providers";
import { SkipLink } from "@/components/layout/SkipLink";
import { SiteHeader } from "@/components/navigation/SiteHeader";
import { VerticalRail } from "@/components/navigation/VerticalRail";
import { Footer } from "@/components/layout/Footer";
import { Assistant } from "@/components/assistant/Assistant";
import { Intro } from "@/components/layout/Intro";
import { ScrollReveals } from "@/components/motion/ScrollReveals";
import { profile } from "@/data/profile";

const SITE_URL = "https://kakpo-rosaire.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "THE KRAFTER — Rosaire Kakpo · Frontend Developer × UI/UX Designer",
    template: "%s",
  },
  description:
    "Portfolio de Rosaire Kakpo — THE KRAFTER. Frontend developer et UI/UX designer basé à Cotonou, Bénin : design éditorial, interfaces React et produits numériques.",
  applicationName: "THE KRAFTER",
  authors: [{ name: profile.fullName, url: profile.github }],
  creator: profile.fullName,
  publisher: profile.fullName,
  keywords: [
    "Rosaire Kakpo",
    "THE KRAFTER",
    "frontend developer Bénin",
    "UI/UX designer Cotonou",
    "React developer",
    "Next.js",
    "portfolio",
    "design éditorial",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: ["en_US"],
    url: SITE_URL,
    siteName: "THE KRAFTER",
    title: "THE KRAFTER — Rosaire Kakpo · Frontend Developer × UI/UX Designer",
    description:
      "Design × Code × Impact. Portfolio de Rosaire Kakpo, frontend developer et UI/UX designer basé au Bénin.",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "THE KRAFTER — Rosaire Kakpo, frontend developer × UI/UX designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "THE KRAFTER — Rosaire Kakpo",
    description: "Design × Code × Impact. Frontend developer × UI/UX designer, Cotonou, Bénin.",
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  category: "design",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF8F3" },
    { media: "(prefers-color-scheme: dark)", color: "#05090E" },
  ],
};

/** Applies the stored theme + language before first paint (no flash). */
const bootScript = `(function(){try{
var d=document.documentElement;
var t=localStorage.getItem('krafter:theme');
if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}
d.dataset.theme=t;d.style.colorScheme=t;
var l=localStorage.getItem('krafter:lang');
if(l!=='fr'&&l!=='en'){l='fr';}
d.lang=l;d.dataset.lang=l;
}catch(e){document.documentElement.dataset.theme='light';}})();`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Rosaire Kakpo",
  alternateName: "THE KRAFTER",
  jobTitle: "Frontend Developer & UI/UX Designer",
  email: `mailto:${profile.email}`,
  url: SITE_URL,
  image: `${SITE_URL}/images/portrait-hero.jpg`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cotonou",
    addressCountry: "BJ",
  },
  sameAs: [profile.github],
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
};

/** The official logo file is honoured as-is when it is present in /public/brand. */
function detectBrandLogo(): boolean {
  const candidates = [
    "the-krafter-logo.svg",
    "the-krafter-logo.png",
    "the-krafter-logo.webp",
  ];
  return candidates.some((file) => {
    try {
      return fs.existsSync(path.join(process.cwd(), "public", "brand", file));
    } catch {
      return false;
    }
  });
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const hasLogo = detectBrandLogo();
  return (
    <html lang="fr" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body id="top">
        <Providers hasLogo={hasLogo}>
          <SkipLink />
          <Intro />
          <SiteHeader />
          <VerticalRail />
          <main id="main" className="page-main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <Assistant />
          <ScrollReveals />
          <div className="noise" aria-hidden="true" />
        </Providers>
      </body>
    </html>
  );
}

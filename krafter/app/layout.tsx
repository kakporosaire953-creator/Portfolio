import type { Metadata, Viewport } from "next";
import "@fontsource-variable/instrument-sans";
import "@fontsource-variable/instrument-sans/wght-italic.css";
import "@fontsource-variable/bodoni-moda";
import "@fontsource-variable/bodoni-moda/wght-italic.css";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import "./styles/chrome.css";
import "./styles/pages.css";
import "./styles/glass.css";
import "./styles/accents.css";
import "./styles/intro.css";

import { Providers } from "@/components/layout/Providers";
import { SkipLink } from "@/components/layout/SkipLink";
import { SiteHeader } from "@/components/navigation/SiteHeader";
import { VerticalRail } from "@/components/navigation/VerticalRail";
import { Footer } from "@/components/layout/Footer";
import { Assistant } from "@/components/assistant/Assistant";
import { Intro } from "@/components/layout/Intro";
import { ScrollReveals } from "@/components/motion/ScrollReveals";
import { CursorFollower } from "@/components/motion/CursorFollower";
import { GlassSheen } from "@/components/motion/GlassSheen";
import { profile } from "@/data/profile";
import { BASE_PATH, asset } from "@/lib/utils/asset";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL, OG_IMAGE, siteGraph } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s",
  },
  description: SITE_DESCRIPTION,
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
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: ["en_US"],
    url: SITE_URL,
    siteName: "THE KRAFTER",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE.url,
        width: OG_IMAGE.width,
        height: OG_IMAGE.height,
        alt: OG_IMAGE.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: asset("/favicon.ico"), sizes: "any" },
      { url: asset("/icon-192.png"), type: "image/png", sizes: "192x192" },
      { url: asset("/icon-512.png"), type: "image/png", sizes: "512x512" },
    ],
    shortcut: asset("/favicon.ico"),
    apple: asset("/apple-icon.png"),
  },
  category: "design",
  manifest: "/manifest.webmanifest",
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // One colour, always: the interface opens light, so the browser chrome does too.
  themeColor: "#FAF8F3",
};

/** Applies the stored theme + language before first paint (no flash). */
const bootScript = `(function(){try{
var d=document.documentElement;
/* The site opens in light mode, always: dark is a choice the visitor makes,
   never something inherited from the operating system. */
var t=localStorage.getItem('krafter:theme');
if(t!=='light'&&t!=='dark'){t='light';}
d.dataset.theme=t;d.style.colorScheme=t;
var l=localStorage.getItem('krafter:lang');
if(l!=='fr'&&l!=='en'){l='fr';}
d.lang=l;d.dataset.lang=l;
/* The opening scene belongs to the front door, once per session. Any other
   route, a returning visit or reduced motion gets the page straight away.
   Decided here, before the first paint, so nothing flashes. */
var root=(document.documentElement.getAttribute('data-base')||'');
var path=location.pathname.replace(/index\.html$/,'');
var home=(path===root+'/'||path===root||path==='/'||path==='');
var seen=false;try{seen=sessionStorage.getItem('krafter:intro-seen')==='1';}catch(e){}
var noMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!home||seen||noMotion){
  d.classList.add('intro-off');
  d.classList.remove('js-mask-pending');
}else{
  d.classList.add('js-mask-pending');
  setTimeout(function(){d.classList.remove('js-mask-pending');},3200);
  /* If any chunk fails after paint, the scroll lock must still release. */
  setTimeout(function(){d.classList.remove('no-scroll');},9000);
}
}catch(e){document.documentElement.dataset.theme='light';document.documentElement.classList.remove('js-mask-pending');}})();`;

const graphJsonLd = siteGraph();


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-theme="light" data-base={BASE_PATH} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(graphJsonLd) }}
        />
      </head>
      <body id="top">
        <Providers>
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
          <CursorFollower />
          <GlassSheen />
          <div className="atmosphere" aria-hidden="true" />
          <div className="noise" aria-hidden="true" />
        </Providers>
      </body>
    </html>
  );
}

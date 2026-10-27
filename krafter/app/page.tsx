import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { SignatureStrip } from "@/components/sections/SignatureStrip";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { DesignCode } from "@/components/sections/DesignCode";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { Process } from "@/components/sections/Process";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { Story } from "@/components/sections/Story";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { ContactBand } from "@/components/sections/ContactBand";
import { fr } from "@/data/translations";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: fr.meta.home.title,
  description: fr.meta.home.description,
  path: "/",
  keywords: [
    "Rosaire Kakpo",
    "THE KRAFTER",
    "portfolio Cotonou",
    "frontend developer Bénin",
    "UI/UX designer Cotonou",
    "Next.js",
    "design éditorial",
  ],
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <SignatureStrip />
      <SelectedWork />
      <DesignCode />
      <ServicesPreview />
      <Process />
      <AboutPreview />
      <Story />
      <BlogPreview />
      <ContactBand />
    </>
  );
}

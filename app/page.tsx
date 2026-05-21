// app/page.tsx – Premium home page layout
import Head from "next/head";

// Component placeholders – implement later
import Hero from "./components/Hero";
import WhatICreate from "./components/WhatICreate";
import Projects from "./components/Projects";
import Lab from "./components/Lab";
import Terminal from "./components/Terminal";
import Skills from "./components/Skills";
import Timeline from "./components/Timeline";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";

export default function Home() {
  return (
    <>
      <Head>
        <title>Rosaire – Ultra‑Premium Frontend Portfolio</title>
        <meta
          name="description"
          content="Rosaire – Creative frontend developer crafting immersive, modern digital experiences."
        />
        <meta name="theme-color" content="#050816" />
      </Head>
      {/* Global dark background – premium palette */}
      <main className="bg-[#050816] text-white min-h-screen flex flex-col">
        <Hero />
        <WhatICreate />
        <Projects />
        <Lab />
        <Terminal />
        <Skills />
        <Timeline />
        <Testimonials />
        <Contact />
      </main>
    </>
  );
}

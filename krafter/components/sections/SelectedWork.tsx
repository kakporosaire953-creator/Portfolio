"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { WorkCard } from "@/components/projects/WorkCard";
import { featuredProjects } from "@/data/projects";
import { SectionHead } from "./SectionHead";
import { ArrowRight } from "@/components/navigation/Glyphs";

export function SelectedWork() {
  const { t } = useLocale();

  return (
    <section className="section" aria-labelledby="selected-work-title">
      <div className="shell">
        <SectionHead
          index={t.home.selected.index}
          kicker={t.home.selected.kicker}
          meta={<span className="meta">{t.home.selected.meta}</span>}
        >
          <h2 className="title-1" id="selected-work-title" data-reveal-lines>
            {t.home.selected.title}
          </h2>
        </SectionHead>

        <div className="work-grid" data-reveal-stagger>
          {featuredProjects.map((project, index) => (
            <WorkCard key={project.slug} project={project} wide={index === 0} priority={index === 0} />
          ))}
        </div>

        <div className="work-grid__all">
          <Link href="/projets" className="arrow-link">
            {t.common.viewAllProjects}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

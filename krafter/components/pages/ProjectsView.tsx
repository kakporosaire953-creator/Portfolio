"use client";

import { useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { PageHead } from "@/components/layout/PageHead";
import { ProjectFlipLink } from "@/components/motion/ProjectFlipLink";
import { ProjectCover, projectCoverSrc } from "@/components/projects/ProjectCover";
import { ContactBand } from "@/components/sections/ContactBand";
import { ArrowRight } from "@/components/navigation/Glyphs";
import { projects, type ProjectCategory } from "@/data/projects";

type Filter =
  | { group: "root"; id: "all" }
  | { group: "roles"; id: ProjectCategory; label: "design" | "development" | "designOnly" };

const FILTERS: Filter[] = [
  { group: "root", id: "all" },
  { group: "roles", id: "design-code", label: "design" },
  { group: "roles", id: "development", label: "development" },
  { group: "roles", id: "art-direction", label: "designOnly" },
];

export function ProjectsView() {
  const { t, locale } = useLocale();
  const [filter, setFilter] = useState<"all" | ProjectCategory>("all");

  const visible = filter === "all" ? projects : projects.filter((project) => project.category === filter);

  // Only offer filters that can actually return something: a dead filter is a
  // dead button. Derived from the published set, never hard-coded.
  const availableFilters = FILTERS.filter(
    (item) => item.group === "root" || projects.some((project) => project.category === item.id),
  );

  return (
    <>
      <PageHead
        index="04"
        kicker={t.projects.kicker}
        title={
          <>
            {t.projects.title}
            <em>.</em>
          </>
        }
        lede={t.projects.intro}
        meta={[
          { label: t.projects.kicker, value: `${projects.length}` },
          { label: t.projects.caseStudy.year, value: "2024 / 2026" },
          { label: t.contact.locationLabel, value: "Cotonou, Bénin" },
        ]}
      />

      <div className="shell">
        <div className="projects-toolbar">
          <div className="projects-filters" role="group" aria-label={t.projects.filterLabel}>
            {availableFilters.map((item) => (
              <button
                key={item.id}
                type="button"
                className="projects-filter"
                aria-pressed={filter === item.id}
                onClick={() => setFilter(item.id)}
              >
                {item.group === "root" ? t.projects.all : t.projects.roles[item.label]}
              </button>
            ))}
          </div>
          <span className="projects-count">
            {String(visible.length).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </span>
        </div>

        <div className="projects-grid" data-reveal-stagger>
          {visible.map((project) => (
            <article className="project-card" key={project.slug} data-reveal-item>
              <ProjectFlipLink
                href={`/projets/${project.slug}`}
                slug={project.slug}
                imageSrc={projectCoverSrc(project)}
                className="project-card__cover"
                ariaLabel={`${project.title} · ${t.common.viewCase}`}
                cursorLabel={t.common.cursorView}
              >
                <ProjectCover project={project} />
                <span className="project-card__index">{project.index}</span>
                <span className="sr-only">{project.title}</span>
              </ProjectFlipLink>

              <div>
                <div className="project-card__info">
                  <h2 className="project-card__title">{project.title}</h2>
                  <span className="project-card__year">{project.year}</span>
                </div>
                <p className="project-card__tagline">{project.tagline[locale]}</p>
                <div className="project-card__foot">
                  <div className="project-card__stack">
                    {project.stack.slice(0, 4).map((tech) => (
                      <span className="tag" key={tech}>
                        {tech}
                      </span>
                    ))}
                  </div>
                  <span className="project-card__cta">
                    {t.common.viewCase}
                    <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>

      <ContactBand />
    </>
  );
}

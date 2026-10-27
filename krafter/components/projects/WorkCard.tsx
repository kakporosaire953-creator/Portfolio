"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { ProjectFlipLink } from "@/components/motion/ProjectFlipLink";
import { ProjectCover, projectCoverSrc } from "./ProjectCover";
import { ArrowRight } from "@/components/navigation/Glyphs";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils/cn";

export function WorkCard({
  project,
  wide = false,
  priority = false,
}: {
  project: Project;
  wide?: boolean;
  priority?: boolean;
}) {
  const { t, locale } = useLocale();
  const href = `/projets/${project.slug}`;

  return (
    <article className={cn("work-card", wide && "work-card--wide")} data-reveal-item>
      <ProjectFlipLink
        href={href}
        slug={project.slug}
        imageSrc={projectCoverSrc(project)}
        className="work-card__cover"
        ariaLabel={`${project.title} · ${t.common.viewCase}`}
      >
        <ProjectCover project={project} priority={priority} />
        <span className="work-card__index">{project.index}</span>
        <span className="sr-only">{project.title}</span>
      </ProjectFlipLink>

      <div className="work-card__body">
        <div>
          <div className="work-card__head">
            <h3 className="work-card__title">
              <Link href={href}>{project.title}</Link>
            </h3>
            <span className="work-card__year">
              {project.year} · {t.projects.roles[project.category === "art-direction" ? "designOnly" : project.category === "development" ? "development" : "design"]}
            </span>
          </div>
          <p className="work-card__tagline">{project.tagline[locale]}</p>
        </div>

        <div>
          <div className="work-card__meta">
            {project.stack.slice(0, 4).map((tech) => (
              <span key={tech} className="tag">
                {tech}
              </span>
            ))}
          </div>
          <Link href={href} className="work-card__cta">
            {t.common.viewCase}
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </article>
  );
}

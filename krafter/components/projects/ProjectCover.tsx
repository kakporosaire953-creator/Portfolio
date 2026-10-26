"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils/cn";

/**
 * Real screenshot when one is published; otherwise a clearly designed
 * typographic cover (never a fake product screenshot).
 */
export function ProjectCover({
  project,
  className,
  priority = false,
}: {
  project: Project;
  className?: string;
  priority?: boolean;
}) {
  const { locale } = useLocale();
  const cover = project.cover;

  if (cover.kind === "image") {
    return (
      <span className={cn("project-cover-media", className)} data-flip-media>
        {/* eslint-disable-next-line @next/next/no-img-element -- local optimised asset */}
        <img
          src={cover.src}
          alt={cover.alt[locale]}
          width={cover.width}
          height={cover.height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      </span>
    );
  }

  return (
    <span className={cn("project-cover-media", className)} data-flip-media>
      <span className={cn("graphic-cover", `graphic-cover--${cover.tone}`)}>
        <span className="graphic-cover__grid" aria-hidden="true" />
        <span className="graphic-cover__arc" aria-hidden="true" />
        <span className="graphic-cover__label">{cover.label}</span>
        <span className="graphic-cover__sub">{project.stack.join(" · ")}</span>
      </span>
    </span>
  );
}

export function projectCoverSrc(project: Project): string | undefined {
  return project.cover.kind === "image" ? project.cover.src : undefined;
}

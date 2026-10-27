"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ProjectCover } from "@/components/projects/ProjectCover";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SectionHead } from "./SectionHead";
import { ArrowRight } from "@/components/navigation/Glyphs";
import { gsap, ScrollTrigger } from "@/lib/animations/gsap/register";
import { useReducedMotion } from "@/lib/utils/useReducedMotion";
import { useMediaQuery } from "@/lib/utils/useMediaQuery";
import { projects, type Project } from "@/data/projects";
import { cn } from "@/lib/utils/cn";

/**
 * KRAFTER / GALLERY IN MOTION
 *
 * The case studies never sit still: two rows of glass plates travel in
 * opposite directions, and the scroll decides their speed and their direction.
 * Hovering a plate pauses its row and lets the other one carry the movement,
 * so the section breathes instead of spinning.
 *
 * Two GSAP tweens, transforms only, no pin, no layout read in the scroll
 * handler. Touch and reduced-motion visitors get the same content as a plain
 * horizontal reel with snap points.
 */

const ROWS = [
  { direction: -1, duration: 34, tone: "orange" },
  { direction: 1, duration: 46, tone: "blue" },
] as const;

export function ProjectReel() {
  const { t, locale } = useLocale();
  const reduced = useReducedMotion();
  const isTouch = useMediaQuery("(hover: none), (pointer: coarse)");
  const still = reduced || isTouch;

  const rowsRef = useRef<HTMLDivElement>(null);
  const tweensRef = useRef<gsap.core.Tween[]>([]);
  const hoveredRowRef = useRef<number | null>(null);
  const velocityRef = useRef(0);
  const [hovered, setHovered] = useState<string | null>(null);

  const rows = useMemo(
    () => [
      { items: projects, ...ROWS[0] },
      { items: [...projects].reverse(), ...ROWS[1] },
    ],
    [],
  );

  useEffect(() => {
    if (still) return;
    const root = rowsRef.current;
    if (!root) return;

    const tracks = Array.from(root.querySelectorAll<HTMLElement>("[data-reel-track]"));

    const tweens = tracks.map((track, index) => {
      const row = ROWS[index] ?? ROWS[0];
      // Two copies of the list: travelling exactly 50% loops seamlessly.
      const from = row.direction === -1 ? 0 : -50;
      const to = from + 50 * row.direction;
      gsap.set(track, { xPercent: from });
      return gsap.to(track, {
        xPercent: to,
        duration: row.duration,
        ease: "none",
        repeat: -1,
      });
    });
    tweensRef.current = tweens;

    // Scroll velocity drives the gallery: faster downhill, rewinds uphill.
    const apply = () => {
      const velocity = velocityRef.current;
      const boost = 1 + Math.min(Math.abs(velocity) / 2400, 3);
      tweens.forEach((tween, index) => {
        if (hoveredRowRef.current === index) {
          tween.timeScale(0.06);
          return;
        }
        tween.timeScale(velocity < -40 ? -boost * 0.7 : boost);
      });
    };

    const trigger = ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        velocityRef.current = self.getVelocity();
        apply();
      },
    });

    // The wheel stops, the drift settles back to its own pace.
    const settle = () => {
      if (velocityRef.current === 0) return;
      velocityRef.current *= 0.93;
      if (Math.abs(velocityRef.current) < 10) velocityRef.current = 0;
      apply();
    };
    gsap.ticker.add(settle);

    return () => {
      gsap.ticker.remove(settle);
      trigger.kill();
      tweens.forEach((tween) => tween.kill());
      tweensRef.current = [];
    };
  }, [still]);

  const pauseRow = useCallback(
    (rowIndex: number, pause: boolean) => {
      if (still) return;
      hoveredRowRef.current = pause ? rowIndex : null;
      velocityRef.current = 0;
      const tween = tweensRef.current[rowIndex];
      if (!tween) return;
      tween.timeScale(pause ? 0.06 : 1);
    },
    [still],
  );

  return (
    <section className="section reel" aria-labelledby="selected-work-title">
      <div className="shell">
        <SectionHead
          index={t.home.selected.index}
          kicker={t.home.selected.kicker}
          meta={<span className="meta">{t.home.selected.meta}</span>}
        >
          <SplitHeading as="h2" className="title-1" id="selected-work-title">
            {t.home.selected.title}
          </SplitHeading>
        </SectionHead>
      </div>

      <div className={cn("reel__rows", hovered && "is-focused")} ref={rowsRef}>
        {rows.map((row, rowIndex) => (
          <div
            className={cn("reel__row", `reel__row--${row.tone}`, still && "is-still")}
            key={`row-${rowIndex}`}
          >
            <ul
              className="reel__track"
              data-reel-track
              role="list"
              aria-label={rowIndex === 0 ? t.projects.kicker : undefined}
              aria-hidden={rowIndex > 0 || undefined}
            >
              {[...row.items, ...row.items].map((project, index) => {
                // Row 1 is the real navigation, row 2 is a visual echo: only the
                // first row is focusable and announced, so the tab order and the
                // screen-reader reading stay honest.
                const clone = index >= row.items.length;
                return (
                  <li
                    className="reel__item"
                    key={`${rowIndex}-${project.slug}-${index}`}
                    aria-hidden={clone || rowIndex > 0 || undefined}
                  >
                    <ReelCard
                      project={project}
                      clone={clone}
                      decorative={rowIndex > 0}
                      hovered={hovered}
                      onHover={setHovered}
                      onRowHover={(pause) => pauseRow(rowIndex, pause)}
                      locale={locale}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="shell reel__foot">
        <p className="meta reel__hint">
          {still ? t.home.selected.reelHintStill : t.home.selected.reelHint}
        </p>
        <Link href="/projets" className="arrow-link">
          {t.common.viewAllProjects}
          <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}

function ReelCard({
  project,
  clone,
  decorative,
  hovered,
  onHover,
  onRowHover,
  locale,
}: {
  project: Project;
  clone: boolean;
  decorative: boolean;
  hovered: string | null;
  onHover: (slug: string | null) => void;
  onRowHover: (pause: boolean) => void;
  locale: "fr" | "en";
}) {
  const { t } = useLocale();
  const dimmed = hovered !== null && hovered !== project.slug;

  return (
    <Link
      href={`/projets/${project.slug}`}
      className={cn("reel__card liquid", dimmed && "is-dimmed")}
      data-glass
      data-cursor={t.common.cursorView}
      aria-label={`${project.title} · ${t.common.viewCase}`}
      tabIndex={clone || decorative ? -1 : undefined}
      onPointerEnter={() => {
        onHover(project.slug);
        onRowHover(true);
      }}
      onPointerLeave={() => {
        onHover(null);
        onRowHover(false);
      }}
      onFocus={() => onHover(project.slug)}
      onBlur={() => onHover(null)}
    >
      <span className="reel__media">
        <ProjectCover project={project} />
        <span className="reel__index num">{project.index}</span>
      </span>
      <span className="reel__caption">
        <span className="reel__title">{project.title}</span>
        <span className="reel__tagline">{project.tagline[locale]}</span>
        <span className="reel__meta">
          <span>{project.year}</span>
        </span>
      </span>
    </Link>
  );
}

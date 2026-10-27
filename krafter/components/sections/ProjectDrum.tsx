"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ProjectCover } from "@/components/projects/ProjectCover";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SectionHead } from "./SectionHead";
import { ArrowRight } from "@/components/navigation/Glyphs";
import { gsap, ScrollTrigger } from "@/lib/animations/gsap/register";
import { useGsap } from "@/lib/animations/gsap/useGsap";
import { useReducedMotion } from "@/lib/utils/useReducedMotion";
import { useMediaQuery } from "@/lib/utils/useMediaQuery";
import { projects, type Project } from "@/data/projects";
import { cn } from "@/lib/utils/cn";

/**
 * KRAFTER / TURNTABLE
 *
 * The three case studies are mounted as glass plates on a vertical drum. Scroll
 * rotates the drum: the front plate faces the reader, the two others recede at
 * an angle with real depth, and an orange arc shows how far the turntable has
 * turned. It is driven by one ScrollTrigger and one tween reading a single
 * number, so nothing loops in the background and nothing blocks the scroll.
 *
 * Below 900px, or with reduced motion, the same projects become a swipeable
 * reel: no pin, no 3D, everything readable.
 */
const ANGLE = 46;

export function ProjectDrum() {
  const { t, locale } = useLocale();
  const reduced = useReducedMotion();
  const compact = useMediaQuery("(max-width: 899px)");
  const [active, setActive] = useState(0);
  const scopeRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<{ p: number }>({ p: 0 });
  const drive = useRef<gsap.core.Tween | null>(null);

  const count = projects.length;
  const ease = compact || reduced;

  const place = useCallback(
    (p: number) => {
      const scope = scopeRef.current;
      if (!scope) return;
      const plates = scope.querySelectorAll<HTMLElement>("[data-plate]");
      const half = count / 2;
      plates.forEach((plate, index) => {
        // Shortest signed distance on the ring, so the drum always turns forward.
        let d = ((index - p) % count + count) % count;
        if (d > half) d -= count;
        const abs = Math.abs(d);
        const depth = Math.min(abs, 1.6);
        // Side plates slide out, tip away and sink: the drum keeps real depth.
        plate.style.transform = `translate(-50%, -50%) translate3d(${d * 62}%, 0, ${-depth * 300}px) rotateY(${-d * ANGLE}deg) scale(${1 - depth * 0.13})`;
        plate.style.opacity = String(Math.max(0.18, 1 - depth * 0.62));
        plate.style.zIndex = String(10 - Math.round(depth * 6));
        plate.style.pointerEvents = abs > 0.55 ? "none" : "auto";
        plate.style.filter = abs > 0.45 ? `blur(${(depth * 1.6).toFixed(2)}px)` : "none";
      });
    },
    [count],
  );

  useGsap(
    (scope) => {
      if (ease) return;
      const stage = stageRef.current;
      const pin = pinRef.current;
      if (!stage || !pin) return;

      const tween = gsap.to(stateRef.current, {
        p: count - 1,
        ease: "none",
        snap: "p",
        onUpdate: () => {
          place(stateRef.current.p);
          const next = Math.round(stateRef.current.p);
          setActive((current) => (current === next ? current : next));
        },
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * (count - 0.2))}`,
          pin: stage,
          pinSpacing: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      drive.current = tween;
      place(0);

      return () => {
        drive.current = null;
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    [count, ease, place],
    scopeRef,
  );

  // Reduced motion and small screens: no pin, no 3D, plates laid out flat.
  useEffect(() => {
    if (!ease) return;
    const scope = scopeRef.current;
    if (!scope) return;
    scope.querySelectorAll<HTMLElement>("[data-plate]").forEach((plate) => {
      plate.style.transform = "";
      plate.style.opacity = "";
      plate.style.zIndex = "";
      plate.style.filter = "";
      plate.style.pointerEvents = "";
    });
  }, [ease]);

  const goTo = (index: number) => {
    const total = count - 1;
    const target = Math.min(total, Math.max(0, index));
    const tween = drive.current;
    const trigger = tween?.scrollTrigger;
    if (tween && trigger) {
      const span = trigger.end - trigger.start;
      window.scrollTo({
        top: trigger.start + (span * target) / Math.max(1, total),
        behavior: "smooth",
      });
      return;
    }
    // Flat layouts: scroll the reel or the page to the matching card.
    const scope = scopeRef.current;
    const card = scope?.querySelectorAll<HTMLElement>("[data-plate]")[target];
    card?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    setActive(target);
  };

  return (
    <div className="drum" ref={scopeRef}>
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

      <div className={cn("drum__body", ease && "is-flat")} ref={pinRef}>
        <div className="drum__stage" ref={stageRef}>
          <span className="drum__halo" aria-hidden="true" />
          <span className="drum__floor" aria-hidden="true" />

          <div className="drum__chrome">
            <span className="meta drum__chrome-label">{t.home.selected.kicker}</span>
            <span className="meta drum__chrome-meta">{t.home.selected.meta}</span>
          </div>

          <ul className="drum__ring" role="list">
            {projects.map((project, index) => (
              <li className="drum__plate" key={project.slug} data-plate>
                <DrumCard project={project} active={!ease && index === active} />
              </li>
            ))}
          </ul>

          <p className="drum__now" aria-live="polite">
            <span className="drum__now-title" key={`${locale}-${active}`}>
              {projects[active]?.title}
            </span>
            <span className="meta drum__now-role">{projects[active]?.role[locale]}</span>
          </p>

          {!ease ? (
            <div className="drum__controls">
              <button
                type="button"
                className="drum__arrow"
                onClick={() => goTo(active - 1)}
                aria-label={t.common.previous}
                disabled={active === 0}
              >
                <ArrowRight size={15} className="drum__arrow-icon drum__arrow-icon--back" />
              </button>
              <p className="drum__count">
                <span className="num">{String(active + 1).padStart(2, "0")}</span>
                <span className="drum__count-sep" aria-hidden="true" />
                <span className="num drum__count-total">{String(count).padStart(2, "0")}</span>
              </p>
              <button
                type="button"
                className="drum__arrow"
                onClick={() => goTo(active + 1)}
                aria-label={t.common.next}
                disabled={active === count - 1}
              >
                <ArrowRight size={15} />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="shell drum__foot">
        <Link href="/projets" className="arrow-link">
          {t.common.viewAllProjects}
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

function DrumCard({ project, active }: { project: Project; active: boolean }) {
  const { t, locale } = useLocale();
  const href = `/projets/${project.slug}`;

  return (
    <Link
      href={href}
      className={cn("drum__card liquid", active && "is-active")}
      data-glass
      aria-label={`${project.title} · ${t.common.viewCase}`}
      data-cursor={t.common.cursorView}
      tabIndex={active ? 0 : -1}
    >
      <span className="drum__media">
        <ProjectCover project={project} />
        <span className="drum__index num">{project.index}</span>
        <span className="drum__seam" aria-hidden="true" />
      </span>

      <span className="drum__caption">
        <span className="drum__title">{project.title}</span>
        <span className="drum__tagline">{project.tagline[locale]}</span>
        <span className="drum__stack">
          {project.stack.slice(0, 3).map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </span>
      </span>
    </Link>
  );
}

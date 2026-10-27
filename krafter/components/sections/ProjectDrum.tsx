"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ProjectCover } from "@/components/projects/ProjectCover";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SectionHead } from "./SectionHead";
import { ArrowRight } from "@/components/navigation/Glyphs";
import { gsap } from "@/lib/animations/gsap/register";
import { useReducedMotion } from "@/lib/utils/useReducedMotion";
import { useMediaQuery } from "@/lib/utils/useMediaQuery";
import { projects, type Project } from "@/data/projects";
import { cn } from "@/lib/utils/cn";

/**
 * KRAFTER / TURNTABLE
 *
 * The project section, back to a real turntable: the case studies sit on an
 * invisible cylinder, the one in front is the one you read, the others turn
 * away into depth. Drag it, use the arrows, the keyboard or the buttons; it
 * snaps to the nearest plate. It loops, so there is no dead end.
 *
 * Everything is transform and opacity on already-painted cards: no pin, no
 * scroll hijack, vertical scroll always wins on touch. Reduced motion and
 * touch get a plain horizontal reel with snap points, same content, no spin.
 */

const ANGLE = 18; // degrees between plates
const DEPTH = 150; // how far a plate recedes per step
const SPACING = 0.78; // plate spacing, as a fraction of its width
const AUTOPLAY = 0.085; // cards per second when idle

const wrap = (index: number, count: number) => {
  const half = count / 2;
  let value = index;
  while (value > half) value -= count;
  while (value < -half) value += count;
  return value;
};

export function ProjectDrum() {
  const { t, locale } = useLocale();
  const reduced = useReducedMotion();
  const isTouch = useMediaQuery("(hover: none), (pointer: coarse)");
  const isNarrow = useMediaQuery("(max-width: 767px)");
  // Three real projects on a cylinder is a desktop gesture. Phones and tablets
  // get the same cards as a snap reel: no cramped 3D, no vertical scroll loss.
  const still = reduced || isTouch || isNarrow;

  const count = projects.length;
  const viewportRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const platesRef = useRef<(HTMLDivElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);

  const offset = useRef(0); // in cards, continuous
  const tween = useRef<gsap.core.Tween | null>(null);
  const drag = useRef({ active: false, startX: 0, startOffset: 0, lastX: 0, velocity: 0 });
  const hovered = useRef(false);
  const inView = useRef(true);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  const layout = useRef({ spacing: 380, depth: DEPTH });


  const apply = useCallback(() => {
    const { spacing, depth } = layout.current;
    const value = offset.current;

    projects.forEach((project, index) => {
      const plate = platesRef.current[index];
      if (!plate) return;
      const base = index;
      const delta = wrap(base - value, count);
      const abs = Math.abs(delta);
      const x = delta * spacing;
      const z = -abs * depth;
      const rotate = -delta * ANGLE;
      const front = Math.max(0, 1 - abs / 1.6);

      plate.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(2)}px,0,${z.toFixed(
        2,
      )}px) rotateY(${rotate.toFixed(2)}deg)`;
      plate.style.opacity = (0.2 + 0.8 * front).toFixed(3);
      plate.style.zIndex = String(100 - Math.round(abs * 10));
      plate.dataset.front = front > 0.6 ? "true" : "false";
      void project;
    });

    const index = ((Math.round(value) % count) + count) % count;
    // apply() runs on every frame: only touch React when the plate changes.
    if (index !== activeRef.current) {
      activeRef.current = index;
      setActive(index);
      if (counterRef.current) {
        counterRef.current.textContent = String(index + 1).padStart(2, "0");
      }
    }
  }, [count]);

  const measure = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const first = platesRef.current[0];
    const width = first?.offsetWidth ?? 340;
    layout.current.spacing = width * SPACING;
    apply();
  }, [apply]);

  const goTo = useCallback(
    (target: number, duration = 0.85) => {
      tween.current?.kill();
      if (still) {
        offset.current = target;
        apply();
        return;
      }
      tween.current = gsap.to(offset, {
        current: target,
        duration,
        ease: "power3.out",
        onUpdate: apply,
      });
    },
    [apply, still],
  );

  const step = useCallback(
    (direction: number) => {
      const nearest = Math.round(offset.current);
      goTo(nearest + direction);
    },
    [goTo],
  );

  // Rotation + idle drift.
  useEffect(() => {
    if (still) return;
    measure();

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const idle = !drag.current.active && !hovered.current && inView.current && !tween.current?.isActive();
      if (idle) {
        offset.current += AUTOPLAY * dt;
        apply();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
      },
      { threshold: 0.15 },
    );
    if (viewportRef.current) observer.observe(viewportRef.current);

    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", measure);
      tween.current?.kill();
    };
  }, [apply, measure, still]);

  // Drag, in both axes-friendly steps: horizontal only, vertical scroll intact.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || still) return;

    const onDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      drag.current = {
        active: true,
        startX: event.clientX,
        startOffset: offset.current,
        lastX: event.clientX,
        velocity: 0,
      };
      tween.current?.kill();
      viewport.setPointerCapture(event.pointerId);
      viewport.dataset.dragging = "true";
    };

    const onMove = (event: PointerEvent) => {
      if (!drag.current.active) return;
      const dx = event.clientX - drag.current.startX;
      const perCard = layout.current.spacing || 340;
      offset.current = drag.current.startOffset - dx / perCard;
      drag.current.velocity = (event.clientX - drag.current.lastX) / perCard;
      drag.current.lastX = event.clientX;
      apply();
    };

    const onUp = (event: PointerEvent) => {
      if (!drag.current.active) return;
      drag.current.active = false;
      delete viewport.dataset.dragging;
      if (viewport.hasPointerCapture(event.pointerId)) {
        viewport.releasePointerCapture(event.pointerId);
      }
      // Momentum, then a firm snap: the plate always lands centred.
      const target = Math.round(offset.current - drag.current.velocity * 1.6);
      goTo(target, 0.75);
    };

    viewport.addEventListener("pointerdown", onDown);
    viewport.addEventListener("pointermove", onMove);
    viewport.addEventListener("pointerup", onUp);
    viewport.addEventListener("pointercancel", onUp);
    return () => {
      viewport.removeEventListener("pointerdown", onDown);
      viewport.removeEventListener("pointermove", onMove);
      viewport.removeEventListener("pointerup", onUp);
      viewport.removeEventListener("pointercancel", onUp);
    };
  }, [apply, goTo, still]);

  // Keyboard: the section behaves like a listbox with living arrows.
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (still) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    }
  };

  const progress = count > 1 ? (active + 1) / count : 1;

  return (
    <section className="section drum" aria-labelledby="selected-work-title">
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

      <div
        className={cn("drum__viewport", still && "is-still")}
        ref={viewportRef}
        onPointerEnter={() => (hovered.current = true)}
        onPointerLeave={() => (hovered.current = false)}
        onKeyDown={onKeyDown}
        role="group"
        aria-roledescription={t.home.selected.drumRole}
        aria-label={t.home.selected.kicker}
        tabIndex={0}
      >
        <div className="drum__stage" ref={stageRef}>
          {projects.map((project, index) => (
            <div
              className="drum__plate"
              key={project.slug}
              ref={(node) => {
                platesRef.current[index] = node;
              }}
              data-index={index}
            >
              <DrumCard
                project={project}
                locale={locale}
                onFocus={() => !still && goTo(index, 0.7)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={cn("shell drum__controls", still && "is-still")}>
        {still ? (
          <p className="meta drum__hint">{t.home.selected.hint}</p>
        ) : (
          <>
        <div className="drum__nav">
          <button
            type="button"
            className="drum__arrow"
            onClick={() => step(-1)}
            aria-label={t.home.selected.prev}
          >
            <ArrowRight size={15} className="drum__arrow-icon drum__arrow-icon--prev" />
          </button>
          <span className="drum__counter meta" aria-live="polite">
            <span ref={counterRef}>01</span>
            <span className="drum__counter-sep">/</span>
            <span>{String(count).padStart(2, "0")}</span>
          </span>
          <button
            type="button"
            className="drum__arrow"
            onClick={() => step(1)}
            aria-label={t.home.selected.next}
          >
            <ArrowRight size={15} />
          </button>
        </div>

        <div className="drum__rail" aria-hidden="true">
          <span className="drum__rail-fill" style={{ transform: `scaleX(${progress})` }} />
        </div>
          </>
        )}

        <Link href="/projets" className="arrow-link drum__all">
          {t.common.viewAllProjects}
          <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}

function DrumCard({
  project,
  locale,
  onFocus,
}: {
  project: Project;
  locale: "fr" | "en";
  onFocus: () => void;
}) {
  const { t } = useLocale();
  return (
    <Link
      href={`/projets/${project.slug}`}
      className="drum__card liquid"
      data-glass
      data-cursor={t.common.cursorView}
      aria-label={`${project.title} · ${t.common.viewCase}`}
      onFocus={onFocus}
    >
      <span className="drum__media">
        <ProjectCover project={project} priority />
        <span className="drum__index num">{project.index}</span>
      </span>
      <span className="drum__caption">
        <span className="drum__head">
          <span className="drum__title">{project.title}</span>
          <span className="drum__year meta">{project.year}</span>
        </span>
        <span className="drum__tagline">{project.tagline[locale]}</span>
        <span className="drum__stack">
          {project.stack.slice(0, 3).map((item) => (
            <span className="tag" key={item}>
              {item}
            </span>
          ))}
        </span>
        <span className="drum__case">
          {t.common.viewCase}
          <ArrowRight size={13} />
        </span>
      </span>
    </Link>
  );
}

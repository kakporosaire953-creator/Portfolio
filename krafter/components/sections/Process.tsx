"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SectionHead } from "./SectionHead";
import { useGsap } from "@/lib/animations/gsap/useGsap";
import { gsap, ScrollTrigger } from "@/lib/animations/gsap/register";
import { useReducedMotion } from "@/lib/utils/useReducedMotion";
import { SculptureStage } from "@/components/three/SculptureStage";
import { cn } from "@/lib/utils/cn";

/** Fine line icons, one per step. Decorative: the label carries the meaning. */
function StepIcon({ index }: { index: number }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
  };

  if (index === 0) {
    // Cadrage: a frame and its centre.
    return (
      <svg {...common}>
        <path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16" />
        <circle cx="12" cy="12" r="3.2" />
      </svg>
    );
  }
  if (index === 1) {
    // Direction: a compass rose.
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 4v2.4M12 17.6V20M4 12h2.4M17.6 12H20" />
        <path d="m14.6 9.4-1.8 4.2-4.2 1.8 1.8-4.2z" />
      </svg>
    );
  }
  if (index === 2) {
    // Construction: stacked layers.
    return (
      <svg {...common}>
        <path d="m12 4 7.5 4L12 12 4.5 8z" />
        <path d="m4.5 12.4 7.5 4 7.5-4" />
        <path d="m4.5 16.6 7.5 4 7.5-4" />
      </svg>
    );
  }
  // Livraison: a sealed box and its check.
  return (
    <svg {...common}>
      <path d="M4 8.4 12 4l8 4.4v7.2L12 20l-8-4.4z" />
      <path d="m8.6 10.6 2.6 2.6 4.2-4.2" />
    </svg>
  );
}

export function Process() {
  const { t, locale } = useLocale();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);
  const steps = t.home.process.steps;

  // WebGL only for visitors who scroll this far: the chunk is not even
  // requested before that, and never at all with reduced motion.
  const [atmosphere, setAtmosphere] = useState(false);

  useEffect(() => {
    if (reduced || !sectionRef.current) return;
    // Phones get no second WebGL context: the section already carries its own
    // gradients, and the timeline is what matters at that width.
    if (window.matchMedia("(max-width: 767px)").matches) return;
    const target = sectionRef.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAtmosphere(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(target);
    return () => io.disconnect();
  }, [reduced]);

  useGsap(
    () => {
      if (reduced) return;
      const flow = flowRef.current;
      if (!flow) return;

      const cards = gsap.utils.toArray<HTMLElement>("[data-step-card]", flow);
      const markers = gsap.utils.toArray<HTMLElement>("[data-step-marker]", flow);
      const axis = flow.querySelector<HTMLElement>("[data-axis-fill]");

      // 1. The axis draws itself over the whole traversal, once.
      if (axis) {
        gsap.fromTo(
          axis,
          { clipPath: "inset(0% 0% 100% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: {
              trigger: flow,
              start: "top 78%",
              end: "bottom 72%",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          },
        );
      }

      // 2. Each step enters from its own side, then its content settles.
      cards.forEach((card, index) => {
        const step = card.closest<HTMLElement>("[data-step]");
        if (!step) return;
        const fromLeft = step.dataset.side === "left";
        const connector = step.querySelector<HTMLElement>("[data-connector]");
        const parts = step.querySelectorAll<HTMLElement>("[data-step-part]");

        // One gesture per step, in reading order: the marker lands on the
        // line, the connector joins it to the card, the card arrives from its
        // own side, then its copy settles. Total just over a second.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: step,
            start: "top 86%",
            once: true,
          },
          defaults: { ease: "power3.out" },
        });

        const ribbonNum = step.querySelector<HTMLElement>("[data-ribbon-num]");

        tl.fromTo(
          markers[index] ?? [],
          { scaleY: 0, autoAlpha: 0, transformOrigin: "50% 0%" },
          { scaleY: 1, autoAlpha: 1, duration: 0.62 },
        )
          // Opacity only: the number carries its own rotation, which a GSAP
          // transform would overwrite.
          .fromTo(ribbonNum, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.42 }, "-=0.3")
          .fromTo(
            connector,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.55, ease: "power2.inOut" },
            0.1,
          )
          .fromTo(
            card,
            { x: fromLeft ? -30 : 30, y: 16, autoAlpha: 0 },
            { x: 0, y: 0, autoAlpha: 1, duration: 0.7 },
            0.16,
          )
          .fromTo(
            parts,
            { y: 10, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.055 },
            0.4,
          );
      });

      // 3. One active marker at a time: the last step whose top has crossed the
      //    reading line. Derived from the layout, never from toggle order, so a
      //    resize or a jump down the page always lands on the right step.
      const allSteps = gsap.utils.toArray<HTMLElement>("[data-step]", flow);
      let current = -1;
      const setCurrent = (index: number) => {
        if (index === current) return;
        current = index;
        allSteps.forEach((step, i) => {
          step.classList.toggle("is-current", i === index);
          step.querySelector("[data-step-marker]")?.classList.toggle("is-active", i === index);
        });
      };

      let frame = 0;
      const syncCurrent = () => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          const line = window.innerHeight * 0.58;
          let index = 0;
          allSteps.forEach((step, i) => {
            if (step.getBoundingClientRect().top <= line) index = i;
          });
          setCurrent(index);
        });
      };

      const watcher = ScrollTrigger.create({
        trigger: flow,
        start: "top bottom",
        end: "bottom top",
        onUpdate: syncCurrent,
        onRefresh: syncCurrent,
      });
      syncCurrent();

      return () => {
        cancelAnimationFrame(frame);
        watcher.kill();
      };
    },
    [locale, reduced],
    sectionRef,
  );

  // Pointer motion: subtle, desktop only, no re-render. The lift is driven by
  // GSAP rather than CSS so it composes with the tilt instead of being
  // overridden by the transform the entrance timeline leaves inline.
  const canHover = () =>
    !reduced && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const onCardPointerEnter = (event: ReactPointerEvent<HTMLElement>) => {
    if (!canHover()) return;
    gsap.to(event.currentTarget, {
      y: -4,
      duration: 0.55,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const onCardPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (!canHover()) return;
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width - 0.5;
    const ny = (event.clientY - rect.top) / rect.height - 0.5;
    gsap.to(card, {
      y: -4,
      rotateY: nx * 2.4,
      rotateX: -ny * 2,
      transformPerspective: 900,
      duration: 0.5,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const onCardPointerLeave = (event: ReactPointerEvent<HTMLElement>) => {
    gsap.to(event.currentTarget, {
      y: 0,
      rotateY: 0,
      rotateX: 0,
      duration: 0.7,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  return (
    <section
      className="section-tight process"
      aria-labelledby="process-title"
      ref={sectionRef}
    >
      <div className="shell">
        <SectionHead index={t.home.process.index} kicker={t.home.process.kicker}>
          <h2 className="title-2" id="process-title">
            {t.home.process.title}
          </h2>
          <p className="body-sm process__intro">{t.home.process.intro}</p>
        </SectionHead>

        <div className="process-flow" ref={flowRef}>
          {atmosphere ? (
            <SculptureStage model="liquid-core" mode="visible" className="process-flow__atmosphere" />
          ) : null}

          {/* The axis is a single line for the whole flow; the fill follows scroll. */}
          <span className="process-axis" aria-hidden="true">
            <span className="process-axis__fill" data-axis-fill />
          </span>

          <ol className="process-steps">
            {steps.map((step, index) => {
              const side = index % 2 === 0 ? "left" : "right";
              return (
                <li
                  className={cn("process-step", `process-step--${side}`)}
                  key={step.label}
                  data-step
                  data-side={side}
                >
                  <span
                    className="num-band process-step__ribbon"
                    data-step-marker
                    aria-hidden="true"
                  >
                    <span className="num-band__num" data-ribbon-num>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </span>

                  <span className="process-step__connector" aria-hidden="true">
                    <span className="process-step__connector-line" data-connector />
                  </span>

                  <article
                    className="process-step__card liquid"
                    data-step-card
                    data-glass
                    onPointerEnter={onCardPointerEnter}
                    onPointerMove={onCardPointerMove}
                    onPointerLeave={onCardPointerLeave}
                  >
                    <header className="process-step__head">
                      <span className="process-step__icon" data-step-part aria-hidden="true">
                        <StepIcon index={index} />
                      </span>
                      <span className="process-step__index meta" data-step-part>
                        {String(index + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
                      </span>
                    </header>

                    <h3 className="process-step__title" data-step-part>
                      {step.label}
                    </h3>
                    <p className="process-step__text" data-step-part>
                      {step.text}
                    </p>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

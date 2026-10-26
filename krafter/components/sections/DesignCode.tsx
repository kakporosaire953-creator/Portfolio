"use client";

import { useCallback, useRef, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { DesignCodePanel } from "./DesignCodePanels";
import { useGsap } from "@/lib/animations/gsap/useGsap";
import { gsap, ScrollTrigger } from "@/lib/animations/gsap/register";
import { useReducedMotion } from "@/lib/utils/useReducedMotion";
import { cn } from "@/lib/utils/cn";
import { ArrowDown } from "@/components/navigation/Glyphs";

/**
 * DESIGN × CODE — scroll-driven chapter.
 * Desktop: the composition stays put while the five stages progress
 * (CSS sticky, no scroll hijacking). Mobile: plain vertical progression.
 */
export function DesignCode() {
  const { t } = useLocale();
  const { steps } = t.home.designCode;
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const scopeRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGsap(
    (scope) => {
      const track = trackRef.current;
      if (reduced || !track) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        let current = -1;
        const triggers: ScrollTrigger[] = [];

        const calculation = () => {
          const rect = track.getBoundingClientRect();
          const total = track.offsetHeight - window.innerHeight;
          if (total <= 0) return;
          const progress = Math.min(1, Math.max(0, -rect.top / total));
          const index = Math.min(steps.length - 1, Math.floor(progress * steps.length));
          if (index !== current) {
            current = index;
            setActive(index);
          }
        };

        const trigger = ScrollTrigger.create({
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          onUpdate: calculation,
          onRefresh: calculation,
        });
        triggers.push(trigger);
        calculation();

        return () => {
          triggers.forEach((instance) => instance.kill());
        };
      });

      return () => mm.revert();
    },
    [reduced, steps.length],
    scopeRef,
  );

  const goToStep = useCallback(
    (index: number) => {
      setActive(index);
      const track = trackRef.current;
      if (!track) return;
      const total = track.offsetHeight - window.innerHeight;
      const top = window.scrollY + track.getBoundingClientRect().top + (total * (index + 0.5)) / steps.length;
      window.scrollTo({ top, behavior: "smooth" });
    },
    [steps.length],
  );

  return (
    <section className="designcode" ref={scopeRef} aria-labelledby="designcode-title">
      <div
        className="designcode__track"
        ref={trackRef}
        style={{ ["--dc-steps" as string]: steps.length }}
      >
        <div className="designcode__sticky">
          <div className="shell designcode__inner">
            <div className="designcode__left">
              <span className="section-index meta">
                {t.home.designCode.index} / {t.home.designCode.kicker}
              </span>
              <h2 className="title-1 designcode__title" id="designcode-title">
                {t.home.designCode.title}
              </h2>
              <p className="lede designcode__intro">{t.home.designCode.intro}</p>

              <div className="designcode__steps">
                {steps.map((step, index) => (
                  <button
                    key={step.id}
                    type="button"
                    className={cn("designcode__step", index === active && "is-active")}
                    onClick={() => goToStep(index)}
                    aria-current={index === active ? "step" : undefined}
                  >
                    <span className="designcode__step-index">0{index + 1}</span>
                    <span className="designcode__step-label">
                      {step.label}
                      <span className="designcode__step-caption">{step.caption}</span>
                    </span>
                    <span className="designcode__step-dot" aria-hidden="true" />
                    <span className="designcode__step-text">{step.text}</span>
                  </button>
                ))}
              </div>

              <span className="designcode__hint">
                <ArrowDown size={12} />
                {t.home.designCode.hint}
              </span>
            </div>

            <div className="designcode__visual">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={cn("designcode__panel", index === active && "is-active")}
                  aria-hidden={index === active ? undefined : true}
                >
                  <DesignCodePanel id={step.id} />
                </div>
              ))}
              <span className="designcode__visual-index num" aria-hidden="true">
                0{active + 1} / 0{steps.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="designcode__mobile shell">
        <span className="section-index meta">
          {t.home.designCode.index} / {t.home.designCode.kicker}
        </span>
        <h2 className="title-1 designcode__title">{t.home.designCode.title}</h2>
        <p className="lede designcode__intro" style={{ marginBottom: "2rem" }}>
          {t.home.designCode.intro}
        </p>

        <div className="designcode__mobile-list">
          {steps.map((step, index) => (
            <div className="designcode__mobile-item" key={`m-${step.id}`} data-reveal>
              <div className="designcode__mobile-head">
                <span className="designcode__mobile-label">{step.label}</span>
                <span className="meta">
                  0{index + 1} · {step.caption}
                </span>
              </div>
              <div className="designcode__mobile-visual">
                <DesignCodePanel id={step.id} />
              </div>
              <p className="designcode__mobile-text">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useRef } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { OrbitStage } from "@/components/three/OrbitStage";
import { ArrowRight, ArrowDown } from "@/components/navigation/Glyphs";
import { Magnetic } from "@/components/motion/Magnetic";
import { useGsap } from "@/lib/animations/gsap/useGsap";
import { gsap } from "@/lib/animations/gsap/register";
import { useReducedMotion } from "@/lib/utils/useReducedMotion";
import { whenIntroIdle } from "@/lib/utils/introState";
import { asset } from "@/lib/utils/asset";

/**
 * Hero.
 *
 * Deliberately sparse: the name, the role, one sentence, two doors and the
 * city. Everything that used to compete here (disciplines, availability,
 * paragraphs, badges) now lives in the sections below, so the first screen can
 * breathe. Whitespace carries the composition.
 */
export function Hero() {
  const { t } = useLocale();
  const reduced = useReducedMotion();
  const scopeRef = useRef<HTMLElement>(null);

  useGsap(
    (scope) => {
      if (reduced) return;

      const lines = scope.querySelectorAll<HTMLElement>("[data-hero-name] .line-mask > span");
      const roleLines = scope.querySelectorAll<HTMLElement>("[data-hero-role] .line-mask > span");
      const statementLines = scope.querySelectorAll<HTMLElement>("[data-hero-statement] .line-mask > span");
      const portrait = scope.querySelector("[data-hero-portrait]");
      const orbit = scope.querySelector("[data-hero-orbit]");
      const ctas = scope.querySelectorAll<HTMLElement>("[data-hero-cta] > *");
      const place = scope.querySelector("[data-hero-place]");
      const rule = scope.querySelector("[data-hero-rule]");

      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });

      tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.85, ease: "power3.inOut" })
        .from(lines, { yPercent: 112, duration: 1.15, stagger: 0.1 }, 0.15)
        .from(roleLines, { yPercent: 110, duration: 0.9 }, 0.5)
        .fromTo(
          portrait,
          { clipPath: "inset(100% 0% 0% 0%)", scale: 1.06 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            duration: 1.35,
            ease: "power3.inOut",
            clearProps: "clipPath,scale",
          },
          0.35,
        )
        .from(orbit, { autoAlpha: 0, scale: 0.94, duration: 1.4 }, 0.3)
        .from(statementLines, { yPercent: 110, duration: 0.95 }, 0.95)
        .from(ctas, { autoAlpha: 0, y: 18, duration: 0.7, stagger: 0.08 }, 1.2)
        .from(place, { autoAlpha: 0, y: 10, duration: 0.6 }, 1.4);

      // Wait for KRAFTER / ASSEMBLY so the hero never animates behind it.
      const cancel = whenIntroIdle(() => tl.play(0));

      // Desktop only: the portrait and the orbit drift against the pointer,
      // which gives the composition real depth without touching the scroll.
      const mm = gsap.matchMedia();
      mm.add("(hover: hover) and (pointer: fine)", () => {
        if (!portrait || !orbit) return;
        const portraitX = gsap.quickTo(portrait, "x", { duration: 0.9, ease: "power3.out" });
        const portraitY = gsap.quickTo(portrait, "y", { duration: 0.9, ease: "power3.out" });
        const orbitX = gsap.quickTo(orbit, "x", { duration: 1.2, ease: "power3.out" });
        const orbitY = gsap.quickTo(orbit, "y", { duration: 1.2, ease: "power3.out" });

        const onMove = (event: PointerEvent) => {
          const rect = scope.getBoundingClientRect();
          if (rect.bottom < 0) return;
          const nx = (event.clientX - rect.left) / rect.width - 0.5;
          const ny = (event.clientY - rect.top) / rect.height - 0.5;
          portraitX(gsap.utils.clamp(-1, 1, nx) * 16);
          portraitY(gsap.utils.clamp(-1, 1, ny) * 12);
          orbitX(gsap.utils.clamp(-1, 1, nx) * -9);
          orbitY(gsap.utils.clamp(-1, 1, ny) * -7);
        };

        window.addEventListener("pointermove", onMove, { passive: true });
        return () => {
          window.removeEventListener("pointermove", onMove);
          gsap.killTweensOf([portrait, orbit]);
        };
      });

      return () => {
        cancel();
        tl.kill();
        mm.revert();
      };
    },
    [reduced],
    scopeRef,
  );

  return (
    <section className="hero" ref={scopeRef} aria-labelledby="hero-title">
      <div className="hero__blueprint blueprint" aria-hidden="true" />
      <span className="hero__rule" data-hero-rule aria-hidden="true" />

      <div className="shell hero__inner">
        <div className="hero__copy">
          <h1 className="hero__name" id="hero-title" data-hero-name>
            <span className="line-mask hero__name-line">
              <span>{t.hero.firstName}</span>
            </span>
            <span className="line-mask hero__name-line hero__name-line--serif">
              <span>
                {t.hero.lastName}
                <span className="hero__name-dot">.</span>
              </span>
            </span>
          </h1>

          <p className="hero__role" data-hero-role>
            <span className="line-mask">
              <span>{t.hero.role}</span>
            </span>
          </p>

          <p className="hero__statement" data-hero-statement>
            <span className="line-mask">
              <span>{t.hero.statement}</span>
            </span>
          </p>

          <div className="hero__ctas" data-hero-cta>
            <Magnetic>
              <Link href="/projets" className="btn btn--orange">
                {t.common.ctaProjects}
                <ArrowRight size={14} />
              </Link>
            </Magnetic>
            <Link href="/a-propos" className="btn btn--ghost">
              {t.common.ctaAbout}
            </Link>
          </div>

          <p className="hero__place meta" data-hero-place>
            <span className="status-dot" aria-hidden="true" />
            {t.common.location}
          </p>
        </div>

        <div className="hero__visual">
          <OrbitStage className="hero__orbit" data-parallax="0.05" />
          <figure className="hero__portrait" data-hero-portrait>
            {/* eslint-disable-next-line @next/next/no-img-element -- hero asset */}
            <img
              src={asset("/images/portrait-hero.jpg")}
              alt={t.hero.portraitAlt}
              width={1254}
              height={1254}
              className="hero__portrait-img"
              fetchPriority="high"
              decoding="async"
            />
          </figure>
        </div>
      </div>

      <div className="shell hero__foot">
        <span className="meta hero__scroll-hint">
          {t.hero.scrollHint}
          <span className="hero__scroll-line" aria-hidden="true" />
          <ArrowDown size={12} />
        </span>
      </div>
    </section>
  );
}

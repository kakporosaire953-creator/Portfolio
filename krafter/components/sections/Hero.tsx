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
      const facts = scope.querySelectorAll<HTMLElement>("[data-hero-fact]");
      const badge = scope.querySelector("[data-hero-badge]");
      const domains = scope.querySelectorAll<HTMLElement>("[data-hero-domain] > li");
      const rule = scope.querySelector("[data-hero-rule]");
      const sideNote = scope.querySelector("[data-hero-sidenote]");

      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });

      tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.85, ease: "power3.inOut" })
        .from(lines, { yPercent: 112, duration: 1.15, stagger: 0.1 }, 0.15)
        .from(roleLines, { yPercent: 110, duration: 0.9 }, 0.5)
        .from(sideNote, { autoAlpha: 0, duration: 0.8 }, 0.6)
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
        .from(statementLines, { yPercent: 110, duration: 0.95, stagger: 0.09 }, 0.95)
        .from(domains, { autoAlpha: 0, y: 10, duration: 0.5, stagger: 0.05 }, 1.1)
        .from(facts, { autoAlpha: 0, y: 16, duration: 0.7, stagger: 0.08 }, 1.15)
        .from(ctas, { autoAlpha: 0, y: 18, duration: 0.7, stagger: 0.08 }, 1.25)
        .from(badge, { autoAlpha: 0, y: 14, duration: 0.7 }, 1.45);

      // Wait for KRAFTER / ASSEMBLY so the hero never animates behind it.
      const cancel = whenIntroIdle(() => tl.play(0));
      return () => {
        cancel();
        tl.kill();
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
          <p className="kicker hero__eyebrow">{t.hero.eyebrow}</p>

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

          <ul className="hero__statement" data-hero-statement>
            {t.hero.lines.map((line, index) => (
              <li key={line}>
                <span className="hero__statement-index num">0{index + 1}</span>
                <span className="line-mask">
                  <span>{line}</span>
                </span>
              </li>
            ))}
          </ul>

          <p className="hero__intro lede">{t.hero.intro}</p>

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

          <ul className="hero__domains" data-hero-domain>
            {t.hero.domains.map((domain) => (
              <li key={domain}>{domain}</li>
            ))}
          </ul>

          <dl className="hero__facts">
            <div className="hero__fact" data-hero-fact>
              <dt className="meta">{t.hero.basedIn}</dt>
              <dd>{t.hero.basedInValue}</dd>
            </div>
            <div className="hero__fact" data-hero-fact>
              <dt className="meta">{t.hero.working}</dt>
              <dd>{t.hero.workingValue}</dd>
            </div>
          </dl>
        </div>

        <div className="hero__visual">
          <OrbitStage className="hero__orbit" />
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
            <figcaption className="hero__caption meta">{t.hero.portraitCaption}</figcaption>
          </figure>

          <div className="hero__badge" data-hero-badge>
            <span className="hero__badge-line" aria-hidden="true" />
            <span className="meta">{t.common.concept}</span>
          </div>

          <p className="hero__sidenote meta" data-hero-sidenote>
            {t.common.signatureLine}
          </p>
        </div>
      </div>

      <div className="shell hero__foot">
        <span className="meta hero__scroll-hint">
          {t.hero.scrollHint}
          <span className="hero__scroll-line" aria-hidden="true" />
          <ArrowDown size={12} />
        </span>
        <span className="meta">{t.hero.sceneLabel}</span>
      </div>
    </section>
  );
}

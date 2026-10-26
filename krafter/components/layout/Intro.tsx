"use client";

import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { gsap, registerGsap } from "@/lib/animations/gsap/register";
import { drawPaths } from "@/lib/animations/anime/draw";
import { useReducedMotion } from "@/lib/utils/useReducedMotion";
import { setIntroPlaying } from "@/lib/utils/introState";

const SESSION_KEY = "krafter:intro-seen";

/**
 * KRAFTER / ASSEMBLY — brand intro.
 * 01 VOID → 02 FIRST LINE → 03 GEOMETRY → 04 STRUCTURE → 05 BRAND →
 * 06 LIQUID MATERIAL → 07 PERSON → 08 HOMEPAGE
 *
 * Entirely client-side: with JS disabled or reduced motion the site is simply
 * accessible. GSAP orchestrates the sequence, anime.js draws the independent
 * SVG paths, and a hard timeout guarantees the overlay always leaves.
 */
export function Intro() {
  const { t } = useLocale();
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const animeRef = useRef<{ revert?: () => void } | null>(null);

  // Decide whether to play — once per session, never with reduced motion.
  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen || reduced) {
      setIntroPlaying(false);
      return;
    }
    setIntroPlaying(true);
    setPlaying(true);
  }, [reduced]);

  useEffect(() => {
    if (!playing) return;
    const root = rootRef.current;
    if (!root) return;

    registerGsap();
    document.documentElement.classList.add("no-scroll");
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const finish = () => {
      document.documentElement.classList.remove("no-scroll");
      try {
        window.sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
      setIntroPlaying(false);
      setPlaying(false);
    };

    const failsafe = window.setTimeout(finish, 9500);

    const ctx = gsap.context(() => {
      const line = root.querySelector("[data-intro-rule]");
      const voidLabel = root.querySelectorAll("[data-intro-void]");
      const geometry = root.querySelector("[data-intro-geometry]");
      const logo = root.querySelector("[data-intro-logo]");
      const shine = root.querySelector("[data-intro-shine]");
      const portrait = root.querySelector("[data-intro-portrait]");
      const footer = root.querySelector("[data-intro-foot]");
      const stage = root.querySelector("[data-intro-stage]");

      gsap.set(portrait, { clipPath: "inset(0% 0% 100% 0%)" });
      gsap.set(logo, { clipPath: "inset(0% 0% 100% 0%)" });
      gsap.set(shine, { xPercent: -120, opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: finish,
      });
      timelineRef.current = tl;

      // 01 — VOID
      tl.to(voidLabel, { autoAlpha: 1, duration: 0.45, stagger: 0.08 })
        // 02 — FIRST LINE
        .fromTo(
          line,
          { scaleX: 0 },
          { scaleX: 1, duration: isMobile ? 0.4 : 0.7, ease: "power2.inOut" },
          "-=0.15",
        );

      if (!isMobile) {
        // 03 — GEOMETRY (anime.js owns these paths)
        tl.add(() => {
          const paths = root.querySelectorAll<SVGGeometryElement>("[data-intro-path]");
          if (paths.length > 0) {
            animeRef.current = drawPaths(paths, { duration: 1200, stagger: 55 });
          }
          gsap.to(geometry, { opacity: 1, duration: 0.4 });
        }, "+=0.05");

        // 04 — STRUCTURE
        tl.to(
          "[data-intro-node]",
          { autoAlpha: 1, scale: 1, duration: 0.5, stagger: 0.06, ease: "back.out(1.7)" },
          "+=0.5",
        );
      } else {
        tl.to(geometry, { opacity: 1, duration: 0.3 }, "-=0.1");
      }

      // 05 — BRAND
      tl.to(logo, { clipPath: "inset(0% 0% 0% 0%)", duration: isMobile ? 0.5 : 0.85, ease: "power3.inOut" }, "+=0.15");

      if (!isMobile) {
        // 06 — LIQUID MATERIAL
        tl.to(shine, { opacity: 1, duration: 0.2 }, "-=0.25")
          .to(shine, { xPercent: 130, duration: 1.05, ease: "power2.inOut" }, "-=0.1")
          .to(shine, { opacity: 0, duration: 0.25 }, "-=0.25");
      }

      // 07 — PERSON
      tl.to(
        portrait,
        { clipPath: "inset(0% 0% 0% 0%)", duration: isMobile ? 0.5 : 0.95, ease: "power3.inOut" },
        isMobile ? "-=0.15" : "-=0.45",
      );

      // 08 — HOMEPAGE
      tl.to(footer, { autoAlpha: 1, duration: 0.3 }, "-=0.3")
        .to(
          stage,
          { scale: isMobile ? 1.02 : 1.06, opacity: 0, duration: 0.5, ease: "power2.inOut" },
          "+=0.12",
        )
        .to(root, { autoAlpha: 0, duration: 0.42, ease: "power1.inOut" }, "-=0.16");
    }, root);

    const skip = () => {
      timelineRef.current?.kill();
      gsap.to(root, { autoAlpha: 0, duration: 0.3, onComplete: finish });
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        skip();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(failsafe);
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("no-scroll");
      animeRef.current?.revert?.();
      animeRef.current = null;
      ctx.revert();
      timelineRef.current = null;
      setIntroPlaying(false);
    };
  }, [playing]);

  if (!playing) return null;

  return (
    <div className="intro" ref={rootRef} aria-label={t.intro.label} role="presentation">
      <div className="intro__grid" aria-hidden="true" />
      <div className="intro__stage" data-intro-stage>
        <div className="intro__void">
          <span className="intro__void-left" data-intro-void>
            {t.intro.void}
          </span>
          <span className="intro__void-right" data-intro-void>
            01 — 08
          </span>
        </div>

        <span className="intro__rule" data-intro-rule aria-hidden="true" />

        <div className="intro__core">
          <svg
            className="intro__geometry"
            viewBox="0 0 520 520"
            fill="none"
            aria-hidden="true"
            data-intro-geometry
          >
            <g stroke="rgba(245,242,234,0.42)" strokeWidth="1">
              <path data-intro-path d="M60 60 L260 260 L460 60" />
              <path data-intro-path d="M60 200 L260 400 L460 200" />
              <path data-intro-path d="M260 40 L260 480" />
              <path data-intro-path d="M60 260 L460 260" />
            </g>
            <g stroke="#ff6a00" strokeWidth="1.4">
              <path data-intro-path d="M36 484 A244 244 0 0 1 484 484" />
              <path data-intro-path d="M110 300 L260 150 L410 300" />
            </g>
            <g fill="#ff6a00">
              <circle data-intro-node cx="260" cy="150" r="4" opacity="0" />
              <circle data-intro-node cx="110" cy="300" r="3" opacity="0" />
              <circle data-intro-node cx="410" cy="300" r="3" opacity="0" />
              <circle data-intro-node cx="260" cy="260" r="2.4" opacity="0" />
            </g>
            <circle cx="260" cy="260" r="196" stroke="rgba(245,242,234,0.14)" strokeWidth="1" strokeDasharray="2 7" />
          </svg>

          <div className="intro__logo" data-intro-logo>
            <BrandLogo variant="brand" />
          </div>

          <div className="intro__portrait" data-intro-portrait>
            {/* eslint-disable-next-line @next/next/no-img-element -- intro reveal, no layout hints needed */}
            <img src="/images/portrait-hero.jpg" alt="" width={1254} height={1254} />
          </div>

          <span className="intro__shine" data-intro-shine aria-hidden="true" />
        </div>

        <div className="intro__foot" data-intro-foot>
          <span className="meta">{t.hero.role}</span>
          <span className="meta">{t.intro.person}</span>
        </div>
      </div>

      <button
        type="button"
        className="intro__skip"
        onClick={() => {
          timelineRef.current?.kill();
          const root = rootRef.current;
          if (!root) return;
          gsap.to(root, {
            autoAlpha: 0,
            duration: 0.3,
            onComplete: () => {
              document.documentElement.classList.remove("no-scroll");
              try {
                window.sessionStorage.setItem(SESSION_KEY, "1");
              } catch {
                /* ignore */
              }
              setIntroPlaying(false);
              setPlaying(false);
            },
          });
        }}
      >
        {t.intro.skip}
        <span aria-hidden="true">ESC</span>
      </button>
    </div>
  );
}

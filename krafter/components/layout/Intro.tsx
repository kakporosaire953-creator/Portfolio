"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { MarkGlyph } from "@/components/brand/MarkGlyph";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { gsap, registerGsap } from "@/lib/animations/gsap/register";
import { useReducedMotion } from "@/lib/utils/useReducedMotion";
import { hasSceneReady, markSceneReady, setIntroPlaying } from "@/lib/utils/introState";

const LogoAssembly = dynamic(
  () => import("@/components/three/LogoAssembly").then((mod) => mod.LogoAssembly),
  { ssr: false },
);

/**
 * KRAFTER / ASSEMBLY, the first thing the site shows.
 *
 * The overlay is server rendered, so the very first paint is the loader, never
 * a flash of the homepage underneath. The monogram poster (real traced geometry)
 * is already there before any JavaScript; three.js then takes over and
 * assembles the same mark in 3D.
 *
 * The percentage is not decorative: it moves on real readiness signals
 * (fonts, page load, first WebGL frame) and the overlay only leaves once all
 * three are in. Escape, the skip button, or a five second failsafe end it
 * early. Reduced motion never sees it.
 */

const MIN_VISIBLE = 2200; // ms, enough to see the mark assemble
const FAILSAFE = 6000;

export function Intro() {
  const { t } = useLocale();
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const exitRef = useRef<(() => void) | null>(null);

  const finish = useCallback(() => {
    const root = rootRef.current;
    document.documentElement.classList.remove("no-scroll");
    setIntroPlaying(false);
    if (!root) {
      setMounted(false);
      return;
    }
    registerGsap();
    // The timeline is the pretty exit; this timeout is the guarantee. Neither
    // the visitor nor the page should ever depend on animation frames running.
    window.setTimeout(() => setMounted(false), 1100);
    gsap
      .timeline({
        onComplete: () => setMounted(false),
      })
      .to(root.querySelectorAll("[data-intro-fade]"), {
        autoAlpha: 0,
        y: -14,
        duration: 0.4,
        stagger: 0.04,
        ease: "power2.in",
      })
      .to(
        root,
        {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.75,
          ease: "power4.inOut",
        },
        "-=0.15",
      );
  }, []);

  exitRef.current = finish;

  useEffect(() => {
    // The boot script decides before paint: non-home routes, a session that
    // already saw the scene, and reduced motion never mount it.
    if (reduced || document.documentElement.classList.contains("intro-off")) {
      setMounted(false);
      setIntroPlaying(false);
      return;
    }

    setIntroPlaying(true);
    document.documentElement.classList.add("no-scroll");
    const start = performance.now();

    // Readiness, not theatre: the bar is the sum of what is actually ready.
    // fonts 30, page load 30, first WebGL frame 40. It never claims more.
    const signals = { fonts: false, load: false, scene: false };
    let promised = 0; // what is unlocked
    let progress = 0; // what is painted, eased toward promised
    let exited = false;
    let timer = 0;
    let lastTick = performance.now();

    const exit = () => {
      if (exited) return;
      exited = true;
      window.clearInterval(timer);
      try {
        sessionStorage.setItem("krafter:intro-seen", "1");
      } catch {
        /* private mode, ignore */
      }
      finish();
    };

    const paint = () => {
      const value = Math.round(progress);
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress / 100})`;
      if (pctRef.current) pctRef.current.textContent = `${String(value).padStart(3, "0")}%`;
      rootRef.current?.setAttribute("aria-valuenow", String(value));
    };

    const tick = () => {
      const elapsed = performance.now() - start;
      if (hasSceneReady()) signals.scene = true;
      promised = (signals.fonts ? 30 : 0) + (signals.load ? 30 : 0) + (signals.scene ? 40 : 0);
      // Paint towards what is ready, with a floor that keeps the bar alive while
      // the first chunk downloads (never above 12 % though: no fake progress).
      const floor = Math.min((elapsed / MIN_VISIBLE) * 12, 12);
      const target = Math.max(promised, floor);
      // Seconds, not frames: a throttled tab must still reach the end.
      const dt = Math.min((performance.now() - lastTick) / 1000, 1);
      lastTick = performance.now();
      progress += (target - progress) * Math.min(1, dt * 4.5);
      if (Math.abs(target - progress) < 0.5) progress = target;
      paint();

      const ready = signals.fonts && signals.load && signals.scene;
      if (ready && promised >= 100 && progress > 99.2 && elapsed >= MIN_VISIBLE) {
        progress = 100;
        paint();
        window.clearInterval(timer);
        window.setTimeout(exit, 380);
      }
    };
    // setInterval, not requestAnimationFrame: a loader has to finish even when
    // the page is not producing frames (background tab, throttled compositor).
    timer = window.setInterval(tick, 90);
    tick();

    const failsafe = window.setTimeout(exit, FAILSAFE);

    // Each signal is honest, and each one has a bounded wait: a slow font or a
    // missing WebGL must never trap the visitor behind the overlay.
    signals.fonts = !document.fonts || document.fonts.status === "loaded";
    document.fonts?.ready.then(() => {
      signals.fonts = true;
    });
    const fontTimeout = window.setTimeout(() => {
      signals.fonts = true;
    }, 1500);

    signals.load = document.readyState === "complete";
    const onLoad = () => {
      signals.load = true;
    };
    window.addEventListener("load", onLoad, { once: true });
    const loadTimeout = window.setTimeout(() => {
      signals.load = true;
    }, 1800);

    const onScene = () => {
      signals.scene = true;
    };
    window.addEventListener("krafter:intro-scene-ready", onScene);
    const sceneTimeout = window.setTimeout(onScene, 2400);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        exit();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      window.clearInterval(timer);
      window.clearTimeout(failsafe);
      window.clearTimeout(sceneTimeout);
      window.clearTimeout(fontTimeout);
      window.clearTimeout(loadTimeout);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("krafter:intro-scene-ready", onScene);
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("no-scroll");
    };
  }, [reduced, finish]);

  const onSceneReady = useCallback(() => {
    // The canvas is painting: fade it over the poster.
    const root = rootRef.current;
    if (root) {
      const canvas = root.querySelector(".intro__canvas");
      const poster = root.querySelector("[data-intro-poster]");
      if (canvas) canvas.classList.add("is-live");
      if (poster) poster.classList.add("is-behind");
    }
    markSceneReady();
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="intro"
      ref={rootRef}
      data-intro
      role="status"
      aria-label={t.intro.label}
      aria-live="polite"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    >
      <div className="intro__grid" aria-hidden="true" />
      <div className="intro__glow" aria-hidden="true" />

      <header className="intro__top" data-intro-fade>
        <span className="intro__tag">{t.intro.void}</span>
        <span className="intro__tag intro__tag--right">Portfolio · 2026</span>
      </header>

      <div className="intro__stage">
        <div className="intro__poster" data-intro-poster aria-hidden="true">
          <MarkGlyph className="intro__mark" />
        </div>
        <LogoAssembly className="intro__canvas" onReady={onSceneReady} />
      </div>

      <div className="intro__mid" data-intro-fade>
        <span className="intro__name">{t.intro.person}</span>
        <span className="intro__role">{t.hero.role}</span>
      </div>

      <footer className="intro__foot" data-intro-fade>
        <div className="intro__progress">
          <span className="intro__track">
            <span className="intro__bar" ref={barRef} />
          </span>
          <span className="intro__pct" ref={pctRef}>
            000%
          </span>
        </div>
        <button type="button" className="intro__skip" onClick={() => exitRef.current?.()}>
          {t.intro.skip}
          <span aria-hidden="true">ESC</span>
        </button>
      </footer>

      <noscript>
        <style>{`.intro{display:none}`}</style>
      </noscript>
    </div>
  );
}

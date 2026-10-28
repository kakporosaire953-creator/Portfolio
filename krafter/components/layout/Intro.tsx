"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SlicePortrait } from "@/components/brand/SlicePortrait";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { gsap, registerGsap } from "@/lib/animations/gsap/register";
import { asset } from "@/lib/utils/asset";
import { useReducedMotion } from "@/lib/utils/useReducedMotion";
import { setIntroPlaying } from "@/lib/utils/introState";

/**
 * THE KRAFTER, opening scene.
 *
 * A full-height portrait on the right, cut into vertical bands that settle into
 * one image as the page becomes ready; the official lockup on paper at the
 * left, one line of status and a segmented gauge. Nothing else.
 *
 * The overlay is server rendered, so the first paint is the loader and never a
 * flash of the homepage. The gauge is not theatre: fonts, the window load event
 * and the portrait decode each unlock a fixed share of it, and the scene only
 * leaves once all three are in. Escape, the skip button and a failsafe end it
 * early; reduced motion never sees it at all.
 */

const BANDS = 14; // segments in the gauge
const MIN_VISIBLE = 1900; // ms, long enough to read the mark
const FAILSAFE = 6000;

export function Intro() {
  const { t } = useLocale();
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const gaugeRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
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
    // The timeline is the pretty exit; the timeout is the guarantee. The page
    // must never depend on animation frames running.
    window.setTimeout(() => setMounted(false), 1100);
    gsap
      .timeline({ onComplete: () => setMounted(false) })
      .to(root.querySelectorAll("[data-intro-fade]"), {
        autoAlpha: 0,
        y: -12,
        duration: 0.42,
        stagger: 0.05,
        ease: "power2.in",
      })
      .to(
        root,
        {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.8,
          ease: "power4.inOut",
        },
        "-=0.18",
      );
  }, []);

  exitRef.current = finish;

  useEffect(() => {
    // The boot script decides before paint: other routes, a session that has
    // already seen the scene, and reduced motion never mount it.
    if (reduced || document.documentElement.classList.contains("intro-off")) {
      setMounted(false);
      setIntroPlaying(false);
      return;
    }

    setIntroPlaying(true);
    document.documentElement.classList.add("no-scroll");
    const start = performance.now();

    const signals = { fonts: false, load: false, portrait: false };
    let promised = 0;
    let value = 0;
    let exited = false;
    let lastTick = performance.now();
    let litBands = -1;

    const paint = () => {
      const filled = Math.round((value / 100) * BANDS);
      if (filled !== litBands) {
        litBands = filled;
        const cells = gaugeRef.current?.children;
        if (cells) {
          for (let i = 0; i < cells.length; i += 1) {
            (cells[i] as HTMLElement).dataset.on = i < filled ? "1" : "0";
          }
        }
      }
      rootRef.current?.setAttribute("aria-valuenow", String(Math.round(value)));
    };

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

    const tick = () => {
      const elapsed = performance.now() - start;
      promised = (signals.fonts ? 30 : 0) + (signals.load ? 30 : 0) + (signals.portrait ? 40 : 0);
      // The gauge never claims more than what is ready, and never fills faster
      // than the reveal: the smaller of the two. That makes the fill legible
      // instead of jumping to 100 % the instant every signal arrives.
      const target = Math.min(promised, (elapsed / (MIN_VISIBLE * 0.86)) * 100);
      // Seconds, not frames: a throttled tab must still reach the end. The
      // per tick cap keeps a stalled main thread from snapping the gauge to
      // its final value in one jump.
      const dt = Math.min((performance.now() - lastTick) / 1000, 0.25);
      lastTick = performance.now();
      value += (target - value) * Math.min(1, dt * 4.5);
      if (Math.abs(target - value) < 0.5) value = target;
      progress.current = value;
      paint();

      if (signals.fonts && signals.load && signals.portrait && value > 99.2 && elapsed >= MIN_VISIBLE) {
        value = 100;
        progress.current = 100;
        paint();
        window.clearInterval(timer);
        window.setTimeout(exit, 420);
      }
    };

    // setInterval, not requestAnimationFrame: a loader has to finish even when
    // the page is not producing frames.
    const timer = window.setInterval(tick, 90);
    tick();
    const failsafe = window.setTimeout(exit, FAILSAFE);

    // Each signal is honest, and each one has a bounded wait: a slow font or a
    // missing image must never trap the visitor behind the overlay.
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
    }, 2000);

    const onPortrait = () => {
      signals.portrait = true;
    };
    window.addEventListener("krafter:intro-portrait-ready", onPortrait);
    const portraitTimeout = window.setTimeout(onPortrait, 2600);

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
      window.clearTimeout(fontTimeout);
      window.clearTimeout(loadTimeout);
      window.clearTimeout(portraitTimeout);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("krafter:intro-portrait-ready", onPortrait);
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("no-scroll");
    };
  }, [reduced, finish]);

  const onPortraitReady = useCallback(() => {
    window.dispatchEvent(new Event("krafter:intro-portrait-ready"));
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
      <div className="intro__rule" aria-hidden="true" />
      <div className="intro__glow" aria-hidden="true" />

      <section className="intro__col">
        <span className="intro__tag" data-intro-fade>
          {t.intro.void}
        </span>

        <div className="intro__centre">
          <BrandLogo variant="brand" className="intro__logo" />
          <div className="intro__load" data-intro-fade>
            <span className="intro__label">{t.intro.loading}</span>
            <div className="intro__gauge" ref={gaugeRef} aria-hidden="true">
              {Array.from({ length: BANDS }, (_, i) => (
                <span className="intro__band" key={i} data-on="0" />
              ))}
            </div>
          </div>
        </div>

        <div className="intro__meta" data-intro-fade>
          <span className="intro__place">{t.intro.place}</span>
          <button type="button" className="intro__skip" onClick={() => exitRef.current?.()}>
            {t.intro.skip}
            <span aria-hidden="true">ESC</span>
          </button>
        </div>
      </section>

      <div className="intro__figure" aria-hidden="true">
        <SlicePortrait
          src={asset("/images/portrait-editorial.jpg")}
          progress={progress}
          onReady={onPortraitReady}
        />
      </div>

      <noscript>
        <style>{`.intro{display:none}`}</style>
      </noscript>
    </div>
  );
}

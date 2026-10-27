"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/animations/gsap/register";
import { useReducedMotion } from "@/lib/utils/useReducedMotion";

/**
 * Single place where scroll-driven editorial reveals are created.
 * Content stays visible without JS and with reduced motion. GSAP only writes
 * "from" states when it actually runs, inside one context that is reverted on
 * route change, language change and unmount.
 *
 * Hooks (attributes):
 *  - data-reveal              → rise + fade, expo ease
 *  - data-reveal-stagger      → container; children marked data-reveal-item
 *  - data-reveal-lines        → container; animates `.line-mask > span` masks
 *  - data-reveal-image        → clip-path curtain
 *  - data-reveal-rule         → horizontal scale from the left
 *  - data-parallax="0.12"     → subtle vertical parallax, scrubbed
 *  - data-scrub-fade          → fades out slightly as it leaves the viewport
 */
export function ScrollReveals() {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    registerGsap();

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 34,
          autoAlpha: 0,
          duration: 1.15,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-stagger]").forEach((group) => {
        const items = group.querySelectorAll<HTMLElement>("[data-reveal-item]");
        if (items.length === 0) return;
        gsap.from(items, {
          y: 30,
          autoAlpha: 0,
          duration: 1.05,
          stagger: { each: 0.075, from: "start" },
          ease: "expo.out",
          scrollTrigger: { trigger: group, start: "top 90%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-lines]").forEach((el) => {
        const lines = el.querySelectorAll<HTMLElement>(".line-mask > span");
        if (lines.length === 0) return;
        gsap.from(lines, {
          yPercent: 112,
          duration: 1.15,
          stagger: 0.09,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-image]").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(0% 0% 100% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.3,
            ease: "expo.inOut",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-rule]").forEach((el) => {
        gsap.from(el, {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.2,
          ease: "expo.inOut",
          scrollTrigger: { trigger: el, start: "top 95%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const amount = Number(el.dataset.parallax ?? 0.1);
        gsap.fromTo(
          el,
          { yPercent: -amount * 40 },
          {
            yPercent: amount * 40,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.7,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-scrub-fade]").forEach((el) => {
        gsap.to(el, {
          autoAlpha: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 20%",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      });
    });

    // GSAP has written the initial states: masked copy can be revealed.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => document.documentElement.classList.remove("js-mask-pending"));
    });

    const onLoad = () => ScrollTrigger.refresh();
    const refreshTimer = window.setTimeout(onLoad, 420);
    window.addEventListener("load", onLoad);

    // Copy length changes with the language: re-measure once React has painted.
    const onLocale = () => window.setTimeout(() => ScrollTrigger.refresh(), 140);
    window.addEventListener("krafter:locale-change", onLocale);

    // Web fonts change line heights; the intro scroll-lock changes the viewport.
    const onIntroDone = () => {
      document.documentElement.classList.remove("js-mask-pending");
      ScrollTrigger.refresh();
    };
    window.addEventListener("krafter:intro-done", onIntroDone);

    let fontsTimer: number | undefined;
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => {
        fontsTimer = window.setTimeout(() => ScrollTrigger.refresh(), 60);
      });
    }

    return () => {
      window.clearTimeout(refreshTimer);
      if (fontsTimer) window.clearTimeout(fontsTimer);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("krafter:locale-change", onLocale);
      window.removeEventListener("krafter:intro-done", onIntroDone);
      ctx.revert();
    };
  }, [pathname, reduced]);

  return null;
}

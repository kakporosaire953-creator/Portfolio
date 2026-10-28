"use client";

import { gsap, ScrollTrigger, registerGsap } from "@/lib/animations/gsap/register";
import type { SculptureModel, SculptureRig } from "./types";

/**
 * The motion score.
 *
 * GSAP coordinates the sculpture, but it never has two authors on one property:
 *
 * - rest      → `rig.rest` (float, slow yaw)
 * - pointer   → `rig.pointer` (damped, returns to zero on leave)
 * - scroll    → `rig.scroll` (a single 0 → 1 progress, reversible by design)
 * - theme     → `rig.applyThemeMix` through one 0 → 1 mix value
 *
 * The scene composes those four into a single transform each frame, so adding a
 * layer can never make two tweens fight over the same number.
 */

export interface SculptureMotionOptions {
  rig: SculptureRig;
  host: HTMLElement;
  model: SculptureModel;
  reduced: boolean;
  initialMix: number;
  /** Tone mapping exposure follows the theme too. */
  applyExposure: (mix: number) => void;
  /** Anything that must repaint once, e.g. a static reduced-motion frame. */
  onInvalidate: () => void;
}

export interface SculptureMotion {
  setTheme(mix: number): void;
  revert(): void;
}

function readThemeMix(): number {
  return document.documentElement.dataset.theme === "dark" ? 1 : 0;
}

export function createSculptureMotion({
  rig,
  host,
  model,
  reduced,
  initialMix,
  applyExposure,
  onInvalidate,
}: SculptureMotionOptions): SculptureMotion {
  registerGsap();

  const theme = { mix: initialMix };
  let themeTween: gsap.core.Tween | null = null;

  const applyMix = () => {
    rig.applyThemeMix(theme.mix);
    applyExposure(theme.mix);
  };
  applyMix();

  const setTheme = (mix: number) => {
    themeTween?.kill();
    if (reduced) {
      theme.mix = mix;
      applyMix();
      onInvalidate();
      return;
    }
    // Preserve the current angle, colour and pose: only light and material
    // respond, so the theme never restarts or rebuilds the scene.
    themeTween = gsap.to(theme, {
      mix,
      duration: 0.9,
      ease: "power2.inOut",
      overwrite: true,
      onUpdate: applyMix,
    });
  };

  const ctx = gsap.context(() => {
    if (!reduced) {
      if (model === "ghost") {
        // Rest: the veil floats and turns its head, slowly enough to be felt
        // rather than watched.
        const float = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: "sine.inOut" } });
        float.to(rig.rest, { y: 0.1, duration: 4.6 }, 0);
        float.to(rig.rest, { rotationX: 0.035, duration: 6.8 }, 0);
        float.to(rig.rest, { rotationY: 0.085, duration: 11 }, 0);
      } else {
        // Rest: a full, very slow turn plus a breathing tilt on another axis.
        gsap.to(rig.rest, {
          rotationY: rig.rest.rotationY + Math.PI * 2,
          duration: 78,
          ease: "none",
          repeat: -1,
        });
        gsap.to(rig.rest, {
          rotationX: rig.rest.rotationX + 0.14,
          duration: 9.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      // Pointer: damped with inertia, always returns to rest when it leaves.
      const mm = gsap.matchMedia();
      mm.add("(hover: hover) and (pointer: fine)", () => {
        const toX = gsap.quickTo(rig.pointer, "x", { duration: 0.9, ease: "power3.out" });
        const toY = gsap.quickTo(rig.pointer, "y", { duration: 0.9, ease: "power3.out" });

        const onMove = (event: PointerEvent) => {
          const rect = host.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return;
          const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
          const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
          toX(Math.max(-1, Math.min(1, x)));
          toY(Math.max(-1, Math.min(1, y)));
        };
        const onLeave = () => {
          toX(0);
          toY(0);
        };

        window.addEventListener("pointermove", onMove, { passive: true });
        document.addEventListener("pointerleave", onLeave);
        return () => {
          window.removeEventListener("pointermove", onMove);
          document.removeEventListener("pointerleave", onLeave);
        };
      });
    }

    // Scroll: one progress value, scrubbed with damping so a fast flick still
    // arrives smoothly and is fully reversible when the visitor scrolls back.
    // With reduced motion the sculpture is a still frame, so nothing here runs.
    const trigger = (host.closest("section") ?? host) as HTMLElement;
    if (!reduced) gsap.to(rig.scroll, {
      progress: 1,
      ease: "none",
      scrollTrigger: {
        trigger,
        start: model === "ghost" ? "top top" : "top bottom",
        end: "bottom top",
        scrub: model === "ghost" ? 0.9 : 1.4,
        invalidateOnRefresh: true,
      },
    });
  }, host);

  const onThemeEvent = () => setTheme(readThemeMix());
  window.addEventListener("krafter:theme-change", onThemeEvent);

  return {
    setTheme,
    revert() {
      window.removeEventListener("krafter:theme-change", onThemeEvent);
      themeTween?.kill();
      themeTween = null;
      ctx.revert();
      ScrollTrigger.refresh();
    },
  };
}

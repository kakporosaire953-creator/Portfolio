"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/animations/gsap/register";
import { useReducedMotion } from "@/lib/utils/useReducedMotion";

/**
 * Discreet pointer companion.
 *
 * A thin ring trails the pointer and turns into a labelled pill when it hovers
 * an element carrying `data-cursor="…"`. It never hides the native cursor, is
 * pointer-events:none, is skipped for touch and for reduced motion, and is
 * removed on unmount.
 */
export function CursorFollower() {
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!ring || !label) return;

    registerGsap();
    gsap.set(ring, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 0.6 });

    const xTo = gsap.quickTo(ring, "x", { duration: 0.42, ease: "power3.out" });
    const yTo = gsap.quickTo(ring, "y", { duration: 0.42, ease: "power3.out" });

    let shown = false;
    const onMove = (event: PointerEvent) => {
      xTo(event.clientX);
      yTo(event.clientY);
      if (!shown) {
        shown = true;
        gsap.to(ring, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "power2.out" });
      }
    };

    const onOver = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      const text = target?.dataset.cursor;
      if (!text) return;
      label.textContent = text;
      gsap.to(ring, {
        width: 86,
        height: 86,
        borderColor: "color-mix(in srgb, var(--orange) 70%, transparent)",
        backgroundColor: "color-mix(in srgb, var(--ink) 92%, transparent)",
        duration: 0.45,
        ease: "expo.out",
      });
      gsap.to(label, { autoAlpha: 1, duration: 0.3, delay: 0.06 });
    };

    const onOut = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      if (!target) return;
      // Still inside another labelled element? keep the pill.
      const next = (event.relatedTarget as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      if (next) return;
      gsap.to(label, { autoAlpha: 0, duration: 0.2 });
      gsap.to(ring, {
        width: 34,
        height: 34,
        borderColor: "color-mix(in srgb, var(--ink) 28%, transparent)",
        backgroundColor: "transparent",
        duration: 0.4,
        ease: "expo.out",
      });
    };

    const onLeaveWindow = () => {
      shown = false;
      gsap.to(ring, { autoAlpha: 0, duration: 0.3 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);
    window.addEventListener("blur", onLeaveWindow);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
      window.removeEventListener("blur", onLeaveWindow);
      gsap.killTweensOf(ring);
      gsap.killTweensOf(label);
    };
  }, [reduced]);

  return (
    <div className="cursor-ring only-fine-pointer" ref={ringRef} aria-hidden="true">
      <span className="cursor-ring__label" ref={labelRef} />
    </div>
  );
}

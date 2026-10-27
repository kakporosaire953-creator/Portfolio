"use client";

import { useEffect } from "react";
import { useReducedMotion } from "@/lib/utils/useReducedMotion";

/**
 * Specular light for the liquid glass.
 *
 * One delegated pointer listener moves a CSS cursor position
 * (`--glass-x` / `--glass-y`) on the nearest `[data-glass]` surface, so the
 * highlight of every card follows the pointer without one listener per card.
 * Touch and reduced-motion visitors get the static material only.
 */
export function GlassSheen() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let current: HTMLElement | null = null;
    let frame = 0;
    let point = { x: 50, y: 50 };

    const apply = () => {
      frame = 0;
      if (!current) return;
      current.style.setProperty("--glass-x", `${point.x}%`);
      current.style.setProperty("--glass-y", `${point.y}%`);
    };

    const onMove = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-glass]") ?? null;

      if (target !== current) {
        current?.style.removeProperty("--glass-x");
        current?.style.removeProperty("--glass-y");
        current = target;
      }
      if (!target) return;

      const rect = target.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      point = {
        x: ((event.clientX - rect.left) / rect.width) * 100,
        y: ((event.clientY - rect.top) / rect.height) * 100,
      };
      if (!frame) frame = window.requestAnimationFrame(apply);
    };

    document.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      document.removeEventListener("pointermove", onMove);
      if (frame) window.cancelAnimationFrame(frame);
      current?.style.removeProperty("--glass-x");
      current?.style.removeProperty("--glass-y");
    };
  }, [reduced]);

  return null;
}

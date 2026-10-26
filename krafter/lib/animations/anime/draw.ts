"use client";

import { animate, svg, stagger, utils } from "animejs";

/**
 * anime.js v4 helpers for THE KRAFTER's independent SVG motifs.
 * GSAP owns page-level timelines; anime.js owns these self-contained drawings,
 * so no element is driven by both engines.
 */

export type DrawOptions = {
  duration?: number;
  delay?: number;
  stagger?: number;
  loop?: boolean;
};

/** Draws stroked SVG paths progressively, in sequence. */
export function drawPaths(
  targets: string | Element | Element[] | NodeListOf<Element> | SVGGeometryElement,
  { duration = 1400, delay = 0, stagger: staggerMs = 60, loop = false }: DrawOptions = {},
) {
  const drawable = svg.createDrawable(targets as never);
  return animate(drawable, {
    draw: ["0 0", "0 1"],
    duration,
    delay: stagger(staggerMs, { start: delay }),
    ease: "inOutSine",
    loop,
  });
}

/** Fades + scales a group of SVG nodes with a geometric stagger. */
export function revealNodes(
  targets: string | Element[],
  { duration = 700, delay = 0, stagger: staggerMs = 40, loop = false }: DrawOptions = {},
) {
  return animate(targets as never, {
    opacity: [0, 1],
    scale: [0.72, 1],
    duration,
    delay: stagger(staggerMs, { start: delay }),
    ease: "outExpo",
    loop,
  });
}

/** Slow orbital rotation for arcs, keeps transforms composable. */
export function spinOrbit(target: string | Element, duration = 18000) {
  return animate(target as never, {
    rotate: 360,
    duration,
    loop: true,
    ease: "linear",
  });
}

export { animate, svg, stagger, utils };

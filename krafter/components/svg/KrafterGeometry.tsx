"use client";

import { useEffect, useRef } from "react";
import { animate, svg, stagger } from "animejs";
import { useReducedMotion } from "@/lib/utils/useReducedMotion";
import { cn } from "@/lib/utils/cn";

/**
 * THE KRAFTER graphic language, drawn with anime.js v4.
 * Diagonals of the K, orbital arcs, grid fragments — decorative only.
 * GSAP never animates these paths, so the two engines never fight.
 */
export function KrafterGeometry({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const ref = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = ref.current;
    if (!root || reduced) return;

    const paths = root.querySelectorAll<SVGGeometryElement>("[data-art-path]");
    if (paths.length === 0) return;

    const drawable = svg.createDrawable(paths as never);
    let animation: ReturnType<typeof animate> | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        animation = animate(drawable, {
          draw: ["0 0", "0 1"],
          duration: 1500,
          delay: stagger(80),
          ease: "inOutSine",
        });
        observer.disconnect();
      },
      { threshold: 0.2 },
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      animation?.revert();
    };
  }, [reduced]);

  const stroke = tone === "dark" ? "rgba(245,242,234,0.34)" : "var(--line-strong)";
  const accent = "var(--orange)";

  return (
    <svg
      ref={ref}
      className={cn("krafter-geometry", className)}
      viewBox="0 0 640 640"
      fill="none"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid slice"
    >
      <g stroke={stroke} strokeWidth="1">
        <path data-art-path d="M60 60 300 300 60 540" />
        <path data-art-path d="M300 300 540 60" />
        <path data-art-path d="M300 300 540 540" />
        <path data-art-path d="M60 170h480" />
        <path data-art-path d="M60 430h480" />
      </g>
      <g stroke={accent} strokeWidth="1.2" opacity="0.9">
        <path data-art-path d="M60 620A260 260 0 0 1 580 620" />
        <path data-art-path d="M120 300a180 180 0 1 1 360 0" />
      </g>
      <g stroke={stroke} strokeWidth="1" strokeDasharray="2 8">
        <circle data-art-path cx="300" cy="300" r="214" />
      </g>
      <g fill={accent}>
        <circle cx="300" cy="300" r="3.2" />
        <circle cx="540" cy="60" r="2.4" />
        <circle cx="60" cy="540" r="2.4" />
      </g>
    </svg>
  );
}

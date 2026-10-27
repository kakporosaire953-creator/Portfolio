"use client";

import Link from "next/link";
import { useRef } from "react";
import type { ReactNode } from "react";
import { saveFlipPayload } from "@/lib/animations/gsap/flip";

type Props = {
  href: string;
  slug: string;
  /** Source image used for the GSAP Flip handover; omit for graphic covers. */
  imageSrc?: string;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
  /** Label shown by the pointer companion when hovering the cover. */
  cursorLabel?: string;
};

/**
 * Real link + Flip handover. Navigation always works, even when the
 * animation is skipped (reduced motion, storage blocked, slow network).
 */
export function ProjectFlipLink({
  href,
  slug,
  imageSrc,
  className,
  children,
  ariaLabel,
  cursorLabel,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  const capture = () => {
    if (!imageSrc) return;
    const media = ref.current?.querySelector<HTMLElement>("[data-flip-media]");
    if (!media) return;
    const rect = media.getBoundingClientRect();
    saveFlipPayload({
      src: imageSrc,
      slug,
      rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      time: Date.now(),
    });
  };

  return (
    <Link
      ref={ref}
      href={href}
      className={className}
      aria-label={ariaLabel}
      onClick={capture}
      data-flip-source={slug}
      data-cursor={cursorLabel}
    >
      {children}
    </Link>
  );
}

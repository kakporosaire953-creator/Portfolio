"use client";

import { useEffect, useRef } from "react";
import type { ElementType, ReactNode } from "react";
import { gsap, SplitText, registerGsap } from "@/lib/animations/gsap/register";
import { useReducedMotion } from "@/lib/utils/useReducedMotion";

type SplitHeadingProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  /** start animation immediately instead of on scroll (hero headings) */
  immediate?: boolean;
};

/**
 * GSAP SplitText line reveal with real masks.
 * Text stays in the DOM and readable before/after splitting (revert on unmount).
 */
export function SplitHeading({
  as: Tag = "h2",
  children,
  className,
  id,
  delay = 0,
  immediate = false,
}: SplitHeadingProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || typeof window === "undefined") return;
    const element = ref.current;
    if (!element) return;
    registerGsap();

    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      split = SplitText.create(element, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
      });

      gsap.from(split.lines, {
        yPercent: 112,
        duration: 1.05,
        stagger: 0.075,
        delay,
        ease: "power3.out",
        scrollTrigger: immediate
          ? undefined
          : { trigger: element, start: "top 90%", once: true },
      });
    }, element);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [children, delay, immediate, reduced]);

  return (
    <Tag ref={ref} className={className} id={id}>
      {children}
    </Tag>
  );
}

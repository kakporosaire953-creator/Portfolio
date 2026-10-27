"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import type { ElementType, ReactNode } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { gsap, registerGsap } from "@/lib/animations/gsap/register";
import { splitWords } from "@/lib/animations/gsap/splitWords";
import { whenIntroIdle } from "@/lib/utils/introState";
import { useReducedMotion } from "@/lib/utils/useReducedMotion";

/** Split before paint on the client, stay inert during SSR. */
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type SplitHeadingProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  stagger?: number;
  /** Start on mount instead of on scroll (page titles, hero headings). */
  immediate?: boolean;
};

/**
 * Word-by-word editorial reveal with real masks.
 *
 * The element is remounted on language change (`key={locale}`), so React never
 * updates a text node that the splitter has replaced. The original markup is
 * restored on unmount, which keeps the DOM clean across route changes.
 */
export function SplitHeading({
  as: Tag = "h2",
  children,
  className,
  id,
  delay = 0,
  stagger = 0.048,
  immediate = false,
}: SplitHeadingProps) {
  const { locale } = useLocale();
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useIsoLayoutEffect(() => {
    if (reduced || typeof window === "undefined") return;
    const element = ref.current;
    if (!element) return;
    registerGsap();

    const split = splitWords(element);
    if (split.words.length === 0) return;

    let cancelIntro = () => undefined as void;
    const ctx = gsap.context(() => {
      const tween = gsap.from(split.words, {
        yPercent: 118,
        duration: 1.2,
        stagger,
        delay,
        ease: "expo.out",
        paused: immediate,
        scrollTrigger: immediate ? undefined : { trigger: element, start: "top 90%", once: true },
      });

      // A page title must never play behind KRAFTER / ASSEMBLY.
      if (immediate) cancelIntro = whenIntroIdle(() => tween.play(0));
    }, element);

    return () => {
      cancelIntro();
      ctx.revert();
      split.revert();
    };
  }, [locale, delay, immediate, reduced, stagger]);

  return (
    <Tag key={locale} ref={ref} className={className} id={id}>
      {children}
    </Tag>
  );
}

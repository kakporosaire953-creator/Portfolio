"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navItems, isActivePath } from "@/data/profile";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { NavGlyph } from "./Glyphs";
import { cn } from "@/lib/utils/cn";
import { gsap, registerGsap } from "@/lib/animations/gsap/register";
import { useReducedMotion } from "@/lib/utils/useReducedMotion";

/**
 * Layer B — floating vertical rail (desktop only).
 * One icon per destination, active state in orange, label on hover/focus,
 * plus a discreet scroll-progress thread.
 */
export function VerticalRail() {
  const { t } = useLocale();
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reduced) return;
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.from(".rail__thread", { autoAlpha: 0, duration: 0.8, delay: 0.4 });
      gsap.from(".rail__item", {
        autoAlpha: 0,
        x: 16,
        duration: 0.55,
        stagger: 0.05,
        delay: 0.5,
        ease: "power2.out",
      });
    });
    return () => ctx.revert();
  }, [reduced]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0);
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return (
    <nav className="rail only-desktop" aria-label={t.nav.railLabel}>
      <span className="rail__thread" aria-hidden="true">
        <span className="rail__thread-fill" style={{ transform: `scaleY(${progress})` }} />
      </span>
      <ul className="rail__list">
        {navItems.map((item) => {
          const active = isActivePath(pathname, item.href);
          return (
            <li key={item.key} className="rail__item">
              <Link
                href={item.href}
                className={cn("rail__link", active && "is-active")}
                aria-current={active ? "page" : undefined}
                aria-label={t.nav[item.key]}
              >
                <span className="rail__label" aria-hidden="true">
                  {t.nav[item.key]}
                </span>
                <span className="rail__glyph">
                  <NavGlyph name={item.icon} size={19} />
                </span>
                <span className="rail__dot" aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

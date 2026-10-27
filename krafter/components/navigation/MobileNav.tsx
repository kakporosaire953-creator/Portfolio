"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { GlassSwitch } from "@/components/theme/GlassSwitch";
import { LocaleSwitch } from "@/components/navigation/LocaleSwitch";
import { ArrowUpRight } from "@/components/navigation/Glyphs";
import { navItems, profile } from "@/data/profile";
import { gsap, registerGsap } from "@/lib/animations/gsap/register";
import { useReducedMotion } from "@/lib/utils/useReducedMotion";
import { cn } from "@/lib/utils/cn";

/**
 * Purpose-built fullscreen mobile navigation.
 * Real dialog semantics: focus moves in, Tab stays inside, Escape closes and
 * focus returns to the trigger. The panel is inert while closed, so no hidden
 * link can be reached with the keyboard.
 */
export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLocale();
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  // Route change closes the panel.
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Focus + scroll lock + keyboard trap.
  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const timer = window.setTimeout(() => closeRef.current?.focus(), 60);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.dataset.navOpen = "true";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((node) => node.offsetParent !== null || node === document.activeElement);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      delete document.body.dataset.navOpen;
      restoreRef.current?.focus?.();
    };
  }, [open, onClose]);

  // Link entrance — independent of the panel CSS transition, and skipped for
  // reduced-motion users (the links are simply visible).
  useEffect(() => {
    if (!open || reduced) return;
    const panel = panelRef.current;
    if (!panel) return;
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.from("[data-nav-item]", {
        autoAlpha: 0,
        y: 26,
        duration: 0.6,
        stagger: 0.045,
        delay: 0.16,
        ease: "power3.out",
        clearProps: "all",
      });
      gsap.from("[data-nav-foot]", { autoAlpha: 0, y: 14, duration: 0.5, delay: 0.42, clearProps: "all" });
    }, panel);
    return () => ctx.revert();
  }, [open, reduced]);

  return (
    <div
      className="mobile-nav"
      ref={panelRef}
      id="mobile-navigation"
      role="dialog"
      aria-modal="true"
      aria-label={t.nav.label}
      data-open={open}
      inert={!open}
    >
      <div className="mobile-nav__top">
        <Link href="/" className="mobile-nav__brand" onClick={onClose} aria-label="THE KRAFTER, accueil">
          <BrandLogo variant="header" />
        </Link>
        <button type="button" className="mobile-nav__close" onClick={onClose} ref={closeRef}>
          {t.nav.close}
          <span aria-hidden="true">✕</span>
        </button>
      </div>

      <div className="mobile-nav__body">
        <nav className="mobile-nav__list" aria-label={t.nav.label}>
          {navItems.map((item, index) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn("mobile-nav__link", active && "is-active")}
                aria-current={active ? "page" : undefined}
                data-nav-item
              >
                <span className="mobile-nav__index">{String(index + 1).padStart(2, "0")}</span>
                <span className="mobile-nav__label">{t.nav[item.key]}</span>
                <span className="mobile-nav__arrow" aria-hidden="true">
                  <ArrowUpRight size={16} />
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mobile-nav__foot" data-nav-foot>
        <div className="mobile-nav__controls">
          <div className="mobile-nav__control">
            <span className="meta-tight">{t.common.theme}</span>
            <GlassSwitch showLabel />
          </div>
          <div className="mobile-nav__control">
            <span className="meta-tight">{t.common.language}</span>
            <LocaleSwitch />
          </div>
        </div>
        <div className="mobile-nav__contact">
          <a className="mobile-nav__mail" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <Link href="/contact" className="mobile-nav__cta btn btn--orange btn--sm" onClick={onClose}>
            {t.common.ctaContact}
          </Link>
        </div>
        <p className="mobile-nav__signature meta">{t.common.signature}</p>
      </div>
    </div>
  );
}

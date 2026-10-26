"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { navItems, isActivePath, profile } from "@/data/profile";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { LocaleSwitch } from "./LocaleSwitch";
import { GlassSwitch } from "@/components/theme/GlassSwitch";
import { ArrowUpRight } from "./Glyphs";
import { cn } from "@/lib/utils/cn";
import { gsap, registerGsap } from "@/lib/animations/gsap/register";
import { useReducedMotion } from "@/lib/utils/useReducedMotion";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

/** Full-screen mobile navigation — thumb-sized targets, its own composition. */
export function MobileNav({ open, onClose }: MobileNavProps) {
  const { t, locale } = useLocale();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  // Lock scroll + move focus while the panel is open.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.classList.add("no-scroll");
    const timer = window.setTimeout(() => closeRef.current?.focus(), 60);
    return () => {
      window.clearTimeout(timer);
      root.classList.remove("no-scroll");
    };
  }, [open]);

  // Escape closes, focus is kept inside the panel.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Staggered entrance for the editorial link list.
  useEffect(() => {
    if (!open || reduced || !listRef.current) return;
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.from("[data-mobile-link]", {
        yPercent: 108,
        opacity: 0,
        duration: 0.72,
        stagger: 0.055,
        delay: 0.12,
        ease: "power3.out",
      });
      gsap.from("[data-mobile-meta]", {
        opacity: 0,
        y: 14,
        duration: 0.6,
        stagger: 0.06,
        delay: 0.34,
        ease: "power2.out",
      });
    }, listRef);
    return () => ctx.revert();
  }, [open, reduced]);

  return (
    <div
      className="mobile-nav"
      data-open={open ? "true" : "false"}
      aria-hidden={open ? undefined : true}
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={t.nav.menu}
      inert={!open}
    >
      <div className="mobile-nav__top">
        <span className="meta">{t.header.badge}</span>
        <button
          type="button"
          className="mobile-nav__close"
          onClick={onClose}
          ref={closeRef}
          tabIndex={open ? 0 : -1}
        >
          <span>{t.nav.close}</span>
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
            <path d="m4 4 12 12M16 4 4 16" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <nav className="mobile-nav__body" aria-label={t.nav.label}>
        <ul className="mobile-nav__list" ref={listRef}>
          {navItems.map((item, index) => {
            const active = isActivePath(pathname, item.href);
            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className={cn("mobile-nav__link", active && "is-active")}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  tabIndex={open ? 0 : -1}
                  data-mobile-link
                >
                  <span className="mobile-nav__index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="mobile-nav__label">{t.nav[item.key]}</span>
                  <span className="mobile-nav__arrow" aria-hidden="true">
                    <ArrowUpRight size={18} />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mobile-nav__foot">
        <div className="mobile-nav__controls" data-mobile-meta>
          <div className="mobile-nav__control">
            <span className="meta">{t.common.language}</span>
            <LocaleSwitch />
          </div>
          <div className="mobile-nav__control">
            <span className="meta">{t.common.theme}</span>
            <GlassSwitch showLabel />
          </div>
        </div>
        <div className="mobile-nav__contact" data-mobile-meta>
          <Link href="/contact" className="btn btn--orange btn--sm mobile-nav__cta" onClick={onClose} tabIndex={open ? 0 : -1}>
            {t.header.cta}
          </Link>
          <a href={`mailto:${profile.email}`} className="mobile-nav__mail link-underline" tabIndex={open ? 0 : -1}>
            {profile.email}
          </a>
          <p className="meta">
            {profile.city} · {profile.country[locale]}
          </p>
        </div>
        <p className="mobile-nav__signature meta" data-mobile-meta>
          {t.common.signature}
        </p>
      </div>
    </div>
  );
}

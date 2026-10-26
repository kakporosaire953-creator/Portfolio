"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { GlassSwitch } from "@/components/theme/GlassSwitch";
import { LocaleSwitch } from "./LocaleSwitch";
import { MobileNav } from "./MobileNav";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/utils/cn";

/**
 * Layer A — top bar.
 * Full logo, light/dark glass switch, FR/EN selector, primary CTA.
 * Uses a restrained liquid-glass material that compacts on scroll.
 */
export function SiteHeader() {
  const { t } = useLocale();
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (frame.current !== null) return;
      frame.current = window.requestAnimationFrame(() => {
        setCompact(window.scrollY > 36);
        frame.current = null;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    };
  }, []);

  // Close the mobile panel when the viewport grows to desktop.
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (mql.matches) setMenuOpen(false);
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <header className={cn("site-header", compact && "is-compact")} data-compact={compact}>
        <div className="site-header__inner glass">
          <div className="site-header__brand">
            <Link href="/" aria-label={`${t.brand.name} — ${t.nav.home}`} className="site-header__logo">
              <BrandLogo variant="header" />
            </Link>
          </div>

          <div className="site-header__status only-desktop" aria-hidden="true">
            <span className="orange-dot" />
            <span className="meta">{t.common.available}</span>
            <span className="site-header__status-sep" />
            <span className="meta">{t.common.location}</span>
          </div>

          <div className="site-header__tools">
            <LocaleSwitch className="only-desktop" />
            <GlassSwitch />
            <Link href="/contact" className="btn btn--orange btn--sm site-header__cta only-desktop">
              {t.header.cta}
            </Link>
            <button
              type="button"
              className="site-header__menu only-mobile"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={t.nav.open}
            >
              <span className="site-header__menu-label">{t.nav.menu}</span>
              <span className="site-header__menu-bars" aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-navigation">
        <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>
    </>
  );
}

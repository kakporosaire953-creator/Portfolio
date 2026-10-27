"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { GlassSwitch } from "@/components/theme/GlassSwitch";
import { LocaleSwitch } from "@/components/navigation/LocaleSwitch";
import { MobileNav } from "@/components/navigation/MobileNav";
import { cn } from "@/lib/utils/cn";

/**
 * Sticky header: full lockup, availability line, GLASS SWITCH, FR/EN and the
 * "TRAVAILLONS ENSEMBLE" call to action. It compacts on scroll and keeps the
 * liquid glass restrained to a single capsule.
 */
export function SiteHeader() {
  const { t } = useLocale();
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [portalReady, setPortalReady] = useState(false);

  // The dialog is portalled to <body> so the header's stacking context and its
  // pointer-events isolation cannot clip or block it.
  useEffect(() => setPortalReady(true), []);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        setCompact(window.scrollY > 36);
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  // The menu button controls the dialog: hide it from assistive tech while the
  // dialog is open, so there is never two competing "close" affordances.
  return (
    <header className={cn("site-header", compact && "is-compact")}>
      <div className="site-header__inner glass">
        <Link href="/" className="site-header__brand" aria-label={`THE KRAFTER · ${t.nav.home}`}>
          <span className="site-header__logo">
            <BrandLogo variant="header" />
          </span>
        </Link>

        <div className="site-header__status">
          <span className="status-dot" aria-hidden="true" />
          <span className="meta">{t.common.available}</span>
          <span className="site-header__status-sep" aria-hidden="true" />
          <span className="meta">{t.header.badge}</span>
        </div>

        <div className="site-header__tools">
          <span className="site-header__locale">
            <LocaleSwitch />
          </span>
          <GlassSwitch />
          <Link href="/contact" className="btn btn--orange btn--sm site-header__cta">
            {t.common.ctaContact}
          </Link>
          <button
            type="button"
            className="site-header__menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? t.nav.close : t.header.menuLabel}
            onClick={() => setMenuOpen((value) => !value)}
            inert={menuOpen}
          >
            <span className="site-header__menu-label">{t.nav.menu}</span>
            <span className="site-header__menu-bars" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      {portalReady
        ? createPortal(<MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />, document.body)
        : null}
    </header>
  );
}

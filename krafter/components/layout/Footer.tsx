"use client";

import Link from "next/link";
import { useRef } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useGsap } from "@/lib/animations/gsap/useGsap";
import { gsap, ScrollTrigger } from "@/lib/animations/gsap/register";
import { useReducedMotion } from "@/lib/utils/useReducedMotion";
import { navItems, profile, type NavKey } from "@/data/profile";
import { ArrowUpRight, ArrowUpIcon } from "@/components/navigation/FooterGlyphs";

/** Only the four destinations that deserve a second chance at the end. */
const FOOTER_KEYS: NavKey[] = ["projects", "services", "about", "contact"];
const FOOTER_LINKS = navItems.filter((item) => FOOTER_KEYS.includes(item.key));

/**
 * Footer, two bands only.
 *
 * Band 1: the full logo, the email as the focal point, four destinations and the
 * call to action. Band 2: copyright, city, GitHub and back to top.
 * Heights are capped in CSS so the footer can never eat a screen.
 */
export function Footer() {
  const { t, locale } = useLocale();
  const reduced = useReducedMotion();
  const year = new Date().getFullYear();
  const scopeRef = useRef<HTMLElement>(null);

  useGsap(
    (scope) => {
      if (reduced) return;

      const main = scope.querySelectorAll<HTMLElement>("[data-footer-main] > *");
      const links = scope.querySelectorAll<HTMLElement>("[data-footer-link]");
      const base = scope.querySelectorAll<HTMLElement>("[data-footer-base] > *");
      const rule = scope.querySelector("[data-footer-rule]");

      gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(main, { autoAlpha: 0, y: 26 });
      gsap.set(links, { autoAlpha: 0, y: 12 });
      gsap.set(base, { autoAlpha: 0, y: 10 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: scope, start: "top 92%", once: true },
        defaults: { ease: "expo.out" },
      });

      tl.to(rule, { scaleX: 1, duration: 1.1, ease: "power3.inOut" })
        .to(main, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.07 }, 0.1)
        .to(links, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.05 }, 0.35)
        .to(base, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.05 }, 0.5);

      // The footer is the last thing to be measured; refresh once it is laid out.
      const timer = window.setTimeout(() => ScrollTrigger.refresh(), 300);
      return () => window.clearTimeout(timer);
    },
    [reduced],
    scopeRef,
  );

  return (
    <footer className="site-footer" ref={scopeRef}>
      <div className="shell site-footer__inner">
        <div className="site-footer__main" data-footer-main>
          <div className="site-footer__brand">
            <BrandLogo variant="footer" />
          </div>

          <a className="site-footer__mail" href={`mailto:${profile.email}`}>
            <span className="site-footer__mail-text">{profile.email}</span>
            <ArrowUpRight size={15} />
          </a>

          <nav className="site-footer__nav" aria-label={t.footer.navTitle}>
            <ul>
              {FOOTER_LINKS.map((item) => (
                <li key={item.key} data-footer-link>
                  <Link href={item.href} className="site-footer__link">
                    {t.nav[item.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link href="/contact" className="btn btn--orange btn--sm site-footer__cta">
            {t.common.ctaContact}
            <ArrowUpRight size={12} />
          </Link>
        </div>

        <div className="site-footer__base" data-footer-base>
          <p className="meta">
            © {year} {profile.fullName}
          </p>
          <p className="meta site-footer__base-center">
            {profile.city}, {profile.country[locale]}
          </p>
          <div className="site-footer__base-links">
            <a
              href={profile.github}
              className="site-footer__link meta"
              target="_blank"
              rel="noreferrer noopener"
            >
              GitHub
              <ArrowUpRight size={11} />
              <span className="sr-only"> ({t.a11y.newTab})</span>
            </a>
            <a href="#top" className="site-footer__top-link meta">
              {t.footer.backTop}
              <ArrowUpIcon size={11} />
            </a>
          </div>
        </div>
      </div>
      <span className="site-footer__rule" data-footer-rule aria-hidden="true" />
    </footer>
  );
}

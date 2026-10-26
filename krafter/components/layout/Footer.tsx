"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { navItems, profile } from "@/data/profile";
import { ArrowUpRight, ArrowUpIcon } from "@/components/navigation/FooterGlyphs";

export function Footer() {
  const { t, locale } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__grid-lines" aria-hidden="true" />
      <div className="shell site-footer__inner">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <BrandLogo variant="footer" withHint />
            <p className="site-footer__tagline">{t.footer.tagline}</p>
            <p className="site-footer__signature mono">{t.common.signature}</p>
          </div>

          <nav className="site-footer__col" aria-label={t.footer.navTitle}>
            <h2 className="meta site-footer__col-title">{t.footer.navTitle}</h2>
            <ul>
              {navItems.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className="site-footer__link">
                    <span>{t.nav[item.key]}</span>
                    <ArrowUpRight size={12} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-footer__col">
            <h2 className="meta site-footer__col-title">{t.footer.contactTitle}</h2>
            <ul>
              <li>
                <a href={`mailto:${profile.email}`} className="site-footer__link">
                  <span>{profile.email}</span>
                  <ArrowUpRight size={12} />
                </a>
              </li>
              <li className="site-footer__static">
                {profile.city}, {profile.country[locale]}
              </li>
              <li className="site-footer__static">
                <span className="site-footer__status-dot" aria-hidden="true" />
                {t.footer.statusValue}
              </li>
            </ul>
            <h2 className="meta site-footer__col-title site-footer__col-title--second">
              {t.footer.elsewhereTitle}
            </h2>
            <ul>
              <li>
                <a
                  href={profile.github}
                  className="site-footer__link"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <span>GitHub</span>
                  <ArrowUpRight size={12} />
                  <span className="sr-only"> ({t.a11y.newTab})</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="site-footer__col site-footer__col--cta">
            <h2 className="meta site-footer__col-title">{t.footer.emailTitle}</h2>
            <p className="site-footer__cta-text">{t.home.cta.text}</p>
            <Link href="/contact" className="btn btn--orange btn--sm">
              {t.common.ctaContact}
              <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>

        <div className="site-footer__base">
          <p className="meta">
            © {year} {profile.fullName} — {t.footer.rights}
          </p>
          <p className="meta site-footer__base-center">{t.common.signatureLine}</p>
          <a href="#top" className="site-footer__top-link meta">
            {t.footer.backTop}
            <ArrowUpIcon size={12} />
          </a>
        </div>
      </div>
    </footer>
  );
}

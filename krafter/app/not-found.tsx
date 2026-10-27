"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { ArrowRight } from "@/components/navigation/Glyphs";
import { asset } from "@/lib/utils/asset";

/**
 * Legacy URLs from the previous static site. They are no longer published, but
 * inbound links and search results may still point at them: the 404 page
 * forwards known ones to their replacement instead of losing the visit.
 */
const LEGACY_ROUTES: Record<string, string> = {
  "/about.html": "/a-propos",
  "/a-propos.html": "/a-propos",
  "/projects.html": "/projets",
  "/projets.html": "/projets",
  "/skills.html": "/competences",
  "/competences.html": "/competences",
  "/experience.html": "/a-propos",
  "/contact.html": "/contact",
  "/rosaire_kakpo_v2_premium.html": "/",
  "/index.html": "/",
};

export default function NotFound() {
  const { t } = useLocale();

  useEffect(() => {
    const path = window.location.pathname.replace(/\/$/, "").toLowerCase();
    const stripped = path.replace(/^\/portfolio/, "");
    const target = LEGACY_ROUTES[stripped] ?? LEGACY_ROUTES[path];
    if (target) window.location.replace(`${asset(target)}/`);
  }, []);

  return (
    <div className="shell">
      <div className="notfound">
        <span className="notfound__code">{t.notFound.code}</span>
        <h1 className="notfound__title">{t.notFound.title}</h1>
        <p className="notfound__text">{t.notFound.text}</p>
        <div>
          <Link href="/" className="btn btn--orange btn--sm">
            {t.notFound.cta}
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { ArrowRight } from "@/components/navigation/Glyphs";

export default function NotFound() {
  const { t } = useLocale();

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

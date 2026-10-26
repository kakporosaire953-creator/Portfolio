"use client";

import type { ReactNode } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";

export function PageHead({
  index,
  kicker,
  title,
  lede,
  meta,
}: {
  index: string;
  kicker: string;
  title: ReactNode;
  lede: string;
  meta?: { label: string; value: string }[];
}) {
  const { t } = useLocale();

  return (
    <header className="page-head">
      <div className="shell">
        <div className="page-head__top">
          <span className="section-index meta">
            {index} / {kicker}
          </span>
          <span className="meta">{t.common.signatureShort}</span>
        </div>

        <h1 className="page-head__title" data-reveal-lines>
          {title}
        </h1>

        <div className="page-head__bottom">
          <p className="lede page-head__lede">{lede}</p>
          {meta && meta.length > 0 ? (
            <dl className="page-head__meta">
              {meta.map((item) => (
                <div className="page-head__meta-item" key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>
    </header>
  );
}

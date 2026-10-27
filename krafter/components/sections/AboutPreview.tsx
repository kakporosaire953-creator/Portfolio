"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SectionHead } from "./SectionHead";
import { ArrowRight } from "@/components/navigation/Glyphs";
import { asset } from "@/lib/utils/asset";
import { SplitHeading } from "@/components/motion/SplitHeading";

export function AboutPreview() {
  const { t } = useLocale();

  return (
    <section className="section" aria-labelledby="about-preview-title">
      <div className="shell">
        <SectionHead index={t.home.about.index} kicker={t.home.about.kicker} />

        <div className="about-preview">
          <div className="about-preview__media" data-reveal>
            <span className="about-preview__rule" aria-hidden="true" />
            <div className="about-preview__frame">
              {/* eslint-disable-next-line @next/next/no-img-element -- local optimised asset */}
              <img
                src={asset("/images/portrait-navy.jpg")}
                alt={t.hero.portraitAlt}
                width={719}
                height={1081}
                loading="lazy"
                decoding="async"
              />
              <span className="about-preview__tag">{t.common.location}</span>
            </div>
          </div>

          <div className="about-preview__content">
            <span className="about-preview__role">{t.home.about.role}</span>
            <SplitHeading as="h2" className="about-preview__title" id="about-preview-title">
              {t.home.about.title}
            </SplitHeading>
            <div className="about-preview__paragraphs">
              {t.home.about.paragraphs.map((paragraph) => (
                <p key={paragraph} className="body-sm">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="about-preview__fields">
              <span className="meta">{t.home.about.disciplinesLabel}</span>
              <ul className="about-preview__disciplines">
                {t.home.about.disciplines.map((discipline) => (
                  <li key={discipline}>{discipline}</li>
                ))}
              </ul>
            </div>

            <dl className="about-preview__facts" data-reveal-stagger>
              {t.home.about.facts.map((fact) => (
                <div className="about-preview__fact" key={fact.label} data-reveal-item>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>

            <Link href="/a-propos" className="arrow-link">
              {t.home.about.cta}
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

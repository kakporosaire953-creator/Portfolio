"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { PageHead } from "@/components/layout/PageHead";
import { SectionHead } from "@/components/sections/SectionHead";
import { ContactBand } from "@/components/sections/ContactBand";
import { ArrowRight } from "@/components/navigation/Glyphs";
import { profile } from "@/data/profile";
import { asset } from "@/lib/utils/asset";

export function AboutView() {
  const { t, locale } = useLocale();

  return (
    <>
      <PageHead
        index="02"
        kicker={t.about.kicker}
        title={
          <>
            {t.about.title.split(" ").slice(0, -1).join(" ")} <em>{t.about.title.split(" ").slice(-1)}</em>
          </>
        }
        lede={t.about.intro}
        meta={[
          { label: profile.role[locale].split(" × ")[0], value: "Design" },
          { label: profile.role[locale].split(" × ")[1] ?? "Code", value: "Développement" },
          { label: t.contact.locationLabel, value: `${profile.city}, ${profile.country[locale]}` },
        ]}
      />

      <section className="section-tight">
        <div className="shell">
          <div className="about-hero">
            <figure className="about-hero__media" data-reveal-image>
              {/* eslint-disable-next-line @next/next/no-img-element -- local optimised asset */}
              <img
                src={asset("/images/portrait-editorial.jpg")}
                alt={t.hero.portraitAlt}
                width={719}
                height={1273}
                loading="eager"
                decoding="async"
              />
              <figcaption className="about-hero__caption">{t.about.portraitCaption}</figcaption>
            </figure>

            <div className="about-hero__content">
              <SplitHeading as="h2" className="about-hero__title">
                {t.home.story.titleLead} <em>{t.home.story.titleEm}</em>
              </SplitHeading>
              <div className="about-preview__paragraphs">
                {t.home.story.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="body-sm">
                    {paragraph}
                  </p>
                ))}
              </div>

              <dl className="about-identity">
                {t.about.identity.rows.map((row) => (
                  <div className="about-identity__row" key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHead index={t.about.philosophy.index} kicker={t.about.philosophy.kicker}>
            <h2 className="title-2">{t.about.philosophy.title}</h2>
          </SectionHead>

          <div className="philosophy-grid" data-reveal-stagger>
            {t.about.philosophy.items.map((item, index) => (
              <article className="philosophy-card" key={item.title} data-reveal-item>
                <span className="philosophy-card__num">0{index + 1}</span>
                <h3 className="philosophy-card__title">{item.title}</h3>
                <p className="philosophy-card__text">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="shell">
          <SectionHead
            index={t.about.path.index}
            kicker={t.about.path.kicker}
            meta={<span className="meta">{t.about.path.note}</span>}
          >
            <h2 className="title-2">{t.about.path.title}</h2>
          </SectionHead>

          <div className="path-list" data-reveal-stagger>
            {t.about.path.chapters.map((chapter) => (
              <article className="path-item" key={chapter.label} data-reveal-item>
                <span className="path-item__label">{chapter.label}</span>
                <h3 className="path-item__title">{chapter.title}</h3>
                <p className="path-item__text">{chapter.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHead index={t.about.approach.index} kicker={t.about.approach.kicker}>
            <h2 className="title-2">{t.about.approach.title}</h2>
          </SectionHead>

          <div className="approach-grid">
            <p className="lede" data-reveal>
              {t.about.approach.text}
            </p>
            <ul className="approach-list" data-reveal-stagger>
              {t.about.approach.bullets.map((bullet) => (
                <li key={bullet} data-reveal-item>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>

          <div className="center-cta" style={{ justifyContent: "flex-start", marginTop: "2.6rem" }}>
            <Link href="/projets" className="btn btn--ghost">
              {t.common.ctaProjects}
              <ArrowRight size={13} />
            </Link>
            <Link href="/contact" className="arrow-link" style={{ marginLeft: "1.4rem" }}>
              {t.about.cta.title}
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      <ContactBand />
    </>
  );
}

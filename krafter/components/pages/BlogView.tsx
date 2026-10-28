"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { PageHead } from "@/components/layout/PageHead";
import { SectionHead } from "@/components/sections/SectionHead";
import { ContactBand } from "@/components/sections/ContactBand";
import { articles } from "@/data/articles";
import { ArrowRight } from "@/components/navigation/Glyphs";
import { profile } from "@/data/profile";

export function BlogView() {
  const { t, locale } = useLocale();

  return (
    <>
      <PageHead
        index="06"
        kicker={t.blog.kicker}
        title={
          <>
            {t.blog.title.split(" ").slice(0, -1).join(" ")}{" "}
            <em>{t.blog.title.split(" ").slice(-1)}</em>
          </>
        }
        lede={t.blog.intro}
        meta={[
          { label: t.blog.kicker, value: `${articles.length}` },
          { label: t.contact.responseLabel, value: t.contact.responseValue },
        ]}
      />

      <section className="section-tight">
        <div className="shell">
          {articles.length === 0 ? (
            <div className="blog-empty liquid" data-reveal data-glass>
              <span className="blog-empty__badge">
                <span className="orange-dot" aria-hidden="true" />
                {t.blog.emptyTitle}
              </span>
              <h2 className="blog-empty__title">{t.blog.emptyTitle}</h2>
              <p className="blog-empty__text">{t.blog.emptyText}</p>
              <a href={`mailto:${profile.email}`} className="arrow-link" style={{ marginTop: "0.6rem" }}>
                {t.blog.cta}
                <ArrowRight size={13} />
              </a>
            </div>
          ) : (
            <div className="projects-grid">
              {articles.map((article) => (
                <article className="project-card" key={article.slug}>
                  <h2 className="project-card__title">{article.title[locale]}</h2>
                  <p className="project-card__tagline">{article.excerpt[locale]}</p>
                  <span className="meta">
                    {article.topic[locale]} · {article.publishedAt} · {article.readingMinutes} min
                  </span>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section-tight">
        <div className="shell">
          <SectionHead
            index="02"
            kicker={t.blog.upcomingTitle}
            meta={<span className="meta">{t.blog.upcomingNote}</span>}
          >
            <h2 className="title-2">{t.blog.upcomingTitle}</h2>
          </SectionHead>

          <div className="blog-upcoming" data-reveal>
            {t.blog.upcoming.map((topic, index) => (
              <div className="blog-upcoming__item" key={topic.title}>
                <span className="num-band blog-upcoming__band" aria-hidden="true">
                  <span className="num-band__num">0{index + 1}</span>
                </span>
                <span className="blog-upcoming__title">
                  {topic.title}
                  <span className="meta" style={{ display: "block", marginTop: "0.25rem" }}>
                    {t.blog.upcomingNote}
                  </span>
                </span>
                <span className="blog-upcoming__topic">{topic.topic}</span>
              </div>
            ))}
          </div>

          <div className="blog-empty liquid" style={{ marginTop: "2rem" }} data-reveal data-glass>
            <h2 className="blog-empty__title">{t.blog.subscribeTitle}</h2>
            <p className="blog-empty__text">{t.blog.subscribeText}</p>
            <a href={`mailto:${profile.email}?subject=Journal%20THE%20KRAFTER`} className="btn btn--ghost btn--sm" style={{ justifySelf: "start" }}>
              {t.blog.cta}
              <ArrowRight size={12} />
            </a>
          </div>
        </div>
      </section>

      <ContactBand />
    </>
  );
}

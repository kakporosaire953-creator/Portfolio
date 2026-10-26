"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SectionHead } from "./SectionHead";
import { articles } from "@/data/articles";
import { ArrowRight } from "@/components/navigation/Glyphs";

export function BlogPreview() {
  const { t, locale } = useLocale();

  const items =
    articles.length > 0
      ? articles.map((article) => ({
          title: article.title[locale],
          topic: article.topic[locale],
        }))
      : t.blog.upcoming.map((topic) => ({ title: topic.title, topic: topic.topic }));

  return (
    <section className="section-tight" aria-labelledby="blog-preview-title">
      <div className="shell">
        <SectionHead
          index={t.home.blog.index}
          kicker={t.home.blog.kicker}
          meta={<span className="meta">{t.home.blog.emptyLabel}</span>}
        >
          <h2 className="title-2" id="blog-preview-title">
            {t.home.blog.title}
          </h2>
        </SectionHead>

        <div className="blog-preview">
          <div className="blog-empty" data-reveal>
            <span className="blog-empty__badge">
              <span className="orange-dot" aria-hidden="true" />
              {t.blog.emptyTitle}
            </span>
            <p className="blog-empty__text">{t.home.blog.intro}</p>
            <Link href="/blog" className="arrow-link" style={{ marginTop: "0.4rem" }}>
              {t.home.blog.cta}
              <ArrowRight size={14} />
            </Link>
          </div>

          <div data-reveal>
            <span className="meta">{t.blog.upcomingNote}</span>
            <div className="blog-upcoming" style={{ marginTop: "0.9rem" }}>
              {items.map((item, index) => (
                <div className="blog-upcoming__item" key={`${item.title}-${index}`}>
                  <span className="blog-upcoming__index">0{index + 1}</span>
                  <span className="blog-upcoming__title">{item.title}</span>
                  <span className="blog-upcoming__topic">{item.topic}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { CaseStudyCover } from "@/components/motion/CaseStudyCover";
import { ArrowLeft, ArrowUpRight } from "@/components/navigation/Glyphs";
import { getNextProject, type Project } from "@/data/projects";
import { cn } from "@/lib/utils/cn";
import { asset } from "@/lib/utils/asset";

export function CaseStudyView({ project }: { project: Project }) {
  const { t, locale } = useLocale();
  const next = getNextProject(project.slug);
  const study = project.caseStudy;
  const roleLabel =
    project.category === "art-direction"
      ? t.projects.roles.designOnly
      : project.category === "development"
        ? t.projects.roles.development
        : t.projects.roles.design;

  const sections = [
    { key: "overview", title: t.projects.caseStudy.overview, text: study.overview[locale] },
    { key: "context", title: t.projects.caseStudy.context, text: study.context[locale] },
    { key: "challenge", title: t.projects.caseStudy.challenge, text: study.challenge[locale] },
    { key: "approach", title: t.projects.caseStudy.approach, text: study.approach[locale] },
    { key: "design", title: t.projects.caseStudy.design, text: study.design[locale] },
    { key: "development", title: t.projects.caseStudy.development, text: study.development[locale] },
  ];

  return (
    <>
      <article>
        <header className="case-hero">
          <div className="shell">
            <div className="case-hero__bar">
              <Link href="/projets" className="case-hero__back">
                <ArrowLeft size={12} />
                {t.common.backToProjects}
              </Link>
              <span className="case-hero__index">
                {t.projects.caseStudy.index} {project.index} · {project.year}
              </span>
            </div>

            <SplitHeading as="h1" className="case-hero__title" immediate>
              {project.title}
            </SplitHeading>
            <p className="case-hero__tagline">{project.tagline[locale]}</p>

            <dl className="case-hero__meta">
              <div className="case-hero__meta-item">
                <dt>{t.projects.caseStudy.role}</dt>
                <dd>{project.role[locale]}</dd>
              </div>
              <div className="case-hero__meta-item">
                <dt>{t.projects.caseStudy.year}</dt>
                <dd>{project.year}</dd>
              </div>
              <div className="case-hero__meta-item">
                <dt>{t.projects.caseStudy.category}</dt>
                <dd>{roleLabel}</dd>
              </div>
              <div className="case-hero__meta-item">
                <dt>{t.projects.caseStudy.stack}</dt>
                <dd>{project.stack.slice(0, 3).join(", ")}</dd>
              </div>
            </dl>

            {project.cover.kind === "image" ? (
              <CaseStudyCover
                slug={project.slug}
                src={asset(project.cover.src)}
                alt={project.cover.alt[locale]}
                width={project.cover.width}
                height={project.cover.height}
              />
            ) : (
              <div className="case-cover case-cover--graphic">
                <div className={cn("graphic-cover", `graphic-cover--${project.cover.tone}`)}>
                  <span className="graphic-cover__grid" aria-hidden="true" />
                  <span className="graphic-cover__arc" aria-hidden="true" />
                  <span className="graphic-cover__label">{project.cover.label}</span>
                  <span className="graphic-cover__sub">
                    {t.projects.emptyImage} · {project.stack.join(" · ")}
                  </span>
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="shell case-body">
          <aside className="case-aside">
            <div className="case-aside__block">
              <span className="case-aside__label">{t.projects.caseStudy.role}</span>
              <span className="case-aside__value">{project.role[locale]}</span>
            </div>
            <div className="case-aside__block">
              <span className="case-aside__label">{t.projects.caseStudy.stack}</span>
              <div className="case-aside__tags">
                {project.stack.map((tech) => (
                  <span className="tag" key={tech}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="case-aside__block">
              <span className="case-aside__label">{t.projects.caseStudy.year}</span>
              <span className="case-aside__value">{project.year}</span>
            </div>
            <div className="case-aside__block">
              <span className="case-aside__label">{t.projects.caseStudy.live}</span>
              <span className="case-aside__value meta">{t.projects.caseStudy.livePending}</span>
            </div>
            <Link href="/projets" className="arrow-link">
              {t.common.allProjects}
              <ArrowUpRight size={13} />
            </Link>
          </aside>

          <div className="case-content">
            {sections.map((section, index) => (
              <section className="case-section" key={section.key} data-reveal>
                <span className="num-band case-section__band" aria-hidden="true">
                  <span className="num-band__num">0{index + 1}</span>
                </span>
                <div className="case-section__head">
                  <h2 className="case-section__title">{section.title}</h2>
                </div>
                <div className="case-section__text">
                  <p>{section.text}</p>
                </div>
              </section>
            ))}

            <section className="case-section" data-reveal>
              <span className="num-band case-section__band" aria-hidden="true">
                <span className="num-band__num">07</span>
              </span>
              <div className="case-section__head">
                <h2 className="case-section__title">{t.projects.caseStudy.technical}</h2>
              </div>
              <div>
                <div className="case-tech">
                  {study.technical.map((row) => (
                    <div className="case-tech__row" key={row.label[locale]}>
                      <span className="case-tech__label">{row.label[locale]}</span>
                      <span>{row.value[locale]}</span>
                    </div>
                  ))}
                </div>
                {study.note ? (
                  <div className="case-note" style={{ marginTop: "1.2rem" }}>
                    <span className="case-note__label">{t.common.todo}</span>
                    <p>{study.note[locale]}</p>
                  </div>
                ) : null}
              </div>
            </section>

            <section className="case-section" data-reveal>
              <span className="num-band case-section__band" aria-hidden="true">
                <span className="num-band__num">08</span>
              </span>
              <div className="case-section__head">
                <h2 className="case-section__title">{t.projects.caseStudy.results}</h2>
              </div>
              <div className="case-section__text">
                <p>{study.results ? study.results[locale] : t.projects.caseStudy.resultsNone}</p>
              </div>
            </section>

            {study.screens && study.screens.length > 0 ? (
              <div className="case-screens">
                <span className="meta">{t.projects.caseStudy.gallery}</span>
                {study.screens.map((screen) => (
                  <figure className="case-screens__item" key={screen.src}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- local optimised asset */}
                    <img src={asset(screen.src)} alt={screen.alt[locale]} loading="lazy" decoding="async" />
                  </figure>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="shell">
          <div className="case-next">
            <span className="case-next__label">{t.common.nextProject}</span>
            <Link href={`/projets/${next.slug}`} className="case-next__link">
              <span className="case-next__title">
                {next.title}
                <ArrowUpRight size={22} />
              </span>
              <span className="meta">{next.tagline[locale]}</span>
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}

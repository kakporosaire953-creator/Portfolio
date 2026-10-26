"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { PageHead } from "@/components/layout/PageHead";
import { SectionHead } from "@/components/sections/SectionHead";
import { ContactBand } from "@/components/sections/ContactBand";
import { skillGroups } from "@/data/services";

export function SkillsView() {
  const { t, locale } = useLocale();

  return (
    <>
      <PageHead
        index="05"
        kicker={t.skills.kicker}
        title={
          <>
            {t.skills.title.split(" ").slice(0, -1).join(" ")}{" "}
            <em>{t.skills.title.split(" ").slice(-1)}</em>
          </>
        }
        lede={t.skills.intro}
        meta={[
          { label: "01", value: t.skills.coreTitle },
          { label: "02", value: t.skills.methodTitle },
          { label: "03", value: t.skills.labTitle },
        ]}
      />

      <section className="section-tight">
        <div className="shell">
          <SectionHead index="01" kicker={t.skills.coreTitle} />
          <div className="skills-layout">
            {skillGroups.map((group) => (
              <section className="skill-group" key={group.id} data-reveal>
                <h2 className="skill-group__title">{group.title[locale]}</h2>
                <div className="skill-group__items" data-reveal-stagger>
                  {group.items.map((item) => (
                    <div className="skill-item" key={item.name} data-reveal-item>
                      <span className="skill-item__name">{item.name}</span>
                      <span className="skill-item__context">{item.context[locale]}</span>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <p className="skills-note" data-reveal>
            {t.skills.honestNote}
          </p>
        </div>
      </section>

      <section className="section-tight">
        <div className="shell">
          <div className="skills-aside">
            <div className="skills-panel" data-reveal>
              <h2 className="skills-panel__title">{t.skills.methodTitle}</h2>
              <ul className="skills-panel__list">
                {t.skills.methodItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="skills-panel" data-reveal>
              <h2 className="skills-panel__title">{t.skills.labTitle}</h2>
              <p className="body-sm">{t.skills.labText}</p>
              <div className="skills-panel__list" style={{ marginTop: "0.6rem" }}>
                <span className="meta">Three.js · WebGL · Serverless</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactBand />
    </>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { PageHead } from "@/components/layout/PageHead";
import { SectionHead } from "@/components/sections/SectionHead";
import { ContactBand } from "@/components/sections/ContactBand";
import { skillGroups } from "@/data/services";

/**
 * Tools proven on this site: each one is a dependency or an asset actually
 * shipped here, so the flag can be checked by anyone who opens the inspector.
 * No other tool claims it.
 */
const SHIPPED_HERE = new Set([
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "GSAP",
  "anime.js",
  "Three.js",
  "Git",
  "Vercel",
]);
// Tailwind is installed and its reset ships, but this site's design system is
// hand-written CSS: claiming it as "used here" would overstate it, so it stays
// unflagged like the rest.

const pad = (value: number) => String(value).padStart(2, "0");

export function SkillsView() {
  const { t, locale } = useLocale();
  const wallRef = useRef<HTMLDivElement>(null);

  const total = skillGroups.reduce((sum, group) => sum + group.items.length, 0);
  const shipped = skillGroups.reduce(
    (sum, group) => sum + group.items.filter((item) => SHIPPED_HERE.has(item.name)).length,
    0,
  );

  /**
   * One delegated listener for the whole wall: the spotlight follows the pointer
   * through CSS variables on the card under it, so nothing re-renders and the
   * cleanup is a single call.
   */
  useEffect(() => {
    const wall = wallRef.current;
    if (!wall) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let current: HTMLElement | null = null;
    let frame = 0;
    let point = { x: 0, y: 0 };

    const paint = () => {
      frame = 0;
      if (!current) return;
      const rect = current.getBoundingClientRect();
      current.style.setProperty("--mx", `${point.x - rect.left}px`);
      current.style.setProperty("--my", `${point.y - rect.top}px`);
    };

    const onMove = (event: PointerEvent) => {
      const card = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-tool]");
      if (card !== current) {
        current?.removeAttribute("data-lit");
        current = card ?? null;
        current?.setAttribute("data-lit", "");
      }
      if (!current) return;
      point = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onLeave = () => {
      current?.removeAttribute("data-lit");
      current = null;
    };

    wall.addEventListener("pointermove", onMove, { passive: true });
    wall.addEventListener("pointerleave", onLeave, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      wall.removeEventListener("pointermove", onMove);
      wall.removeEventListener("pointerleave", onLeave);
      current?.removeAttribute("data-lit");
    };
  }, []);

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

          {/* Counts, not levels: three numbers anyone can verify on the page. */}
          <dl className="tool-counts" data-reveal-stagger>
            <div className="tool-counts__item" data-reveal-item>
              <dt className="tool-counts__label">{t.skills.toolsLabel}</dt>
              <dd className="tool-counts__value">{pad(total)}</dd>
            </div>
            <div className="tool-counts__item" data-reveal-item>
              <dt className="tool-counts__label">{t.skills.familiesLabel}</dt>
              <dd className="tool-counts__value">{pad(skillGroups.length)}</dd>
            </div>
            <div className="tool-counts__item tool-counts__item--accent" data-reveal-item>
              <dt className="tool-counts__label">{t.skills.usedLabel}</dt>
              <dd className="tool-counts__value">{pad(shipped)}</dd>
            </div>
          </dl>

          <div className="tool-wall" ref={wallRef}>
            {skillGroups.map((group, groupIndex) => (
              <section className="tool-group" key={group.id} data-reveal-stagger>
                <header className="tool-group__head">
                  <span className="tool-group__index" aria-hidden="true">
                    {pad(groupIndex + 1)}
                  </span>
                  <h2 className="tool-group__title">{group.title[locale]}</h2>
                  <span className="tool-group__count meta">
                    {pad(group.items.length)}
                  </span>
                </header>

                <ul className="tool-grid">
                  {group.items.map((item, index) => {
                    const shippedHere = SHIPPED_HERE.has(item.name);
                    return (
                      <li
                        className="tool-card"
                        key={item.name}
                        data-tool
                        data-reveal-item
                        data-shipped={shippedHere ? "" : undefined}
                      >
                        <div className="tool-card__top">
                          <h3 className="tool-card__name">{item.name}</h3>
                          <span className="tool-card__num" aria-hidden="true">
                            {pad(index + 1)}
                          </span>
                        </div>
                        <p className="tool-card__context">{item.context[locale]}</p>
                        {shippedHere ? (
                          <span className="tool-card__flag">
                            <span className="tool-card__flag-dot" aria-hidden="true" />
                            {t.skills.usedHere}
                          </span>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
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

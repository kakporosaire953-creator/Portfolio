"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { SectionHead } from "./SectionHead";

export function Process() {
  const { t } = useLocale();

  return (
    <section className="section-tight" aria-labelledby="process-title">
      <div className="shell">
        <SectionHead index={t.home.process.index} kicker={t.home.process.kicker}>
          <h2 className="title-2" id="process-title">
            {t.home.process.title}
          </h2>
          <p className="body-sm" style={{ maxWidth: "34rem" }}>
            {t.home.process.intro}
          </p>
        </SectionHead>

        <ol className="process-grid" data-reveal-stagger>
          {t.home.process.steps.map((step, index) => (
            <li className="process-card" key={step.label} data-reveal-item>
              <span className="process-card__num">0{index + 1}</span>
              <div>
                <h3 className="process-card__title">{step.label}</h3>
                <p className="process-card__text">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

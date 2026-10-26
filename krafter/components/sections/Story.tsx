"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { KrafterGeometry } from "@/components/svg/KrafterGeometry";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SplitHeading } from "@/components/motion/SplitHeading";

export function Story() {
  const { t } = useLocale();

  return (
    <section className="story" aria-labelledby="story-title">
      <KrafterGeometry className="story__geometry" tone="dark" />

      <div className="shell story__inner">
        <div>
          <span className="section-index meta">
            {t.home.story.index} / {t.home.story.kicker}
          </span>
          <SplitHeading as="h2" className="story__title" id="story-title">
            {t.home.story.titleLead} <em>{t.home.story.titleEm}</em>
          </SplitHeading>
          <div style={{ marginTop: "1.6rem" }} data-reveal>
            <BrandLogo variant="brand" />
          </div>
        </div>

        <div>
          <div className="story__paragraphs">
            {t.home.story.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="story__principles" data-reveal-stagger>
            {t.home.story.principles.map((principle) => (
              <div className="story__principle" key={principle.title} data-reveal-item>
                <h3 className="story__principle-title">{principle.title}</h3>
                <p>{principle.text}</p>
              </div>
            ))}
          </div>

          <p className="story__signature">
            {t.home.story.signatureLine}
            <span>{t.common.signature}</span>
          </p>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { services } from "@/data/services";
import { SectionHead } from "./SectionHead";
import { ArrowUpRight } from "@/components/navigation/Glyphs";

export function ServicesPreview() {
  const { t, locale } = useLocale();

  return (
    <section className="section-tight" aria-labelledby="services-preview-title">
      <div className="shell">
        <SectionHead index={t.home.services.index} kicker={t.home.services.kicker}>
          <h2 className="title-2" id="services-preview-title">
            {t.home.services.title}
          </h2>
          <p className="body-sm" style={{ maxWidth: "34rem" }}>
            {t.home.services.intro}
          </p>
        </SectionHead>

        <div className="service-rows">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services#${service.id}`}
              className="service-row"
              data-reveal-item
            >
              <span className="service-row__index">{service.index}</span>
              <span className="service-row__title">{service.title[locale]}</span>
              <span className="service-row__tagline">{service.tagline[locale]}</span>
              <span className="service-row__arrow" aria-hidden="true">
                <ArrowUpRight size={14} />
              </span>
            </Link>
          ))}
        </div>

        <div className="center-cta">
          <Link href="/services" className="arrow-link">
            {t.home.services.cta}
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

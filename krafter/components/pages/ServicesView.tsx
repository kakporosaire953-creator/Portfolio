"use client";

import { useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { PageHead } from "@/components/layout/PageHead";
import { SectionHead } from "@/components/sections/SectionHead";
import { ContactBand } from "@/components/sections/ContactBand";
import { services, processSteps } from "@/data/services";

function Faq() {
  const { t } = useLocale();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section-tight">
      <div className="shell">
        <SectionHead index="03" kicker={t.services.faqTitle} />
        <div className="faq-list">
          {t.services.faq.map((item, index) => {
            const isOpen = open === index;
            return (
              <div className="faq-item" key={item.q} data-open={isOpen}>
                <button
                  type="button"
                  className="faq-item__trigger"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${index}`}
                  id={`faq-trigger-${index}`}
                  onClick={() => setOpen(isOpen ? null : index)}
                >
                  <span>{item.q}</span>
                  <span className="faq-item__icon" aria-hidden="true" />
                </button>
                <div
                  className="faq-item__panel"
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${index}`}
                  aria-hidden={!isOpen}
                >
                  <div className="faq-item__panel-inner">
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ServicesView() {
  const { t, locale } = useLocale();

  return (
    <>
      <PageHead
        index="03"
        kicker={t.services.kicker}
        title={
          <>
            {t.services.title.split(" ").slice(0, -1).join(" ")}{" "}
            <em>{t.services.title.split(" ").slice(-1)}</em>
          </>
        }
        lede={t.services.intro}
        meta={[
          { label: "01", value: t.services.listTitle },
          { label: "02", value: t.services.processTitle },
          { label: "03", value: t.services.faqTitle },
        ]}
      />

      <section className="section-tight">
        <div className="shell">
          <SectionHead index="01" kicker={t.services.kicker}>
            <h2 className="title-2">{t.services.listTitle}</h2>
          </SectionHead>

          <div className="service-blocks">
            {services.map((service) => (
              <article className="service-block" id={service.id} key={service.id} data-reveal>
                <span className="num-band service-block__band" aria-hidden="true">
                  <span className="num-band__num">{service.index}</span>
                </span>
                <div className="service-block__head">
                  <h3 className="service-block__title">{service.title[locale]}</h3>
                  <p className="service-block__tagline">{service.tagline[locale]}</p>
                  <div className="service-block__deliverables">
                    {service.deliverables.map((item) => (
                      <span className="tag" key={item}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="service-block__body">
                  <p className="service-block__summary">{service.summary[locale]}</p>

                  <div>
                    <span className="meta">{t.services.includesLabel}</span>
                    <div className="service-block__includes" style={{ marginTop: "0.6rem" }}>
                      {service.includes.map((item) => (
                        <span className="service-block__include" key={item[locale]}>
                          {item[locale]}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="service-block__audience">
                    <span>{t.services.forWhomLabel}</span>
                    <span>{service.audience[locale]}</span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="shell">
          <SectionHead
            index="02"
            kicker={t.services.processTitle}
            meta={<span className="meta">{t.services.processNote}</span>}
          >
            <h2 className="title-2">{t.home.process.title}</h2>
          </SectionHead>

          <ol className="process-grid" data-reveal-stagger>
            {processSteps.map((step) => (
              <li className="process-card liquid" key={step.index} data-reveal-item data-glass>
                <span className="num-band process-card__band" aria-hidden="true">
                  <span className="num-band__num">{step.index}</span>
                </span>
                <div className="process-card__body">
                  <h3 className="process-card__title">{step.label[locale]}</h3>
                  <p className="process-card__text">{step.text[locale]}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Faq />
      <ContactBand />
    </>
  );
}

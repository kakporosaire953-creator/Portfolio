"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";

import { KrafterGeometry } from "@/components/svg/KrafterGeometry";
import { ArrowRight, ArrowUpRight } from "@/components/navigation/Glyphs";
import { profile } from "@/data/profile";
import { Magnetic } from "@/components/motion/Magnetic";

export function ContactBand() {
  const { t } = useLocale();

  return (
    <section className="contact-band" aria-labelledby="contact-band-title">
      <KrafterGeometry className="contact-band__geometry" />

      <div className="shell contact-band__inner">
        <div>
          <span className="section-index meta">{t.home.cta.kicker}</span>
          <h2 className="contact-band__title" id="contact-band-title" data-reveal-lines>
            <span className="line-mask">
              <span>{t.home.cta.lines[0]}</span>
            </span>
            <span className="line-mask">
              <span>
                <em>{t.home.cta.lines[1]}</em>
              </span>
            </span>
          </h2>
        </div>

        <div className="contact-band__aside">
          <p className="contact-band__text">{t.home.cta.text}</p>
          <Magnetic>
            <Link href="/contact" className="btn btn--orange">
              {t.common.ctaContact}
              <ArrowRight size={14} />
            </Link>
          </Magnetic>
          <a href={`mailto:${profile.email}`} className="contact-band__mail">
            {profile.email}
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </section>
  );
}

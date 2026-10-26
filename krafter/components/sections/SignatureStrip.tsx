"use client";

import { Fragment } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/utils/cn";

/**
 * Editorial band: DESIGN • CODE • IMPACT, slowly scrolling.
 * Two identical groups loop seamlessly (animation to -50%); paused on hover and
 * disabled entirely with prefers-reduced-motion.
 */
export function SignatureStrip() {
  const { t } = useLocale();
  const words = [...t.marquee.words, t.common.concept, t.common.signature];

  return (
    <section className="signature-strip" aria-label={t.common.concept}>
      <div className="signature-strip__track">
        {[0, 1].map((group) => (
          <span className="signature-strip__group" key={group} aria-hidden={group === 1}>
            {words.map((word, index) => (
              <Fragment key={`${group}-${word}`}>
                <span
                  className={cn(
                    "signature-strip__word",
                    (index + group) % 3 === 1 && "signature-strip__word--outline",
                  )}
                >
                  {word}
                </span>
                <span className="signature-strip__dot" aria-hidden="true" />
              </Fragment>
            ))}
          </span>
        ))}
      </div>
    </section>
  );
}

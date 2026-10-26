"use client";

import { useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useBrandAsset } from "./BrandAssetProvider";
import { cn } from "@/lib/utils/cn";

/**
 * THE KRAFTER — full logo.
 *
 * RULE: the authentic full lockup (large K, orbital arc, handwritten “The”,
 * KRAFTER wordmark, original navy/orange/yellow/blue accents and the
 * “CRÉER • INSPIRER • IMPACTER” signature) must never be redrawn or replaced.
 *
 * The real file is not present in this repository, so the component looks for
 * it in /public/brand and otherwise renders a clearly identified slot instead
 * of an artificial logo.
 */
const LOGO_SOURCES = [
  "/brand/the-krafter-logo.svg",
  "/brand/the-krafter-logo.png",
  "/brand/the-krafter-logo.webp",
] as const;

type BrandLogoProps = {
  variant?: "header" | "footer" | "brand";
  className?: string;
  /** Show the instruction line under the slot (footer / brand presentation). */
  withHint?: boolean;
};

export function BrandLogo({ variant = "header", className, withHint }: BrandLogoProps) {
  const { t } = useLocale();
  const { hasLogo } = useBrandAsset();
  const [sourceIndex, setSourceIndex] = useState(0);
  const missing = !hasLogo || sourceIndex >= LOGO_SOURCES.length;

  if (!missing) {
    return (
      <span className={cn("brand-logo", `brand-logo--${variant}`, className)}>
        {/* eslint-disable-next-line @next/next/no-img-element -- brand asset, must keep original proportions & colours */}
        <img
          src={LOGO_SOURCES[sourceIndex]}
          alt={t.brand.logoAlt}
          className="brand-logo__img"
          decoding="async"
          onError={() => setSourceIndex((index) => index + 1)}
        />
      </span>
    );
  }

  return (
    <span
      className={cn("logo-slot", `logo-slot--${variant}`, className)}
      role="img"
      aria-label={`${t.brand.logoSlotTitle} — ${t.brand.name}`}
      title={t.brand.logoSlotLine}
    >
      <span className="logo-slot__frame" aria-hidden="true">
        <span className="logo-slot__tag">LOGO</span>
        <span className="logo-slot__tag logo-slot__tag--sub">SLOT</span>
      </span>
      <span className="logo-slot__text" aria-hidden="true">
        <span className="logo-slot__word">THE KRAFTER</span>
        <span className="logo-slot__signature">{t.common.signatureShort}</span>
      </span>
      {withHint ? <span className="logo-slot__hint">{t.brand.logoSlotLine}</span> : null}
    </span>
  );
}

/** Court signature used in editorial captions and the footer baseline. */
export function BrandSignature({ className }: { className?: string }) {
  const { t } = useLocale();
  return (
    <span className={cn("brand-signature", className)}>
      <span className="brand-signature__line" aria-hidden="true" />
      {t.common.signature}
    </span>
  );
}

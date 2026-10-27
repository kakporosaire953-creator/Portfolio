"use client";

import { useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/utils/cn";
import { asset } from "@/lib/utils/asset";

/**
 * THE KRAFTER — official brand files.
 *
 * The authentic artwork supplied by Rosaire Kakpo is displayed as-is, never
 * redrawn: the full lockup (large K, orbital arcs, handwritten “The”, KRAFTER
 * wordmark, the orange/blue “E” and the CRÉER · INSPIRER · IMPACTER line), the
 * wordmark alone and the K monogram.
 *
 * Navigation rule: the header shows the WORDMARK only, so the K never appears
 * twice on the first screen. The monogram is reserved for the favicon and the
 * brand mark inside the story section.
 */
const SOURCES = {
  lockup: "/brand/the-krafter-logo.png",
  wordmark: "/brand/the-krafter-wordmark.png",
  mark: "/brand/the-krafter-mark.png",
} as const;

type Variant = "header" | "footer" | "brand" | "mark";

export function BrandLogo({
  variant = "header",
  className,
  decorative = false,
}: {
  variant?: Variant;
  className?: string;
  /** Hide from assistive tech when a visible text label sits next to it. */
  decorative?: boolean;
}) {
  const { t } = useLocale();
  const [failed, setFailed] = useState(false);

  const source = variant === "mark" ? SOURCES.mark : variant === "header" ? SOURCES.wordmark : SOURCES.lockup;
  if (failed) return null;

  return (
    <span className={cn("brand-logo", `brand-logo--${variant}`, className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- brand artwork, original proportions and colours */}
      <img
        src={asset(source)}
        alt={decorative ? "" : t.brand.logoAlt}
        aria-hidden={decorative || undefined}
        className="brand-logo__img"
        width={variant === "header" ? 760 : variant === "mark" ? 512 : 760}
        height={variant === "header" ? 144 : variant === "mark" ? 512 : 663}
        decoding="async"
        onError={() => setFailed(true)}
      />
    </span>
  );
}

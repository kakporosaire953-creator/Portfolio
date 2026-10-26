"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";

export function SkipLink() {
  const { t } = useLocale();
  return (
    <a href="#main" className="skip-link">
      {t.common.skip}
    </a>
  );
}

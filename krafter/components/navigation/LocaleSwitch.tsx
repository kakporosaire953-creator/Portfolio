"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/utils/cn";

const OPTIONS = [
  { value: "fr", label: "FR", name: "Français" },
  { value: "en", label: "EN", name: "English" },
] as const;

/** Compact FR/EN switch — no flags, real content swap. */
export function LocaleSwitch({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      className={cn("locale-switch", className)}
      role="group"
      aria-label={t.common.language}
      data-active={locale}
    >
      <span className="locale-switch__indicator" aria-hidden="true" />
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className="locale-switch__option"
          onClick={() => setLocale(option.value)}
          aria-pressed={locale === option.value}
          aria-label={option.name}
          lang={option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

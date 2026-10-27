"use client";

import { useTheme } from "./ThemeProvider";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/utils/cn";

/**
 * KRAFTER / GLASS SWITCH
 * A refined glass capsule: sun and moon under a moving lens, a discreet orange
 * edge, keyboard operable via role="switch".
 * The material relies on CSS backdrop-filter with a frosted fallback — no WebGL
 * refraction is applied to DOM elements.
 */
export function GlassSwitch({
  className,
  showLabel = false,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  const { theme, toggleTheme, mounted } = useTheme();
  const { t } = useLocale();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={`${t.common.theme} : ${isDark ? t.common.themeDark : t.common.themeLight}`}
      title={isDark ? t.common.themeLight : t.common.themeDark}
      onClick={toggleTheme}
      data-state={isDark ? "dark" : "light"}
      data-mounted={mounted ? "true" : "false"}
      className={cn("glass-switch", className)}
    >
      <span className="glass-switch__row" aria-hidden="true">
        <span className="glass-switch__icon glass-switch__icon--sun">
          <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.3">
            <circle cx="8" cy="8" r="2.7" />
            <path
              d="M8 1.1v1.7M8 13.2v1.7M1.1 8h1.7M13.2 8h1.7M3.2 3.2l1.2 1.2M11.6 11.6l1.2 1.2M12.8 3.2l-1.2 1.2M4.4 11.6l-1.2 1.2"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <span className="glass-switch__icon glass-switch__icon--moon">
          <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.3">
            <path d="M13.1 9.7A5.7 5.7 0 0 1 6.3 2.9a5.7 5.7 0 1 0 6.8 6.8Z" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="glass-switch__lens">
          <span className="glass-switch__lens-dot" />
        </span>
      </span>
      {showLabel ? (
        <span className="glass-switch__label">
          {isDark ? t.common.themeDark : t.common.themeLight}
        </span>
      ) : null}
    </button>
  );
}

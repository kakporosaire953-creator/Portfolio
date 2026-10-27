"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LocaleProvider>{children}</LocaleProvider>
    </ThemeProvider>
  );
}

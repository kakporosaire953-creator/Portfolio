"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { BrandAssetProvider } from "@/components/brand/BrandAssetProvider";

export function Providers({
  children,
  hasLogo,
}: {
  children: ReactNode;
  hasLogo: boolean;
}) {
  return (
    <BrandAssetProvider hasLogo={hasLogo}>
      <ThemeProvider>
        <LocaleProvider>{children}</LocaleProvider>
      </ThemeProvider>
    </BrandAssetProvider>
  );
}

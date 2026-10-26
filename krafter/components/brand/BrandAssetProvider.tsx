"use client";

import { createContext, useContext } from "react";

/**
 * Tells the client-side logo component whether the official file is present.
 * The answer is computed on the server at build time (see app/layout.tsx), so
 * the placeholder slot is what gets server-rendered when the asset is missing —
 * no broken image, no layout shift.
 */
const BrandAssetContext = createContext<{ hasLogo: boolean }>({ hasLogo: false });

export function BrandAssetProvider({
  hasLogo,
  children,
}: {
  hasLogo: boolean;
  children: React.ReactNode;
}) {
  return <BrandAssetContext.Provider value={{ hasLogo }}>{children}</BrandAssetContext.Provider>;
}

export function useBrandAsset() {
  return useContext(BrandAssetContext);
}

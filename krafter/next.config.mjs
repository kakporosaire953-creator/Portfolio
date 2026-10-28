/** @type {import('next').NextConfig} */
const basePath = process.env.SITE_BASE_PATH ?? "";
const staticExport = process.env.NEXT_STATIC_EXPORT === "1";

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { formats: ["image/webp"], unoptimized: staticExport },
  allowedDevOrigins: ["*.e2b.app", "*.vercel.app", "localhost", "127.0.0.1"],
  // The site is served from the domain root on Vercel, so there is no base
  // path. SITE_BASE_PATH remains an override for a sub-path host only.
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  ...(staticExport ? { output: "export", trailingSlash: true } : {}),
};

export default nextConfig;

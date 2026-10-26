/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const staticExport = process.env.NEXT_STATIC_EXPORT === "1";

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { formats: ["image/webp"], unoptimized: staticExport },
  allowedDevOrigins: ["*.e2b.app", "*.vercel.app", "localhost", "127.0.0.1"],
  // GitHub Pages serves this project from /Portfolio; `npm run build:static`
  // sets NEXT_PUBLIC_BASE_PATH so links, bundles and public assets agree.
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  ...(staticExport ? { output: "export", trailingSlash: true } : {}),
};

export default nextConfig;

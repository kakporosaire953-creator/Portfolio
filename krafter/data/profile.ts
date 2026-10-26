import type { Locale } from "./translations";

export const profile = {
  firstName: "Rosaire",
  lastName: "Kakpo",
  fullName: "Rosaire Kakpo",
  brand: "THE KRAFTER",
  role: { fr: "Frontend Developer × UI/UX Designer", en: "Frontend Developer × UI/UX Designer" },
  email: "kakporosaire953@gmail.com",
  github: "https://github.com/kakporosaire953-creator",
  site: "https://kakpo-rosaire.vercel.app",
  city: "Cotonou",
  country: { fr: "Bénin", en: "Benin" },
  domain: { fr: "Bénin", en: "Benin" },
  yearsActive: "—",
  signature: { fr: "Créer • Inspirer • Impacter", en: "Create • Inspire • Impact" },
  signatureLine: {
    fr: "Designed in Benin. Built for the digital world.",
    en: "Designed in Benin. Built for the digital world.",
  },
} as const;

/** Sidebar destinations. Order defines the vertical rail and the mobile menu. */
export const navItems = [
  { key: "home", href: "/", icon: "home" },
  { key: "about", href: "/a-propos", icon: "about" },
  { key: "services", href: "/services", icon: "services" },
  { key: "projects", href: "/projets", icon: "projects" },
  { key: "skills", href: "/competences", icon: "skills" },
  { key: "blog", href: "/blog", icon: "blog" },
  { key: "contact", href: "/contact", icon: "contact" },
] as const;

export type NavKey = (typeof navItems)[number]["key"];
export type NavIcon = (typeof navItems)[number]["icon"];

export const footerGroups = {
  nav: ["home", "about", "projects", "services", "skills", "blog", "contact"] as NavKey[],
};

export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export const locales: Locale[] = ["fr", "en"];

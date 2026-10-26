import type { Localized } from "./projects";

export type Article = {
  slug: string;
  title: Localized;
  excerpt: Localized;
  topic: Localized;
  publishedAt: string;
  readingMinutes: number;
  body: Localized[];
};

/**
 * Honest empty state: no article has been published yet.
 * When a real article is added here, /blog and the home preview update themselves.
 */
export const articles: Article[] = [];

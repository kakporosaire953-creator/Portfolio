import type { Metadata } from "next";
import { BlogView } from "@/components/pages/BlogView";
import { fr } from "@/data/translations";

export const metadata: Metadata = {
  title: fr.meta.blog.title,
  description: fr.meta.blog.description,
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return <BlogView />;
}

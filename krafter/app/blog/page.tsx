import type { Metadata } from "next";
import { BlogView } from "@/components/pages/BlogView";
import { JsonLd } from "@/components/seo/JsonLd";
import { fr } from "@/data/translations";
import { breadcrumb, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: fr.meta.blog.title,
  description: fr.meta.blog.description,
  path: "/blog",
});

const crumbs = breadcrumb([{ name: "Journal", path: "/blog" }]);

export default function BlogPage() {
  return (
    <>
      <JsonLd data={crumbs} />
      <BlogView />
    </>
  );
}

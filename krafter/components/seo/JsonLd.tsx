/**
 * Structured data block.
 *
 * Rendered on the server, one compact script per page. Search engines read the
 * breadcrumb and the case-study records; visitors never see anything.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

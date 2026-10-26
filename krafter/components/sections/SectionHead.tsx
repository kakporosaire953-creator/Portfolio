import type { ReactNode } from "react";

export function SectionHead({
  index,
  kicker,
  meta,
  children,
}: {
  index: string;
  kicker: string;
  meta?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="section-head">
      <div className="stack-sm">
        <span className="section-index meta">
          {index} / {kicker}
        </span>
        {children}
      </div>
      {meta ? <div className="section-head__meta">{meta}</div> : null}
    </header>
  );
}

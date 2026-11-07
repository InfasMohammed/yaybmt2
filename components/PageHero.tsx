import type { ReactNode } from "react";
import Breadcrumbs from "./Breadcrumbs";

/** Shared inner-page title band: breadcrumbs, eyebrow, the page's single H1 and an optional intro. */
export default function PageHero({
  crumbs,
  eyebrow,
  title,
  children,
  aside,
}: {
  crumbs?: { name: string; path: string }[];
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="page-hero">
      <div className="page-hero-inner">
        {crumbs && <Breadcrumbs items={crumbs} />}
        <div className="page-hero-row">
          <div className="page-hero-copy">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h1>{title}</h1>
            {children}
          </div>
          {aside && <div className="page-hero-aside">{aside}</div>}
        </div>
      </div>
    </div>
  );
}

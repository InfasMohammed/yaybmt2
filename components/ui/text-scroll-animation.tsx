"use client";

import { useEffect, useRef } from "react";
import { brands } from "../../data/brands";
import { brandLogos } from "../../data/brand-logos";
import "../../app/brand-scroll.css";

const logoBrands = brands.filter((brand) => brandLogos[brand.slug]);

function LogoItem({
  brand,
  copy = false,
}: {
  brand: (typeof logoBrands)[number];
  copy?: boolean;
}) {
  const logo = brandLogos[brand.slug];
  return (
    <div className="brand-scroll-card">
      <a
        href={`/brand/${brand.slug}/`}
        className="brand-scroll-link"
        tabIndex={copy ? -1 : undefined}
      >
        <span className="brand-scroll-image">
          <img
            src={logo.src}
            width={logo.width}
            height={logo.height}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </span>
        <span className="brand-scroll-name">{brand.name}</span>
      </a>
      {!copy && brand.distributorNote && (
        <small className="distributor-note">{brand.distributorNote}</small>
      )}
    </div>
  );
}

/**
 * Infinite logo marquee (logo-cloud pattern): one real, focusable set of links plus an
 * aria-hidden duplicate for the seamless loop. Static wrapping row under reduced motion
 * or without JavaScript.
 */
export default function ScrollLogoAssembly() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      element.dataset.motion = reduced.matches ? "static" : "marquee";
    };
    update();
    reduced.addEventListener("change", update);
    return () => reduced.removeEventListener("change", update);
  }, []);
  return (
    <div className="brand-scroll" data-motion="static" ref={root}>
      <div className="brand-marquee-track">
        <div className="brand-scroll-grid">
          {logoBrands.map((brand) => (
            <LogoItem key={brand.slug} brand={brand} />
          ))}
        </div>
        <div className="brand-scroll-grid brand-marquee-copy" aria-hidden="true">
          {logoBrands.map((brand) => (
            <LogoItem key={brand.slug} brand={brand} copy />
          ))}
        </div>
      </div>
    </div>
  );
}

import BrandBadge from "./BrandBadge";
import type { CatalogueItem } from "../data/types";
import { brands } from "../data/brands";
export function Placeholder() {
  return (
    <div className="placeholder">
      <span aria-hidden="true">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.3"
          />
          <circle cx="9" cy="10" r="1.6" stroke="currentColor" strokeWidth="1.3" />
          <path
            d="m4 17 5-4 4 3 3-2 4 3"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <small>PRODUCT PHOTOGRAPH</small>
      <p>Awaiting original image</p>
    </div>
  );
}
export default function Card({ product: p }: { product: CatalogueItem }) {
  const image = p.images[0];
  return (
    <article className="card">
      <a href={"/product/" + p.slug + "/"}>
        <div className="image-frame">
          {image ? (
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              decoding="async"
              width={image.width || 600}
              height={image.height || 600}
            />
          ) : (
            <Placeholder />
          )}
          <BrandBadge brand={p.brand} />
          {p.focus && <span className="focus-pill">Top product</span>}
          <span className="card-quick" aria-hidden="true">
            View details
          </span>
        </div>
        <div className="card-name">
          <small>
            {brands.find((b) => b.slug === p.brand)?.name || "PRODUCT"}
          </small>
          <h3>{p.name}</h3>
          <p className="model">{p.model ? "Model · " + p.model : ""}</p>
        </div>
        <div className="card-bottom">
          View product
          <span className="card-arrow" aria-hidden="true">
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M6 18 18 6M8 6h10v10"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          </span>
        </div>
      </a>
    </article>
  );
}

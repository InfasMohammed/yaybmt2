import PageHero from "./PageHero";
import { pagePath } from "../lib/pagination";
import type { Taxonomy } from "../data/types";
import { catalogueItem } from "../lib/catalogue-data";
import { products } from "../data/products";
import { categories } from "../data/categories";
import { inCategory } from "../lib/catalogue";
import { whatsapp } from "../lib/site";
import Catalogue from "./Catalogue";
export default function ArchivePage({
  term,
  kind,
  page = 1,
}: {
  term: Taxonomy;
  page?: number;
  kind: "brand" | "category";
}) {
  const items = products.filter((p) =>
    kind === "brand" ? p.brand === term.slug : inCategory(p, term.slug),
  );
  const children =
    kind === "category"
      ? categories.filter(
          (c) =>
            c.slug.startsWith(term.slug + "/") &&
            c.slug.split("/").length === term.slug.split("/").length + 1,
        )
      : [];
  return (
    <main id="main" className="page">
      <PageHero
        crumbs={[
          { name: "Home", path: "/" },
          {
            name: kind === "brand" ? "Brands" : "Categories",
            path: kind === "brand" ? "/brands/" : "/categories/",
          },
          {
            name: term.name + (page > 1 ? " – Page " + page : ""),
            path: pagePath(
              (kind === "brand" ? "/brand/" : "/product-category/") +
                term.slug +
                "/",
              page,
            ),
          },
        ]}
        eyebrow={kind === "brand" ? "BRAND" : "PRODUCT RANGE"}
        title={term.name}
        aside={
          <p className="page-hero-stat">
            <strong>{items.length}</strong>
            {items.length === 1 ? " product" : " products"}
          </p>
        }
      >
        {kind === "brand" && term.distributorNote && (
          <p className="distributor-note">{term.distributorNote}</p>
        )}
      </PageHero>
      {items.length ? (
        <>
          <Catalogue
            items={items.map(catalogueItem)}
            initialPage={page}
            scopeBrand={
              kind === "brand"
                ? { slug: term.slug, name: term.name }
                : undefined
            }
            basePath={
              (kind === "brand" ? "/brand/" : "/product-category/") +
              term.slug +
              "/"
            }
          />
        </>
      ) : (
        <section className="empty-state">
          <h2>Catalogue details are being prepared.</h2>
          <p>
            No published product records are assigned to {term.name} in the
            supplied catalogue. This does not indicate stock or availability.
          </p>
          <p>Tell us the models or specifications you need.</p>
          <div className="enquiry-actions">
            <a className="button outline" href={whatsapp(term.name)}>
              Enquire on WhatsApp
            </a>
          </div>
        </section>
      )}
      {children.length > 0 && (
        <section>
          <h2>Explore this range</h2>
          <div className="directory">
            {children.map((c) => (
              <a href={"/product-category/" + c.slug + "/"} key={c.slug}>
                {c.name}
                <span aria-hidden="true">→</span>
              </a>
            ))}
          </div>
        </section>
      )}
      <p>
        <a className="text-link" href="/shop/">
          Browse imported products
        </a>
      </p>
    </main>
  );
}

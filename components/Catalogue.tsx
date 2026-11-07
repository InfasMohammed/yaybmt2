"use client";

import { cataloguePDF } from "../lib/catalogue-file";

import { useEffect, useRef, useState } from "react";
import { brands } from "../data/brands";
import { categories } from "../data/categories";
import type { CatalogueItem } from "../data/types";
import {
  emptyFilters,
  filterProducts,
  inCategory,
  readFilters,
  writeFilters,
  type Filters,
} from "../lib/catalogue";
import Card from "./Card";

import { pageSize as PAGE_SIZE, pagePath } from "../lib/pagination";

export default function Catalogue({
  items,
  initialPage = 1,
  basePath = "/shop/",
  scopeBrand,
}: {
  items: CatalogueItem[];
  initialPage?: number;
  basePath?: string;
  scopeBrand?: { slug: string; name: string };
}) {
  const [filters, setFilters] = useState<Filters>({
    ...emptyFilters,
    page: initialPage,
  });
  const [enhanced, setEnhanced] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const resultsHeading = useRef<HTMLParagraphElement>(null);
  const results = filterProducts(items, filters);
  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const currentPage = Math.min(filters.page, pageCount);
  const visible = results.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const availableBrands = brands.filter((brand) =>
    items.some((p) => p.brand === brand.slug),
  );
  const availableCategories = categories.filter((category) =>
    items.some((p) => inCategory(p, category.slug)),
  );
  const brandMatches = filterProducts(items, { ...filters, brands: [] });
  const categoryMatches = filterProducts(items, { ...filters, categories: [] });

  useEffect(() => {
    const restore = () => {
      const restored = readFilters(
        window.location.search,
        scopeBrand
          ? []
          : brands
              .filter((brand) => items.some((p) => p.brand === brand.slug))
              .map((b) => b.slug),
        categories
          .filter((category) => items.some((p) => inCategory(p, category.slug)))
          .map((c) => c.slug),
      );
      if (!new URLSearchParams(window.location.search).has("page"))
        restored.page =
          restored.query ||
          restored.brands.length ||
          restored.categories.length ||
          restored.sort !== "name"
            ? 1
            : initialPage;
      setFilters(restored);
      setEnhanced(true);
    };
    restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, [initialPage, basePath, items, scopeBrand?.slug]);

  function update(patch: Partial<Filters>, resetPage = true) {
    const next = { ...filters, ...(resetPage ? { page: 1 } : {}), ...patch };
    setFilters(next);
    const search = writeFilters(next);
    if (
      !next.query &&
      !next.brands.length &&
      !next.categories.length &&
      next.sort === "name" &&
      next.page === 1 &&
      window.location.pathname !== basePath
    ) {
      window.location.assign(basePath);
      return;
    }
    window.history.replaceState(
      null,
      "",
      window.location.pathname +
        (search ? "?" + search : "") +
        window.location.hash,
    );
  }
  function toggle(key: "brands" | "categories", value: string) {
    update({
      [key]: filters[key].includes(value)
        ? filters[key].filter((v) => v !== value)
        : [...filters[key], value],
    });
  }
  function paginate(page: number) {
    update({ page }, false);
    resultsHeading.current?.focus({ preventScroll: true });
    resultsHeading.current?.scrollIntoView({
      block: "center",
      behavior: "instant",
    });
  }
  function renderFilters(alwaysOpen = false) {
    const categoryChoices = availableCategories.map((category) => {
      const count = categoryMatches.filter((p) =>
        inCategory(p, category.slug),
      ).length;
      const selected = filters.categories.includes(category.slug);
      return (
        <label className="check" key={category.slug}>
          <input
            type="checkbox"
            checked={selected}
            disabled={count === 0 && !selected}
            onChange={() => toggle("categories", category.slug)}
          />
          {category.name}
          <small aria-label="Matching products">{count}</small>
        </label>
      );
    });
    return (
      <>
        {scopeBrand ? (
          <div className="active-brand">
            <span>Brand</span>
            <strong>{scopeBrand.name}</strong>
            <a className="text-link" href="/brands/">
              Change brand
            </a>
          </div>
        ) : (
          <details open>
            <summary>Brands</summary>
            {availableBrands.map((brand) => {
              const count = brandMatches.filter(
                (p) => p.brand === brand.slug,
              ).length;
              const selected = filters.brands.includes(brand.slug);
              return (
                <label className="check" key={brand.slug}>
                  <input
                    type="checkbox"
                    checked={selected}
                    disabled={count === 0 && !selected}
                    onChange={() => toggle("brands", brand.slug)}
                  />
                  {brand.name}
                  <small aria-label="Matching products">{count}</small>
                </label>
              );
            })}
          </details>
        )}
        {availableCategories.length > 0 &&
          (alwaysOpen ? (
            <section className="category-filter-open" aria-label="Categories">
              <h3>Categories</h3>
              {categoryChoices}
            </section>
          ) : (
            <details>
              <summary>Categories</summary>
              {categoryChoices}
            </details>
          ))}
        {(filters.query ||
          filters.brands.length > 0 ||
          filters.categories.length > 0) && (
          <button onClick={() => update(emptyFilters)}>
            Clear all filters
          </button>
        )}
      </>
    );
  }
  return (
    <>
      <noscript>
        <style>{`.tools,.catalogue aside,.filter-toggle{display:none!important}.catalogue{display:block}.card{animation:none;transform:none}`}</style>
        <p>
          Browse the products below. Use the page links to see the rest of the
          catalogue.
        </p>
      </noscript>
      <div className="tools">
        <label className="search">
          <span className="search-label">Search products</span>
          <svg
            className="search-icon"
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={filters.query}
            onChange={(e) => update({ query: e.target.value })}
            placeholder="Search by name or model…"
          />
        </label>
        <a
          className="catalogue-download"
          href={cataloguePDF.href}
          download={cataloguePDF.filename}
        >
          {cataloguePDF.label}
        </a>
        <button
          className="filter-toggle"
          onClick={() => dialog.current?.showModal()}
          aria-haspopup="dialog"
        >
          <svg
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M4 6h16M7 12h10M10 18h4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          Filters
        </button>
      </div>
      <div className="catalogue">
        <aside aria-label="Product filters">{renderFilters(true)}</aside>
        <section aria-label="Products">
          <div className="result-bar">
            <p ref={resultsHeading} tabIndex={-1} aria-live="polite">
              {results.length} imported{" "}
              {results.length === 1 ? "product" : "products"}
            </p>
            <span>
              {enhanced && results.length > 0
                ? `Page ${currentPage} of ${pageCount}`
                : "Name / model"}
            </span>
          </div>
          <div className="chips">
            {filters.brands.map((slug) => (
              <button key={slug} onClick={() => toggle("brands", slug)}>
                {brands.find((b) => b.slug === slug)?.name} ×{" "}
                <span className="sr-only">Remove brand filter</span>
              </button>
            ))}
            {filters.categories.map((slug) => (
              <button key={slug} onClick={() => toggle("categories", slug)}>
                {categories.find((c) => c.slug === slug)?.name} ×{" "}
                <span className="sr-only">Remove category filter</span>
              </button>
            ))}
            {filters.query && (
              <button onClick={() => update({ query: "" })}>
                Search: {filters.query} ×{" "}
                <span className="sr-only">Clear search</span>
              </button>
            )}
          </div>
          <div className="grid">
            {visible.map((p) => (
              <Card key={p.slug} product={p} />
            ))}
          </div>
          {!results.length && (
            <div className="empty-state">
              <h2>No imported records match.</h2>
              <p>
                Try another name or model, or clear your filters. Try browsing a
                broader category or contact our team.
              </p>
              <button onClick={() => update(emptyFilters)}>
                Clear search and filters
              </button>
              <p>
                <a className="text-link" href="/contact-us/">
                  Ask our team about a product
                </a>
              </p>
            </div>
          )}
          {pageCount > 1 && (
            <nav className="pagination" aria-label="Catalogue pages">
              {!filters.query &&
              !filters.brands.length &&
              !filters.categories.length &&
              filters.sort === "name" ? (
                <>
                  {currentPage > 1 ? (
                    <a
                      className="page-link"
                      href={pagePath(basePath, currentPage - 1)}
                    >
                      Previous
                    </a>
                  ) : (
                    <span aria-disabled="true">Previous</span>
                  )}
                  <span aria-current="page">
                    {currentPage} / {pageCount}
                  </span>
                  {currentPage < pageCount ? (
                    <a
                      className="page-link"
                      href={pagePath(basePath, currentPage + 1)}
                    >
                      Next
                    </a>
                  ) : (
                    <span aria-disabled="true">Next</span>
                  )}
                </>
              ) : (
                <>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => paginate(currentPage - 1)}
                  >
                    Previous
                  </button>
                  <span aria-current="page">
                    {currentPage} / {pageCount}
                  </span>
                  <button
                    disabled={currentPage === pageCount}
                    onClick={() => paginate(currentPage + 1)}
                  >
                    Next
                  </button>
                </>
              )}
            </nav>
          )}
        </section>
      </div>
      <dialog ref={dialog} aria-label="Filter products">
        <div className="drawer-head">
          <h2>Filters</h2>
          <button
            onClick={() => dialog.current?.close()}
            aria-label="Close filters"
          >
            ×
          </button>
        </div>
        {renderFilters()}
        <button className="button" onClick={() => dialog.current?.close()}>
          Show {results.length} products
        </button>
      </dialog>
    </>
  );
}

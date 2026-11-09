import { pages } from "../data/pages";
import { products } from "../data/products";
import { brands } from "../data/brands";
import { categories } from "../data/categories";
import { articles } from "../data/articles";
import { sourcePages } from "../data/source-pages";
import { inCategory } from "./catalogue";
import { pageNumbers, pagePath } from "./pagination";
export type Route = {
  path: string;
  kind:
    | "page"
    | "product"
    | "brand"
    | "category"
    | "article"
    | "directory"
    | "pagination";
  indexable: boolean;
  source: string;
};
export const routes: Route[] = [
  ...pages
    .filter((p) => !sourcePages.some((original) => original.path === p.path))
    .map((p) => ({
      path: p.path,
      kind: "page" as const,
      indexable: p.kind !== "retired",
      source: p.source,
    })),
  ...sourcePages.map((p) => ({
    path: p.path,
    kind: "page" as const,
    indexable: !p.retired,
    source: p.source,
  })),
  ...products.map((p) => ({
    path: "/product/" + p.slug + "/",
    kind: "product" as const,
    indexable: p.status !== "sample",
    source: p.source,
  })),
  ...brands.map((b) => ({
    path: "/brand/" + b.slug + "/",
    kind: "brand" as const,
    indexable: products.some((p) => p.brand === b.slug),
    source: b.source,
  })),
  ...categories.map((c) => ({
    path: "/product-category/" + c.slug + "/",
    kind: "category" as const,
    indexable: products.some((p) => inCategory(p, c.slug)),
    source: c.source,
  })),
  ...articles.map((a) => ({
    path: a.path,
    kind: "article" as const,
    indexable: a.status !== "sample",
    source: a.source,
  })),
  ...["/brands/", "/categories/", "/top-products/"].map((path) => ({
    path,
    kind: "directory" as const,
    indexable: true,
    source: "New catalogue directory",
  })),
  ...[
    { base: "/shop/", count: products.length },
    ...brands.map((b) => ({
      base: "/brand/" + b.slug + "/",
      count: products.filter((p) => p.brand === b.slug).length,
    })),
    ...categories.map((c) => ({
      base: "/product-category/" + c.slug + "/",
      count: products.filter((p) => inCategory(p, c.slug)).length,
    })),
  ].flatMap(({ base, count }) =>
    pageNumbers(count)
      .slice(1)
      .map((page) => ({
        path: pagePath(base, page),
        kind: "pagination" as const,
        indexable: true,
        source: base,
      })),
  ),
];

export type SEO = { title?: string; description?: string };
export type ContentStatus = "sample" | "imported" | "verified";
export type ProductImage = {
  src: string;
  alt: string;
  source: string;
  originalSrc?: string;
  width?: number;
  height?: number;
};
export type Product = {
  slug: string;
  name: string;
  model: string | null;
  brand: string | null;
  categorySlugs: string[];
  description: string[];
  specifications: { label: string; value: string; source: string }[];
  source: string;
  status: ContentStatus;
  images: ProductImage[];
  bodyHtml: string;
  mediaReferences: { attachmentId: number; file: string; alt: string }[];
  seo?: SEO;
};
export type Taxonomy = {
  slug: string;
  name: string;
  source: string;
  distributorNote?: string;
};
export type Article = {
  // Exact old pathname, including nested segments and trailing slash.
  path: string;
  title: string;
  description: string;
  paragraphs: string[];
  source: string;
  status: ContentStatus;
  publishedAt?: string;
  bodyHtml: string;
  seo?: SEO;
};
export type ContentPage = {
  path: string;
  title: string;
  description: string;
  paragraphs: string[];
  source: string;
  kind: "company" | "contact" | "retired";
  bodyHtml?: string;
  seo?: SEO;
};

export type SourcePage = {
  sourceId: number;
  path: string;
  title: string;
  source: string;
  seo: SEO;
  retired: boolean;
};

export type CatalogueItem = Pick<
  Product,
  "slug" | "name" | "model" | "brand" | "categorySlugs" | "images"
> & {
  /** Client focus-product rank (1–20), when this is one of the 20 highlighted products. */
  focus?: number;
};

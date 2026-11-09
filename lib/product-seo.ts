import type { Product } from "../data/types";
import { products } from "../data/products";
import { categories } from "../data/categories";
import { focusEntry } from "../data/focus-products";
// Focus products (client top 20) use their search-targeted title/description first.
const baseTitle = (p: Product) =>
  focusEntry(p.slug)?.seo?.title || p.seo?.title || p.name;
export function productSEO(product: Product) {
  let title = baseTitle(product);
  const category = categories
    .filter(
      (c) =>
        c.slug !== "uncategorized" && product.categorySlugs.includes(c.slug),
    )
    .sort((a, b) => b.slug.split("/").length - a.slug.split("/").length)[0];
  if (
    products.some(
      (p) =>
        p.slug !== product.slug &&
        baseTitle(p).toLowerCase() === title.toLowerCase(),
    ) &&
    category
  )
    title += " – " + category.name;
  const description =
    focusEntry(product.slug)?.seo?.description ||
    product.seo?.description ||
    "Enquire about " +
      product.name +
      (category ? " in " + category.name : "") +
      " at YAYBMT, Deira, Dubai. Contact our team for specifications and product requirements.";
  return { title, description };
}

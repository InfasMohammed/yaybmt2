import assert from "node:assert/strict";
import {
  displaySpecifications,
  focusEntries,
  focusEntry,
  keyFacts,
  liveFocusProducts,
} from "../data/focus-products";
import { products } from "../data/products";
import { productSEO } from "../lib/product-seo";
import { routes } from "../lib/routes";

// Ranks 1–20, unique, in order.
assert.deepEqual(
  focusEntries.map((entry) => entry.rank),
  Array.from({ length: 20 }, (_, i) => i + 1),
  "Focus products must be ranked 1–20 in client order",
);

const live = focusEntries.filter((entry) => entry.status === "live");
const awaiting = focusEntries.filter((entry) => entry.status === "awaiting");
for (const entry of live) {
  assert.ok(entry.slugs.length, `#${entry.rank} live entry has no slug`);
  for (const slug of entry.slugs)
    assert.ok(
      products.some((p) => p.slug === slug),
      `#${entry.rank} slug ${slug} not in catalogue`,
    );
  assert.ok(
    entry.seo?.title && entry.seo.description,
    `#${entry.rank} needs a search-targeted title and description`,
  );
  // ≤ 55 chars so the full <title> (with " | YAYBMT") stays within ~64 characters.
  assert.ok(
    entry.seo!.title.length <= 55,
    `#${entry.rank} SEO title too long (${entry.seo!.title.length})`,
  );
  assert.ok(entry.searchTerms.length, `#${entry.rank} needs search terms`);
}
for (const entry of awaiting) {
  assert.equal(entry.slugs.length, 0, `#${entry.rank} awaiting must publish nothing`);
  assert.ok(
    entry.confirm || entry.missing,
    `#${entry.rank} awaiting entry must say what the client needs to provide`,
  );
}

// Each live product resolves once, uses its focus SEO, and has clean, sourced specs.
const resolved = liveFocusProducts();
assert.equal(
  new Set(resolved.map((p) => p.slug)).size,
  resolved.length,
  "A product is listed twice",
);
const titles = new Set<string>();
for (const product of resolved) {
  const seo = productSEO(product);
  assert.equal(seo.title, focusEntry(product.slug)!.seo!.title);
  assert.ok(!titles.has(seo.title.toLowerCase()), "Duplicate focus title");
  titles.add(seo.title.toLowerCase());
  const specs = displaySpecifications(product);
  assert.ok(specs.length, `${product.slug} has no displayable specifications`);
  for (const spec of specs) {
    assert.ok(spec.source, `${product.slug} unsourced spec ${spec.label}`);
    assert.ok(
      !/;\s*$|\d\s*px\b|!important|[{}]/.test(spec.value),
      `${product.slug} spec still contains code: ${spec.label}`,
    );
  }
  assert.ok(keyFacts(product).length, `${product.slug} has no key facts`);
  assert.ok(product.images.length, `${product.slug} has no photo`);
}

// The hub page is a real, indexable route.
assert.ok(
  routes.some((r) => r.path === "/top-products/" && r.indexable),
  "/top-products/ must be an indexable route",
);

console.log(
  `PASS focus products: ${live.length} live (${resolved.length} pages) with search-targeted titles, clean sourced specs, key facts and photos; ${awaiting.length} awaiting client info.`,
);

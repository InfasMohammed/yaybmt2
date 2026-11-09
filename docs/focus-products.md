# Twenty focus products (section 3.4)

The client's 20 priority products are managed in [data/focus-products.ts](../data/focus-products.ts), in the client's order. Each **live** entry points at an existing catalogue product and gets:

- **Search targeting:** a search-targeted page title and meta description, aimed at buyer queries rather than the internal code (`productSEO` in [lib/product-seo.ts](../lib/product-seo.ts) uses it first). Titles stay at 55 characters or less, so the full `<title>` with " | YAYBMT" fits in search results.
- **A real product page:**
  - a **Top product** badge
  - a **Key facts** strip (material, size, finish, use), taken only from the product's sourced specifications
  - a clean specification table, with the imported page CSS and supplier-listing rows (payment terms, shipping port, SKU) removed
  - the existing WhatsApp and quote enquiry buttons
- **Prominence:**
  - the [/top-products/](../app/top-products/page.tsx) hub page, linked from the header Products menu, the footer and the homepage "View top products" link
  - a "Top product" pill on its card everywhere
  - a "Top products in …" strip on brand and category pages that have other products too
  - "Other top products" links on every focus product page
  - first place in "Related products" on other pages of the same brand

**Awaiting** entries publish nothing until the client sends their information. Specifications are never invented: every spec must carry a `source`, and `npm run check:focus` and `check:content` enforce this.

## Status

| # | Client item | Website product | Status |
|---|---|---|---|
| 1 | Sungmi lock 1501 | — | **Awaiting**: the catalogue only has the Sung Mi **SM-1105**. Is 1501 the same lock or a different model? |
| 2 | Cosmo lock 5600 | `/product/5600/` CD-5600 | Live |
| 3 | Staco lock 7000 | `/product/7000/` | Live |
| 4 | Kopat lock 1100 | `/product/s-1100pc/` S-1100PC(LH) | Live, **confirm match** |
| 5 | Horse door lock C1 | `/product/marine-fire-lock-c1-ohs-2320-rho/` | Live |
| 6 | C1 marine door lock | `/product/c1/` | Live |
| 7 | C4 marine door lock | `/product/c4/` | Live |
| 8 | C2 marine door lock, weather tight | `/product/c2/` | Live |
| 9 | Mortise door lock OHS 2320 S500 | — | **Awaiting**: OHS-2320 is already #5, and there is no "S500" in the catalogue. Which product is this? |
| 10 | CF-3 sliding door lock (new) | — | **Awaiting**: new product |
| 11 | Daelim FC 110 CS flush valve | `/product/fc-110cs/` | Live |
| 12 | Wash basin mixer FL-3200 / FL-0200 | `/product/fl-3200c/` | Live; **FL-0200 not in the catalogue** |
| 13 | Thermostatic shower mixer HB2060 NRC | `/product/fb-2060nc/` FB2060NC | Live, **confirm "HB" = "FB"** |
| 14 | CC 114 Daelim floor-mounted WC | — | **Awaiting**: not in the catalogue |
| 15 | DC 701 wall-hung WC with seat cover | `/product/dc-701/` | Live |
| 16 | RWL 220 Royal & Co wash basin | `/product/rwl220/` | Live |
| 17 | Weather-tight door hatch handle (new) | — | **Awaiting**: new product |
| 18 | Daelim S trap FL 222 / FL 247 pop-up | `/product/fl-247/` | Live; **FL 222 to confirm** (the catalogue's FL 222N is a stainless accessory, not an S-trap) |
| 19 | Thermostatic shower mixer (new) | — | **Awaiting**: new product |
| 20 | Thermostatic mixer HB2060 TKR with spout | `/product/fb-2060tkr/` FB2060TKR | Live, **confirm "HB" = "FB"** |

## What the client needs to send (Section 6)

For each awaiting item (#1, #9, #10, #14, #17, #19, plus FL-0200 and FL 222):

1. **Product name and model number,** exactly as sold.
2. **A short description:** what it is and where it's used.
3. **Specifications:** at least material, size or dimensions, finish and use or application. Add door thickness, backset and cylinder for locks, and connection size and flow for sanitary items. Say where each value comes from, such as a manufacturer sheet or the box.
4. **At least one clear product photo** on a plain background, as JPG or PNG.
5. **For #1 and #9:** which existing product they mean, or confirmation that they are new.

## Publishing an awaiting item

1. Add the product to [data/products.ts](../data/products.ts) with `status: "imported"`, and specifications that each carry a `source` (for example `"client product sheet, 2026-11"`).
2. Add the photo to `public/images/products/`, using the same image pattern as the other products.
3. In [data/focus-products.ts](../data/focus-products.ts), set the entry to `status: "live"`, add its slug to `slugs`, and write an SEO `title` of 55 characters or less and a `description`.
4. Run `npm run check`, `npm run build` and `npm run check:export`, then the browser tests including `npm run test:focus`.

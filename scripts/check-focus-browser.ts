import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { chromium } from "playwright";
import { focusEntry, liveFocusProducts } from "../data/focus-products";
import { productSEO } from "../lib/product-seo";

async function main() {
  const browser = await chromium.launch({
    executablePath:
      process.env.YAYBMT_BROWSER_EXECUTABLE ||
      (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
    args: ["--no-sandbox"],
  });
  const base = process.env.YAYBMT_TEST_URL || "http://127.0.0.1:8080";
  const live = liveFocusProducts();
  try {
    const page = await browser.newPage({
      viewport: { width: 1366, height: 900 },
      reducedMotion: "reduce",
    });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));

    // Homepage: no new product section; the existing category grid stays, with a hub link.
    await page.goto(base + "/");
    assert.ok(await page.locator("[data-category-grid]").isVisible());
    assert.equal(await page.locator(".focus-pill").count(), 0);
    await page
      .locator("main")
      .getByRole("link", { name: "View top products" })
      .click();
    assert.ok(page.url().endsWith("/top-products/"));

    // Hub lists every live focus product, each linking to its page.
    assert.equal(await page.locator("h1").innerText(), "Top products");
    for (const product of live)
      assert.equal(
        await page
          .locator(`main .card a[href="/product/${product.slug}/"]`)
          .count(),
        1,
        "Hub lists " + product.slug,
      );
    assert.equal(await page.locator("main .focus-pill").count(), live.length);

    // Header and footer link to the hub.
    assert.equal(
      await page.locator('header a[href="/top-products/"]').count() >= 1,
      true,
    );
    assert.equal(
      await page.locator('footer a[href="/top-products/"]').count(),
      1,
    );

    // A focus product page: badge, sourced key facts, search-targeted title, enquiry, related links.
    const c1 = live.find((p) => p.slug === "c1")!;
    await page.goto(base + "/product/c1/");
    assert.equal(await page.title(), productSEO(c1).title + " | YAYBMT");
    assert.equal(
      productSEO(c1).title,
      focusEntry("c1")!.seo!.title,
    );
    assert.ok(await page.locator(".focus-badge").isVisible());
    assert.ok((await page.locator(".key-facts > div").count()) >= 2);
    assert.ok(
      await page
        .locator("main")
        .getByRole("link", { name: /Enquire on WhatsApp/ })
        .isVisible(),
    );
    assert.ok(
      (await page.locator(".focus-related .card").count()) > 0,
      "Focus product links to other top products",
    );

    // Imported CSS junk is no longer shown as specifications.
    await page.goto(base + "/product/5600/");
    const specText = await page
      .locator("details.product-panel")
      .filter({ has: page.locator("summary", { hasText: "Specifications" }) })
      .locator("dl")
      .innerText();
    assert.ok(!/display|flex-wrap|px;|@media/.test(specText));
    assert.match(specText, /54\.5 mm/);

    // Brand page with several products: "Top products in …" strip above the catalogue.
    await page.goto(base + "/brand/daelim/");
    const strip = page.locator(".archive-top-products");
    assert.ok(await strip.isVisible());
    assert.ok((await strip.locator(".card").count()) >= 1);
    // Single-product brand: no duplicate strip.
    await page.goto(base + "/brand/staco/");
    assert.equal(await page.locator(".archive-top-products").count(), 0);

    assert.deepEqual(errors, []);
    await page.close();
    console.log(
      `PASS focus browser: homepage keeps categories + hub link, /top-products/ lists ${live.length} live products, header/footer links, focus page badge/key facts/SEO title/related, clean specs and brand strip.`,
    );
  } finally {
    await browser.close();
  }
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});

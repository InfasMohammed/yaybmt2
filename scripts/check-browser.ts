import imageRedirects from "../data/image-redirects.json";
import { chromium } from "playwright";
import assert from "node:assert/strict";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { routes } from "../lib/routes";
import { products } from "../data/products";
import { articles } from "../data/articles";
import { filterProducts, emptyFilters } from "../lib/catalogue";
import redirects from "../data/redirects.json";
const base = process.env.YAYBMT_TEST_URL || "http://127.0.0.1:8080";
const output = process.env.YAYBMT_SCREENSHOTS || "artifacts/nextjs";
mkdirSync(output, { recursive: true });
const executable =
  process.env.YAYBMT_BROWSER_EXECUTABLE ||
  (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined);
async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: executable,
    args: ["--no-sandbox"],
  });
  try {
    // Catalogue geometry/flows need stationary frames. Dedicated motion checks
    // separately exercise the full falling animations with motion enabled.
    const context = await browser.newContext({ reducedMotion: "reduce" });
    await context.route("**/*", (route) =>
      new URL(route.request().url()).origin === base
        ? route.continue()
        : route.abort(),
    );
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const representative = [
      ["/", "home"],
      ["/shop/", "catalogue"],
      ["/product/fc-110cs/", "product"],
      [articles[0].path, "article"],
    ];
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({
        width,
        height: width === 1440 ? 1000 : 844,
      });
      for (const [path, name] of representative) {
        const response = await page.goto(base + path);
        assert.equal(response?.status(), 200);
        await page.waitForLoadState("networkidle");
        // Load below-the-fold photos before full-page review screenshots.
        await page
          .locator('img[loading="lazy"]')
          .evaluateAll((images) =>
            images.forEach(
              (image) => ((image as HTMLImageElement).loading = "eager"),
            ),
          );
        await page.evaluate(async () => {
          await Promise.all(
            [...document.images].map((image) => image.decode()),
          );
        });
        assert.equal(await page.locator("h1").count(), 1);
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          "Overflow " + path + " at " + width,
        );
        assert.match(
          (await page.locator("meta[name=robots]").getAttribute("content")) ||
            "",
          /noindex/,
        );
        assert.equal(
          await page.locator("link[rel=canonical]").getAttribute("href"),
          "https://yaybmt.com" + path,
        );
        assert.equal(await page.locator('header a[href*="wa.me"]').count(), 0);
        if (width !== 320)
          await page.screenshot({
            path: join(
              output,
              name + "-" + (width === 1440 ? "desktop" : "mobile") + ".png",
            ),
            fullPage: true,
          });
      }
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(base + "/shop/");
    await page.waitForLoadState("networkidle");
    assert.equal(await page.locator(".card").count(), 12);
    await page.getByRole("searchbox").fill("FC110");
    assert.equal(await page.locator(".card").count(), 1);
    assert.ok(page.url().includes("q=FC110"));
    await page
      .locator(".chips")
      .getByRole("button", { name: /Clear search/ })
      .click();
    assert.equal(await page.locator(".card").count(), 12);
    await page
      .locator("aside")
      .getByRole("checkbox", { name: /^DAELIM\b/ })
      .check();
    assert.match(
      await page.locator(".result-bar").innerText(),
      /21 imported products/,
    );
    await page.reload();
    await page.waitForLoadState("networkidle");
    assert.match(
      await page.locator(".result-bar").innerText(),
      /21 imported products/,
    );
    await page.getByRole("button", { name: /Remove brand filter/ }).click();
    assert.ok(await page.locator("aside .category-filter-open").isVisible());
    await page
      .locator("aside")
      .getByRole("checkbox", { name: /^Fasteners\b/ })
      .check();
    const fasteners = filterProducts(products, {
      ...emptyFilters,
      categories: ["fasteners"],
    });
    assert.match(
      await page.locator(".result-bar").innerText(),
      new RegExp(fasteners.length + " imported products"),
    );
    await page.getByRole("button", { name: /Remove category filter/ }).click();
    assert.equal(
      await page
        .locator(".image-frame img")
        .first()
        .evaluate((image) => (image as HTMLImageElement).naturalWidth > 0),
      true,
    );
    assert.equal(
      await page
        .locator(".image-frame img")
        .first()
        .evaluate((image) => getComputedStyle(image).objectFit),
      "contain",
    );
    const geometry = await page.locator(".card").evaluateAll((cards) =>
      cards.slice(0, 3).map((c) => ({
        bottom: c.getBoundingClientRect().bottom,
        top: c.querySelector(".card-name")!.getBoundingClientRect().top,
        frame: c.querySelector(".image-frame")!.getBoundingClientRect().height,
      })),
    );
    assert.ok(
      geometry.every(
        (g) =>
          Math.abs(g.bottom - geometry[0].bottom) < 2 &&
          Math.abs(g.top - geometry[0].top) < 2 &&
          Math.abs(g.frame - geometry[0].frame) < 2,
      ),
    );
    await page
      .getByRole("navigation", { name: "Catalogue pages" })
      .getByRole("link", { name: "Next", exact: true })
      .click();
    assert.ok(page.url().endsWith("/shop/page/2/"));
    assert.equal(
      await page.locator("link[rel=canonical]").getAttribute("href"),
      "https://yaybmt.com/shop/page/2/",
    );
    // Pagination performs a full static navigation; wait for the catalogue to hydrate.
    await page.waitForFunction(() =>
      document
        .querySelector(".result-bar span")
        ?.textContent?.startsWith("Page "),
    );
    await page.getByRole("searchbox").fill("nonexistentcatalogueitem");
    await page.waitForFunction(
      () => document.querySelectorAll(".card").length === 0,
    );
    assert.equal(await page.locator(".card").count(), 0);
    assert.ok(page.url().includes("/shop/page/2/?q="));
    assert.equal(
      await page.locator("link[rel=canonical]").getAttribute("href"),
      "https://yaybmt.com/shop/page/2/",
    );
    await page.setViewportSize({ width: 390, height: 844 });
    await page
      .locator(".chips")
      .getByRole("button", { name: /Clear search/ })
      .click();
    await page.waitForURL(base + "/shop/");
    await page.getByRole("button", { name: "Filters" }).click();
    assert.ok(await page.locator("dialog").isVisible());
    await page
      .locator("dialog")
      .getByRole("checkbox", { name: /^DAELIM\b/ })
      .check();
    await page.keyboard.press("Escape");
    assert.ok(!(await page.locator("dialog").isVisible()));
    await page.goto(base + "/product/dc-102/");
    assert.match(await page.locator("main").innerText(), /6 Litres/);
    assert.equal(await page.locator('a[href^="mailto:"]').count(), 0);
    const wa = new URL(
      (await page
        .locator("main")
        .getByRole("link", { name: /Enquire on WhatsApp/ })
        .getAttribute("href"))!,
    );
    assert.equal(wa.pathname, "/971567369803");
    assert.match(wa.searchParams.get("text") || "", /DC 102/);
    assert.equal(await page.locator(".gallery-photo figcaption").count(), 0);
    const originalLink = page.locator(".gallery-image").first();
    const originalPath = await originalLink.getAttribute("href");
    assert.ok(originalPath?.startsWith("/images/products/"));
    const originalResponse = await context.request.get(base + originalPath);
    assert.equal(originalResponse.status(), 200);
    assert.match(originalResponse.headers()["content-type"], /^image\//);
    await originalResponse.dispose();
    const zoomFrame = page.locator(".gallery-image").first();
    const frameBounds = await zoomFrame.boundingBox();
    assert.ok(frameBounds);
    const zoomImage = zoomFrame.locator("img");
    await zoomFrame.hover({
      position: { x: frameBounds.width * 0.3, y: frameBounds.height * 0.3 },
    });
    const firstOrigin = await zoomImage.evaluate(
      (img) => img.style.transformOrigin,
    );
    await zoomFrame.hover({
      position: { x: frameBounds.width * 0.7, y: frameBounds.height * 0.7 },
    });
    const secondOrigin = await zoomImage.evaluate(
      (img) => img.style.transformOrigin,
    );
    assert.notEqual(
      firstOrigin,
      secondOrigin,
      "Zoom follows the pointer across image areas",
    );
    const afterZoomBounds = await zoomFrame.boundingBox();
    assert.ok(afterZoomBounds);
    assert.ok(
      Math.abs(afterZoomBounds.height - frameBounds.height) < 0.01,
      "Pointer zoom preserves frame height within browser subpixel precision",
    );
    await page.mouse.move(0, 0);
    assert.equal(
      await zoomImage.evaluate((img) => img.style.transformOrigin),
      "50% 50%",
    );

    const unbranded = products.find(
      (p) => p.brand === null && p.model === null,
    )!;
    await page.goto(base + "/product/" + unbranded.slug + "/");
    assert.equal(await page.locator(".product-layout .model").innerText(), "");
    assert.equal(
      await page
        .locator("dt")
        .filter({ hasText: /^Model reference$/ })
        .locator("+ dd")
        .innerText(),
      "",
    );
    assert.equal(
      await page
        .getByRole("link", { name: "LinkedIn", exact: true })
        .getAttribute("href"),
      "https://www.linkedin.com/company/yusuf-al-yousfi-building-material-trading-llc/",
    );
    assert.equal(
      await page
        .getByRole("link", { name: "Powered by Maneuver", exact: true })
        .getAttribute("href"),
      "https://maneuver.ae/",
    );
    await page.locator(".powered-by img").evaluate(async (image) => {
      const img = image as HTMLImageElement;
      img.loading = "eager";
      await img.decode();
    });

    assert.ok(
      (await page.locator("main").innerText()).includes(
        "Not recorded in the source catalogue",
      ),
    );
    for (let i = 0; i < routes.length; i += 10) {
      await Promise.all(
        routes.slice(i, i + 10).map(async (route) => {
          const response = await context.request.get(base + route.path);
          assert.equal(response.status(), 200, "HTTP route " + route.path);
          await response.dispose();
        }),
      );
    }
    for (let i = 0; i < imageRedirects.length; i += 15) {
      await Promise.all(
        imageRedirects.slice(i, i + 15).map(async (rule) => {
          const response = await context.request.get(base + rule.source, {
            maxRedirects: 0,
          });
          assert.equal(response.status(), 301);
          assert.equal(response.headers().location, rule.destination);
          await response.dispose();
        }),
      );
    }
    for (const redirect of redirects) {
      const response = await context.request.get(base + redirect.source, {
        maxRedirects: 0,
      });
      assert.equal(response.status(), 301);
      assert.equal(response.headers().location, redirect.destination);
      await response.dispose();
    }
    for (const path of [
      "/genuine-missing-page/",
      "/wp-content/uploads/2025/04/not-a-real-image.jpg",
      "/product/missing/",
      "/brand/missing/",
      "/shop/page/999/",
    ]) {
      const response = await context.request.get(base + path);
      assert.equal(response.status(), 404, "Missing route must return 404");
      await response.dispose();
    }
    // A brand archive must not offer unrelated brand/category choices.
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(base + "/brand/daelim/?brand=kopat&category=fasteners");
    await page.waitForLoadState("networkidle");
    assert.equal(
      await page.locator("aside .active-brand strong").innerText(),
      "DAELIM",
    );
    assert.equal(
      await page.locator("aside .active-brand a").getAttribute("href"),
      "/brands/",
    );
    assert.equal(
      await page
        .locator("aside")
        .getByRole("checkbox", { name: /^KOPAT/ })
        .count(),
      0,
    );
    assert.match(
      await page.locator(".result-bar").innerText(),
      /21 imported products/,
    );
    assert.ok(await page.locator("aside .category-filter-open").isVisible());
    assert.equal(
      await page
        .locator("aside")
        .getByRole("checkbox", { name: /^Fasteners/ })
        .count(),
      0,
    );
    await page.locator("aside").getByRole("checkbox").first().check();
    assert.ok((await page.locator(".card").count()) > 0);
    await page.getByRole("button", { name: /Remove category filter/ }).click();
    await page.goto(base + "/shop/");
    await page
      .locator("aside")
      .getByRole("checkbox", { name: /^DAELIM/ })
      .check();
    assert.ok(await page.locator("aside .category-filter-open").isVisible());
    assert.equal(
      await page
        .locator("aside")
        .getByRole("checkbox", { name: /^Fasteners/ })
        .isDisabled(),
      true,
    );
    await page.getByRole("button", { name: /Remove brand filter/ }).click();
    assert.equal(
      await page
        .locator("aside")
        .getByRole("checkbox", { name: /^Fasteners/ })
        .isEnabled(),
      true,
    );
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base + "/brand/daelim/");
    await page.getByRole("button", { name: "Filters", exact: true }).click();
    assert.equal(
      await page.locator("dialog .active-brand strong").innerText(),
      "DAELIM",
    );
    assert.equal(
      await page
        .locator("dialog")
        .getByRole("checkbox", { name: /^KOPAT/ })
        .count(),
      0,
    );
    await page.keyboard.press("Escape");
    await page.goto(base + "/");
    const menuToggle = page.locator(".mobile-navigation > summary");
    if (await menuToggle.isVisible()) await menuToggle.click();
    const primaryNavigation = page.getByRole("navigation", {
      name: "Main navigation",
    });
    assert.ok(
      await primaryNavigation
        .getByRole("link", { name: "Company", exact: true })
        .isVisible(),
    );
    if (await menuToggle.isVisible()) {
      await primaryNavigation.locator('[data-mobile-view="brands"]').click();
      assert.ok(
        await primaryNavigation
          .getByRole("link", { name: "DAELIM", exact: true })
          .isVisible(),
      );
      await page.keyboard.press("Escape");
      assert.ok(
        await primaryNavigation
          .getByRole("link", { name: "Company", exact: true })
          .isVisible(),
      );
    } else {
      const brandsDropdown = primaryNavigation
        .locator("details")
        .filter({ has: page.locator("summary", { hasText: /^Brands/ }) });
      await brandsDropdown.locator("summary").click();
      assert.ok(
        await brandsDropdown
          .getByRole("link", { name: "DAELIM", exact: true })
          .isVisible(),
      );
      await page.keyboard.press("Escape");
      assert.equal(await brandsDropdown.getAttribute("open"), null);
    }
    assert.equal(await page.locator(".welcome-section details").count(), 0);
    await primaryNavigation
      .getByRole("link", { name: "Company", exact: true })
      .click();
    assert.ok(page.url().endsWith("/about-us/"));
    assert.equal(
      await page.locator(".company-values-cards article").count(),
      3,
    );
    assert.ok(
      await page.getByText(/Our mission is to provide innovative/).isVisible(),
    );
    const enquiryContext = await browser.newContext();
    const enquiryPage = await enquiryContext.newPage();
    for (const width of [1440, 390]) {
      await enquiryPage.setViewportSize({ width, height: 900 });
      await enquiryPage.goto(base + "/contact-us/");
      await enquiryPage.evaluate(() => {
        window.open = ((url?: string | URL) => {
          (window as Window & { enquiryTestURL?: string }).enquiryTestURL =
            String(url);
          return null;
        }) as typeof window.open;
      });
      assert.equal(await enquiryPage.locator('a[href^="mailto:"]').count(), 0);
      await enquiryPage
        .getByRole("button", { name: "Continue on WhatsApp", exact: true })
        .click();
      assert.equal(
        await enquiryPage.evaluate(
          () => (window as Window & { enquiryTestURL?: string }).enquiryTestURL,
        ),
        undefined,
      );
      await enquiryPage.getByLabel("Full name").fill("Test & Review");
      await enquiryPage
        .getByLabel("Phone number", { exact: true })
        .fill("+971 50 000 0000");
      await enquiryPage
        .getByRole("textbox", { name: /^Message/ })
        .fill("Need marine locks & valves + drawings\nQuantity: 12");
      await enquiryPage
        .getByRole("button", { name: "Continue on WhatsApp", exact: true })
        .click();
      const draftURL = new URL(
        (await enquiryPage.locator(".enquiry-draft a").getAttribute("href"))!,
      );
      assert.equal(draftURL.origin, "https://wa.me");
      assert.equal(draftURL.pathname, "/971567369803");
      assert.equal(
        await enquiryPage.evaluate(
          () => (window as Window & { enquiryTestURL?: string }).enquiryTestURL,
        ),
        draftURL.href,
      );
      const message = draftURL.searchParams.get("text")!;
      for (const expected of [
        "Hello YAYBMT team,",
        "Name: Test & Review",
        "Phone: +971 50 000 0000",
        "Requirements:\nNeed marine locks & valves + drawings\nQuantity: 12",
      ])
        assert.ok(message.includes(expected), expected);
      assert.ok(!message.includes("Company:"));
      assert.ok(!message.includes("Email:"));
      assert.equal(await enquiryPage.locator('input[type="email"]').count(), 0);
      await enquiryPage
        .getByRole("textbox", { name: /^Message/ })
        .fill("Updated requirements");
      assert.equal(await enquiryPage.locator(".enquiry-draft a").count(), 0);
    }
    await enquiryContext.close();
    const nojs = await browser.newContext({ javaScriptEnabled: false });
    const plain = await nojs.newPage();
    await plain.goto(base + "/brand/daelim/");
    assert.equal(await plain.locator(".card").count(), 12);
    await plain
      .getByRole("navigation", { name: "Catalogue pages" })
      .getByRole("link", { name: "Next", exact: true })
      .click();
    assert.equal(await plain.locator(".card").count(), 9);
    await plain.locator(".card a").first().click();
    assert.ok(
      await plain
        .locator("main")
        .getByRole("link", { name: /Enquire on WhatsApp/ })
        .isVisible(),
    );
    const plainImage = plain.locator(".gallery-photo img").first();
    assert.ok(await plainImage.isVisible());
    assert.equal(
      await plainImage.evaluate(
        (image) => (image as HTMLImageElement).naturalWidth > 0,
      ),
      true,
    );
    await plain.goto(base + "/contact-us/");
    assert.equal(
      await plain.locator(".contact-enquiry-form").isVisible(),
      false,
    );
    const fallback = new URL(
      (await plain
        .locator(".contact-enquiry")
        .getByRole("link", { name: "Enquire on WhatsApp", exact: true })
        .getAttribute("href"))!,
    );
    assert.equal(fallback.origin, "https://wa.me");
    assert.equal(fallback.pathname, "/971567369803");
    await nojs.close();
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(base + "/shop/");
    assert.equal(
      await page
        .locator(".card")
        .first()
        .evaluate((e) => getComputedStyle(e).animationName),
      "none",
    );
    assert.deepEqual(errors, []);
    console.log(
      "PASS browser: " +
        routes.length +
        " HTTP routes; desktop/mobile layout; search; filters; bookmark restore; native pagination; sourced specifications; enquiries; 301/404; no-JS catalogue navigation; reduced motion.",
    );
  } finally {
    await browser.close();
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

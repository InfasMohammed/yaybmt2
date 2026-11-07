import assert from "node:assert/strict";
import { existsSync, mkdirSync } from "node:fs";
import { chromium } from "playwright";
async function main() {
  const browser = await chromium.launch({
    executablePath:
      process.env.YAYBMT_BROWSER_EXECUTABLE ||
      (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
    args: ["--no-sandbox"],
  });
  const base = process.env.YAYBMT_TEST_URL || "http://127.0.0.1:8080";
  const output = process.env.YAYBMT_MENU_SCREENSHOTS || "artifacts/menu-hover";
  mkdirSync(output, { recursive: true });
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
      reducedMotion: "no-preference",
    });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base + "/");
    const nav = page.locator(".desktop-navigation");
    assert.deepEqual(
      await nav
        .locator(":scope > a")
        .evaluateAll((links) => links.map((el) => el.getAttribute("href"))),
      ["/", "/about-us/", "/contact-us/"],
    );
    assert.equal(await nav.locator('a[href="#"]').count(), 0);
    const home = nav.getByRole("link", { name: "Home", exact: true });
    await home.hover();
    await page.waitForTimeout(120);
    const mid = await home
      .locator(".menu-hover-fill")
      .evaluate((el) => Number(getComputedStyle(el).opacity));
    assert.ok(mid > 0 && mid < 1, "Background fill actually animates");
    await page.waitForTimeout(300);
    assert.equal(
      await home
        .locator(".menu-hover-label")
        .evaluate((el) => getComputedStyle(el).color),
      "rgb(38, 38, 38)",
    );
    assert.equal(
      await home
        .locator(".menu-hover-borders")
        .evaluate((el) => getComputedStyle(el).opacity),
      "1",
    );
    await page.locator("header").screenshot({ path: `${output}/desktop.png` });
    await home.focus();
    await page.keyboard.press("Tab");
    const products = nav.locator("summary").filter({ hasText: "Products" });
    await page.keyboard.press("Enter");
    assert.ok(
      await nav
        .getByRole("link", { name: "All products", exact: true })
        .isVisible(),
    );
    await page.keyboard.press("Escape");
    assert.equal(await products.locator("..").getAttribute("open"), null);
    const brands = nav.locator("summary").filter({ hasText: "Brands" });
    await brands.hover();
    assert.ok(
      await nav
        .getByRole("link", { name: "All brands", exact: true })
        .isVisible(),
    );
    // Outside click: the centred hero headline's left edge is clear of the open dropdown.
    await page.locator("h1").click({ position: { x: 8, y: 8 } });
    assert.equal(await brands.locator("..").getAttribute("open"), null);
    await page.emulateMedia({ reducedMotion: "reduce" });
    assert.equal(
      await home
        .locator(".menu-hover-fill")
        .evaluate((el) => getComputedStyle(el).transitionDuration),
      "0s",
    );
    for (const route of [
      "/brands/",
      "/shop/",
      "/categories/",
      "/about-us/",
      "/contact-us/",
      "/blog/",
      "/product/dc-102/",
    ]) {
      await page.goto(base + route);
      const link = page.locator(".desktop-navigation > a").first();
      await link.hover();
      assert.equal(
        await link
          .locator(".menu-hover-fill")
          .evaluate((el) => getComputedStyle(el).display),
        "block",
      );
      assert.equal(
        await link
          .locator(".menu-hover-fill")
          .evaluate((el) => getComputedStyle(el).opacity),
        "1",
      );
      if (route === "/brands/")
        await page
          .locator("header")
          .screenshot({ path: `${output}/desktop-inner.png` });
    }
    assert.deepEqual(errors, []);
    await page.close();
    for (const width of [768, 651, 390, 320]) {
      const p = await browser.newPage({
        viewport: { width, height: 900 },
        reducedMotion: "reduce",
      });
      await p.goto(base + "/contact-us/");
      if (width <= 650) {
        const mobile = p.locator(".mobile-navigation");
        await mobile.locator(":scope > summary").click();
        assert.equal(
          await mobile
            .locator(".menu-toggle-line")
            .nth(1)
            .evaluate((el) => getComputedStyle(el).opacity),
          "0",
        );
        await mobile.locator('[data-mobile-view="products"]').click();
        assert.ok(
          await mobile.getByRole("button", { name: /Back/ }).isVisible(),
        );
        await mobile.getByRole("button", { name: /Back/ }).click();
        assert.ok(
          await mobile
            .getByRole("link", { name: "Company", exact: true })
            .isVisible(),
        );
        if (width === 390) await p.screenshot({ path: `${output}/mobile.png` });
        await p.mouse.click(4, 250);
        assert.equal(await mobile.getAttribute("open"), null);
      }
      assert.equal(
        await p.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
      );
      await p.close();
    }
    const staticPage = await browser.newPage({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 900 },
    });
    await staticPage.goto(base + "/");
    await staticPage.locator(".mobile-navigation > summary").click();
    await staticPage
      .locator(".mobile-menu-panel")
      .getByRole("link", { name: "Company", exact: true })
      .click();
    await staticPage.waitForURL("**/about-us/");
    console.log(
      "PASS supplied menu hover: actual border/fill animation, real URLs, keyboard/dropdowns/Escape/outside click, mobile Back/hamburger, no-JS links, reduced motion and sitewide styling.",
    );
  } finally {
    await browser.close();
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

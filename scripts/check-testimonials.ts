import assert from "node:assert/strict";
import { existsSync, mkdirSync } from "node:fs";
import { chromium, type Page } from "playwright";
import { visibleTestimonials } from "../data/testimonials";

const activeName = (page: Page) =>
  page
    .locator(".testimonial-card.is-active figcaption strong")
    .innerText()
    .then((name) => name.toLowerCase());

async function main() {
  const browser = await chromium.launch({
    executablePath:
      process.env.YAYBMT_BROWSER_EXECUTABLE ||
      (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
    args: ["--no-sandbox"],
  });
  const base = process.env.YAYBMT_TEST_URL || "http://127.0.0.1:8080";
  const output =
    process.env.YAYBMT_TESTIMONIAL_SCREENSHOTS || "artifacts/testimonials";
  mkdirSync(output, { recursive: true });
  const items = visibleTestimonials(false);
  const names = items.map((item) => item.name);
  try {
    for (const width of [1440, 768, 390, 320]) {
      const page = await browser.newPage({
        viewport: { width, height: 1000 },
        reducedMotion: "reduce",
      });
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(base + "/");
      const section = page.locator(".testimonials-section");
      await section.evaluate((el) => el.scrollIntoView({ block: "center" }));
      await page.waitForSelector(".testimonials-enhanced");
      assert.equal(
        await section.locator("h2").innerText(),
        "Real Results, Real Voices",
      );
      assert.equal(await page.locator("h1").count(), 1);
      // Every real review is present, with exact names and copy.
      assert.equal(await section.locator("figure").count(), items.length);
      assert.deepEqual(
        await section.locator("figcaption strong").allTextContents(),
        names,
      );
      assert.deepEqual(
        await section.locator("blockquote p").allTextContents(),
        items.filter((item) => item.quote).map((item) => item.quote),
      );
      assert.equal(
        await section.locator(".testimonial-rating-only").count(),
        items.filter((item) => !item.quote).length,
      );
      // One featured card at a time; the rest are hidden from assistive tech too.
      assert.equal(
        await section
          .locator(".testimonial-card")
          .evaluateAll(
            (cards) =>
              cards.filter((c) => getComputedStyle(c).opacity === "1").length,
          ),
        1,
      );
      assert.equal(
        await section.locator('.testimonial-card[aria-hidden="true"]').count(),
        items.length - 1,
      );
      // Arrows and dots navigate.
      assert.equal(await activeName(page), names[0].toLowerCase());
      await section.getByRole("button", { name: "Next testimonial" }).click();
      assert.equal(await activeName(page), names[1].toLowerCase());
      await section
        .getByRole("button", { name: "Previous testimonial" })
        .click();
      assert.equal(await activeName(page), names[0].toLowerCase());
      await section
        .getByRole("button", { name: `Go to testimonial ${items.length}` })
        .click();
      assert.equal(await activeName(page), names.at(-1)!.toLowerCase());
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        "No horizontal overflow at " + width,
      );
      if (width === 1440 || width === 390)
        await section.screenshot({
          path: `${output}/testimonials-${width}.png`,
        });
      assert.deepEqual(errors, []);
      await page.close();
    }

    // Auto-rotation with motion allowed; none under reduced motion.
    for (const reducedMotion of ["no-preference", "reduce"] as const) {
      const page = await browser.newPage({
        viewport: { width: 1440, height: 1000 },
        reducedMotion,
      });
      await page.goto(base + "/");
      await page
        .locator(".testimonials-section")
        .evaluate((el) => el.scrollIntoView({ block: "center" }));
      await page.waitForSelector(".testimonials-enhanced");
      await page.mouse.move(0, 0);
      const first = await activeName(page);
      await page.waitForTimeout(6800);
      const later = await activeName(page);
      if (reducedMotion === "reduce")
        assert.equal(later, first, "Reduced motion: no auto-rotation");
      else assert.notEqual(later, first, "Testimonials auto-rotate");
      await page.close();
    }

    // Without JavaScript every review is readable as a list.
    const staticPage = await browser.newPage({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 1000 },
    });
    await staticPage.goto(base + "/");
    assert.equal(
      await staticPage.locator(".testimonial-card").count(),
      items.length,
    );
    assert.ok(
      await staticPage
        .locator(".testimonial-card")
        .evaluateAll((cards) =>
          cards.every((c) => getComputedStyle(c).opacity === "1"),
        ),
    );
    assert.equal(
      await staticPage.locator(".testimonials-nav").isVisible(),
      false,
    );
    await staticPage.close();
    console.log(
      "PASS animated testimonials: all real Google reviews with exact copy, one featured card, arrow/dot navigation, auto-rotation (none under reduced motion), four widths without overflow and no-JS list.",
    );
  } finally {
    await browser.close();
  }
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});

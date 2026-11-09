import { TestimonialsSection } from "../components/ui/testimonials-section";
import ScrollLogoAssembly from "../components/ui/text-scroll-animation";
import "./tailwind-home.css";
import type { CSSProperties } from "react";
import { inCategory } from "../lib/catalogue";
import HomeMotion from "../components/HomeMotion";
import { brandLogos } from "../data/brand-logos";
import { brands } from "../data/brands";
import { categories } from "../data/categories";
import { products } from "../data/products";
import { categoryImages } from "../data/category-images";
import { industries } from "../data/industries";
import { sourcePages } from "../data/source-pages";
import { metadata as meta } from "../lib/site";

const source = sourcePages.find((p) => p.path === "/")!;
export const metadata = meta(
  source.seo.title || "Building materials, connected",
  source.seo.description || "Building materials enquiries in Deira, Dubai.",
  "/",
);
const container = "tw:mx-auto tw:w-full tw:max-w-[1328px] tw:px-6";
const eyebrow =
  "tw:m-0 tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:border tw:border-solid tw:border-copper/30 tw:bg-copper/10 tw:px-3 tw:py-1 tw:text-[10px] tw:font-bold tw:tracking-[0.2em] tw:uppercase tw:text-copper-dark";
const heading =
  "tw:m-0 tw:font-[Manrope_Variable,Arial,sans-serif] tw:text-[34px] tw:leading-[1.05] tw:font-bold tw:tracking-[-1.5px] tw:md:text-[52px] tw:md:tracking-[-2.5px]";
const button =
  "tw:inline-flex tw:min-h-12 tw:items-center tw:justify-between tw:gap-6 tw:rounded-full tw:border tw:border-solid tw:border-copper tw:bg-copper tw:py-3 tw:pr-3 tw:pl-6 tw:text-[14px] tw:font-bold tw:text-ink tw:no-underline tw:shadow-[0_10px_30px_-12px_rgba(199,131,42,0.6)] tw:hover:border-copper-light tw:hover:bg-copper-light tw:hover:no-underline tw:motion-safe:transition-[background-color,border-color,transform] tw:motion-safe:hover:-translate-y-0.5 tw:[&>svg]:box-content tw:[&>svg]:rounded-full tw:[&>svg]:bg-ink/10 tw:[&>svg]:p-1.5";
const link =
  "tw:inline-flex tw:min-h-11 tw:items-center tw:gap-5 tw:text-[13px] tw:font-bold tw:text-copper-dark tw:no-underline tw:hover:underline tw:underline-offset-4";
const rangeCards = categories
  .filter((c) => Boolean(categoryImages[c.slug]))
  .map((c) => {
    const count = products.filter((p) => inCategory(p, c.slug)).length;
    const subRanges = categories
      .filter((sub) => sub.slug.startsWith(c.slug + "/"))
      .map((sub) => sub.name);
    return {
      slug: c.slug,
      name: c.name,
      image: categoryImages[c.slug],
      countLabel: count === 1 ? "1 product" : count + " products",
      summary: subRanges.length
        ? subRanges.slice(0, 4).join(" · ") +
          (subRanges.length > 4 ? " and more." : ".")
        : "Browse every " + c.name.toLowerCase() + " product in our catalogue.",
    };
  });
const industryCopy: Record<string, string> = {
  marine: "Marine locks, sanitary ware and ship-chandlery hardware.",
  "engineering-fabrication":
    "Tools, fasteners, hardware and industrial supplies.",
  construction: "Building materials, plumbing and sanitary accessories.",
};
const industryContent = industries.map((industry) => ({
  id: "industry-" + industry.slug,
  title: industry.name,
  description: industryCopy[industry.slug],
  image: {
    url: industry.src,
    width: industry.width,
    height: industry.height,
    alt: "",
  },
}));
function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className="tw:shrink-0"
    >
      <path
        d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default function Home() {
  return (
    <main
      id="main"
      className="home-page tailwind-home tw:bg-paper tw:font-sans tw:text-ink"
    >
      <HomeMotion />
      <section
        className="hero home-hero tw:relative tw:isolate tw:flex tw:min-h-[720px] tw:flex-col tw:justify-center tw:overflow-hidden tw:px-0 tw:pt-[140px] tw:pb-20 tw:md:min-h-[780px] tw:md:pt-[160px] tw:lg:pb-24"
        aria-labelledby="home-title"
      >
        <div aria-hidden="true" className="home-hero-backdrop" />
        <div className={container}>
          <div className="hero-intro tw:mx-auto tw:flex tw:max-w-[980px] tw:flex-col tw:items-center tw:text-center">
            <h1
              id="home-title"
              className="tw:mt-7 tw:mb-6 tw:max-w-[900px] tw:font-[Manrope_Variable,Arial,sans-serif] tw:text-[clamp(32px,4.6vw,64px)] tw:leading-[1.04] tw:font-extrabold tw:tracking-[-1.5px] tw:text-ink tw:md:tracking-[-2.5px]"
            >
              Welcome to{" "}
              <span className="home-hero-accent">
                Yusuf Al Yousfi Building Materials Trading LLC
              </span>
            </h1>
            <p className="tw:mt-0 tw:mb-9 tw:max-w-[540px] tw:text-[18px] tw:leading-[1.7] tw:text-muted">
              Explore building materials, sanitary fittings and marine
              hardware. Find your product. Speak to our team.
            </p>
            <div className="tw:flex tw:flex-wrap tw:items-center tw:justify-center tw:gap-3">
              <a className={button} href="/shop/">
                Explore the catalogue <Arrow />
              </a>
              <a
                href="/contact-us/"
                className="tw:inline-flex tw:min-h-12 tw:items-center tw:gap-4 tw:rounded-full tw:border tw:border-solid tw:border-[#d9d7cf] tw:bg-white tw:px-6 tw:text-[14px] tw:font-semibold tw:text-ink tw:no-underline tw:hover:border-ink tw:hover:no-underline tw:motion-safe:transition-colors"
              >
                Talk to our team <Arrow />
              </a>
            </div>
            <dl className="home-hero-stats">
              {[
                ["2004", "Established"],
                [String(products.length), "Products"],
                [String(brands.length), "Brands"],
                [String(categories.length), "Categories"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <nav
              className="hero-industry-links home-hero-industries"
              aria-label="Built around your industry"
            >
              <span>Built around your industry</span>
              {industries.map((i) => (
                <a key={i.slug} href={"#industry-" + i.slug}>
                  {i.name}
                  <Arrow diagonal />
                </a>
              ))}
            </nav>
          </div>
        </div>
      </section>
      <section
        aria-labelledby="home-brands-heading"
        className={container + " tw:relative tw:z-1 tw:pb-24"}
      >
        <div data-home-reveal className="home-brands-card">
          <div className="home-brands-intro">
            <p className="home-brands-eyebrow">Trusted partners</p>
            <h2 id="home-brands-heading">Explore our brands</h2>
            <p>
              {brands.length} specialist brands across marine, sanitary and
              building ranges.
            </p>
            <a href="/brands/" className="home-brands-link">
              View all brands <Arrow />
            </a>
          </div>
          <div className="home-brands-marquee">
            <ScrollLogoAssembly />
          </div>
        </div>
      </section>
      <section className="home-ranges" aria-labelledby="ranges-heading">
        <div className={container}>
          <div
            data-home-reveal
            className="tw:mb-12 tw:flex tw:flex-col tw:gap-6 tw:md:flex-row tw:md:items-end tw:md:justify-between"
          >
            <div>
              <p className={eyebrow + " tw:mb-4"}>01 / PRODUCT RANGES</p>
              <h2 id="ranges-heading" className={heading}>
                Every detail.
                <br />
                <span className="tw:font-normal tw:text-muted">
                  Every requirement.
                </span>
              </h2>
            </div>
            <div className="tw:flex tw:flex-wrap tw:gap-x-8 tw:gap-y-2">
              <a className={link} href="/top-products/">
                View top products <Arrow />
              </a>
              <a className={link} href="/categories/">
                Browse all categories <Arrow />
              </a>
            </div>
          </div>
          <div className="range-grid" data-category-grid>
            {rangeCards.map((c) => (
              <a
                data-home-reveal
                key={c.slug}
                href={"/product-category/" + c.slug + "/"}
                className="range-card"
                style={
                  { "--range-image": `url(${c.image.src})` } as CSSProperties
                }
              >
                <span className="range-card-media">
                  <img
                    src={c.image.src}
                    alt=""
                    width={c.image.width}
                    height={c.image.height}
                    loading="lazy"
                  />
                </span>
                <span className="range-card-body">
                  <span className="range-pill">{c.countLabel}</span>
                  <span className="range-card-name">{c.name}</span>
                </span>
                <span className="range-card-hover" aria-hidden="true">
                  <span className="range-pill range-pill-light">
                    {c.countLabel}
                  </span>
                  <span className="range-hover-title">{c.name}</span>
                  <span className="range-hover-text">{c.summary}</span>
                  <span className="range-hover-cta">
                    Explore range <Arrow />
                  </span>
                </span>
              </a>
            ))}
          </div>
          <div data-home-reveal className="home-ranges-footer">
            <p>Looking for a particular product or model?</p>
            <a className={button} href="/shop/">
              Search the catalogue <Arrow />
            </a>
          </div>
        </div>
      </section>
      <section
        className="home-industries"
        aria-labelledby="industries-heading"
      >
        <div className={container + " home-industries-inner"}>
          <div data-home-reveal className="home-industries-intro">
            <p className="home-brands-eyebrow">02 / OUR EXPERTISE</p>
            <h2 id="industries-heading">Industries We Serve</h2>
            <p>Comprehensive Solutions for a Wide Range of Industries</p>
            <div className="home-industries-links">
              <span>Explore our specialist marine ranges.</span>
              {brands
                .filter((b) => !brandLogos[b.slug])
                .map((b) => (
                  <a
                    href={"/brand/" + b.slug + "/"}
                    key={b.slug}
                    className="home-brands-link"
                  >
                    {b.name}
                    <Arrow />
                  </a>
                ))}
            </div>
          </div>
          <div className="industry-list" data-industry-grid>
            {industryContent.map((item, index) => (
              <article
                data-home-reveal
                id={item.id}
                key={item.id}
                className="industry-row"
              >
                <span className="industry-row-media">
                  <img
                    src={item.image.url}
                    alt={item.image.alt}
                    width={item.image.width}
                    height={item.image.height}
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <span className="industry-row-copy">
                  <span className="industry-row-number" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>
      <TestimonialsSection />
    </main>
  );
}

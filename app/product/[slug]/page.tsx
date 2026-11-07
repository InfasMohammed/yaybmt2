import ProductDocuments from "../../../components/ProductDocuments";
import { productDocuments } from "../../../data/product-documents";
import { productSEO } from "../../../lib/product-seo";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { notFound } from "next/navigation";
import { products } from "../../../data/products";
import ContentBody from "../../../components/ContentBody";
import { brands } from "../../../data/brands";
import { categories } from "../../../data/categories";
import Card from "../../../components/Card";
import Gallery from "../../../components/Gallery";
import { metadata as meta, whatsapp, origin } from "../../../lib/site";
export function generateStaticParams() {
  return products.map((p) => ({ slug: decodeURIComponent(p.slug) }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = products.find(
    (p) => decodeURIComponent(p.slug) === decodeURIComponent(slug),
  );
  return p
    ? meta(
        productSEO(p).title,
        productSEO(p).description,
        "/product/" + p.slug + "/",
        p.status !== "sample",
      )
    : {};
}
export default async function Product({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = products.find(
    (p) => decodeURIComponent(p.slug) === decodeURIComponent(slug),
  );
  if (!p) notFound();
  const brand = brands.find((b) => b.slug === p.brand);
  const related = products
    .filter(
      (x) =>
        x.slug !== p.slug &&
        (p.brand
          ? x.brand === p.brand
          : x.categorySlugs.some((c) => p.categorySlugs.includes(c))),
    )
    .slice(0, 3);
  const structured =
    p.status !== "sample"
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.name,
          ...(p.model ? { model: p.model } : {}),
          ...(brand ? { brand: { "@type": "Brand", name: brand.name } } : {}),
          url: origin + "/product/" + p.slug + "/",
          ...(p.description.length
            ? { description: p.description.join("\n") }
            : {}),
          ...(p.images.length
            ? { image: p.images.map((i) => new URL(i.src, origin).href) }
            : {}),
        }
      : null;
  return (
    <main id="main" className="page">
      {structured && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structured).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Catalogue", path: "/shop/" },
          ...(brand
            ? [{ name: brand.name, path: "/brand/" + brand.slug + "/" }]
            : []),
          { name: p.name, path: "/product/" + p.slug + "/" },
        ]}
      />
      <div className="product-layout">
        <Gallery product={p} />
        <section className="product-info">
          <p className="eyebrow">
            {brand?.name || "YAYBMT CATALOGUE"} /{" "}
            {p.status === "sample" ? "PRODUCT SAMPLE" : "PRODUCT INFORMATION"}
          </p>
          <h1>{p.name}</h1>
          <p className="model">{p.model ? "MODEL " + p.model : ""}</p>
          {p.description.length ? (
            p.description.map((text, i) => (
              <p className="product-copy" key={i}>
                {text}
              </p>
            ))
          ) : (
            <p className="product-copy">
              For product details and suitability for your project, speak
              directly with our team in Deira, Dubai.
            </p>
          )}
          <div className="product-cta">
            <a
              className="button button-whatsapp"
              href={whatsapp(p.model ? p.name + " (" + p.model + ")" : p.name)}
            >
              <img src="/images/icons/whatsapp.svg" alt="" width="20" height="20" />
              Enquire on WhatsApp
            </a>
            <a className="button outline" href="/contact-us/">
              Request a quote
            </a>
          </div>
          <ul className="product-assurances">
            <li>Confirm specifications, pricing and availability with our team.</li>
            <li>Showroom in Deira, Dubai · Serving customers since 2004.</li>
          </ul>
          <details open className="product-panel">
            <summary>Product information</summary>
            <dl>
              <dt>Brand</dt>
              <dd>
                {brand ? (
                  <a className="text-link" href={"/brand/" + brand.slug + "/"}>
                    {brand.name}
                  </a>
                ) : (
                  "Not recorded in the source catalogue"
                )}
              </dd>
              <dt>Model reference</dt>
              <dd>{p.model || ""}</dd>
            </dl>
            {p.categorySlugs.length > 0 && (
              <p>
                Categories:{" "}
                {p.categorySlugs.map((slug) => (
                  <a
                    className="category-link"
                    href={"/product-category/" + slug + "/"}
                    key={slug}
                  >
                    {categories.find((c) => c.slug === slug)?.name}
                  </a>
                ))}
              </p>
            )}
          </details>
          <details open className="product-panel">
            <summary>Specifications</summary>
            {p.specifications.length ? (
              <dl>
                {p.specifications.map((spec, i) => (
                  <div className="spec-row" key={spec.label + String(i)}>
                    <dt>{spec.label}</dt>
                    <dd>{spec.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p>
                Technical specifications are not recorded for this product in
                the supplied catalogue. Contact our team for details.
              </p>
            )}
          </details>
          <ProductDocuments product={p} />
          {p.bodyHtml && (
            <details className="product-panel">
              <summary>Original product details</summary>
              <ContentBody
                html={
                  productDocuments[p.slug]?.length
                    ? p.bodyHtml.replace(
                        /<p>Additional source illustration is not available in this review\.<\/p>/g,
                        "",
                      )
                    : p.bodyHtml
                }
              />
            </details>
          )}
          {p.status === "sample" && (
            <p className="notice">
              Sample record from the previous public project preview. No
              specifications, prices or availability have been inferred from its
              title.
            </p>
          )}
        </section>
      </div>
      {related.length > 0 && (
        <section className="related">
          <p className="eyebrow">CONTINUE EXPLORING</p>
          <h2>{brand ? "More from " + brand.name : "Related products"}</h2>
          <p>Related by {brand ? "brand" : "category"} only.</p>
          <div className="grid">
            {related.map((x) => (
              <Card key={x.slug} product={x} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

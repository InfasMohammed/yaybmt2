import AboutIntroCard from "../../components/AboutIntroCard";
import ContactIntroCard from "../../components/ContactIntroCard";
import ContactSections from "../../components/ContactSections";
import AboutSections from "../../components/AboutSections";
import PageHero from "../../components/PageHero";
import { origin } from "../../lib/site";
import { notFound } from "next/navigation";
import { pages } from "../../data/pages";
import { articles } from "../../data/articles";
import ContentBody from "../../components/ContentBody";
import ContactLinks from "../../components/ContactLinks";
import { metadata as meta } from "../../lib/site";
export const dynamicParams = false;
export function generateStaticParams() {
  return [...pages, ...articles].map((item) => ({
    path: item.path.split("/").filter(Boolean),
  }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ path: string[] }>;
}) {
  const { path } = await params;
  const pathname = "/" + path.join("/") + "/";
  const item = [...pages, ...articles].find((p) => p.path === pathname);
  return item
    ? meta(
        item.seo?.title || item.title,
        item.seo?.description || item.description,
        pathname,
        !("kind" in item && item.kind === "retired") &&
          (!("status" in item) || item.status !== "sample"),
      )
    : {};
}
export default async function Page({
  params,
}: {
  params: Promise<{ path: string[] }>;
}) {
  const { path } = await params;
  const pathname = "/" + path.join("/") + "/";
  const item = [...pages, ...articles].find((p) => p.path === pathname);
  if (!item) notFound();
  const structured = !("kind" in item)
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: item.title,
        description: item.description,
        datePublished: item.publishedAt,
        mainEntityOfPage: origin + item.path,
        publisher: { "@id": origin + "/#organization" },
      }
    : null;
  return (
    <main
      id="main"
      className={
        pathname === "/about-us/"
          ? "page about-page"
          : pathname === "/contact-us/"
            ? "page contact-page"
            : "page prose"
      }
    >
      {structured && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structured).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <PageHero
        crumbs={[
          { name: "Home", path: "/" },
          ...(!("kind" in item) ? [{ name: "Articles", path: "/blog/" }] : []),
          { name: item.title, path: item.path },
        ]}
        eyebrow={"kind" in item ? "YUSUF AL YOUSFI" : "ARTICLES"}
        title={item.title}
      >
        {"publishedAt" in item && item.publishedAt && (
          <p className="page-hero-meta">
            <time dateTime={item.publishedAt}>{item.publishedAt}</time>
          </p>
        )}
      </PageHero>
      {pathname === "/about-us/" ? (
        <AboutIntroCard paragraphs={item.paragraphs} />
      ) : pathname === "/contact-us/" ? (
        <ContactIntroCard paragraphs={item.paragraphs} />
      ) : (
        item.paragraphs.map((text, i) => <p key={i}>{text}</p>)
      )}
      {pathname === "/about-us/" && <AboutSections />}
      {item.bodyHtml && <ContentBody html={item.bodyHtml} />}{" "}
      {pathname === "/contact-us/" ? (
        <ContactSections />
      ) : pathname === "/about-us/" ? null : "kind" in item ? (
        <>
          <h2>
            {item.kind === "contact"
              ? "Speak to our team"
              : "Let’s discuss your requirements."}
          </h2>
          <ContactLinks />
          <p>
            <a className="text-link" href="/shop/">
              Browse the catalogue
            </a>
          </p>
          <p className="muted">
            WhatsApp opens a draft message; you choose whether to send it.
          </p>
        </>
      ) : (
        <a className="text-link" href="/blog/">
          All articles
        </a>
      )}
    </main>
  );
}

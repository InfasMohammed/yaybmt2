import { categories } from "../data/categories";
import { brands } from "../data/brands";
import SiteFooter from "../components/SiteFooter";
import PageScrollAnimation from "../components/ui/page-scroll-animation";
import HeaderMenu from "../components/HeaderMenu";
import "./globals.css";
import "./modern.css";
import { origin } from "../lib/site";
import { whatsapp } from "../lib/site";
import { contacts } from "../data/contacts";
export const metadata = {
  icons: {
    icon: [
      { url: "/favicon.ico?v=1", sizes: "any" },
      { url: "/favicon-32x32.png?v=1", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-touch-icon.png?v=1", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/inter-latin-variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/manrope-latin-variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": origin + "/#organization",
              name: contacts.company,
              url: origin,
              logo: origin + "/images/logo-header-original.jpg",
              telephone: contacts.telephone,
              email: contacts.sales,
              sameAs: [
                contacts.instagram,
                contacts.facebook,
                contacts.linkedin,
              ],
              location: contacts.location,
            }).replace(/</g, "\\u003c"),
          }}
        />
        <a className="skip" href="#main">
          Skip to content
        </a>
        <header>
          <a href="/" aria-label="YAYBMT home">
            <img
              className="logo"
              src="/images/logo-footer-original.png"
              alt="Yusuf Al Yousfi Building Materials Trading LLC"
            />
          </a>
          <HeaderMenu
            categories={categories
              .filter(
                (c) => !c.slug.includes("/") && c.slug !== "uncategorized",
              )
              .map(({ slug, name }) => ({ slug, name }))}
            brands={brands.map(({ slug, name }) => ({ slug, name }))}
          />
          <a className="header-cta" href="/contact-us/">
            Enquire now
          </a>
        </header>
        <PageScrollAnimation />
        {children}
        <SiteFooter />
        <a
          className="floating"
          href={whatsapp()}
          aria-label="Enquire on WhatsApp"
        >
          <img src="/images/icons/whatsapp.svg" alt="" />
          <span className="floating-label" aria-hidden="true">
            WhatsApp us
          </span>
        </a>
      </body>
    </html>
  );
}

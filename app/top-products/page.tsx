import PageHero from "../../components/PageHero";
import Card from "../../components/Card";
import { catalogueItem } from "../../lib/catalogue-data";
import { focusEntry, liveFocusProducts } from "../../data/focus-products";
import { metadata as meta, whatsapp } from "../../lib/site";

export const metadata = meta(
  "Top Products – Marine Door Locks & Daelim Sanitary Ware",
  "YAYBMT's most requested lines in Dubai: C1, C2 and C4 marine door locks, Staco, Cosmo, Kopat and Horse mortise locks, and Daelim thermostatic mixers, flush valves and WCs.",
  "/top-products/",
);

const groups = [
  {
    key: "locks" as const,
    title: "Marine door locks",
    intro:
      "Fireproof, weather-tight and mortice locks for ship cabins, toilets and steel doors.",
  },
  {
    key: "sanitary" as const,
    title: "Sanitary & plumbing",
    intro:
      "Daelim and Royal & Co mixers, flush valves, WCs, basins and wastes for marine and commercial washrooms.",
  },
];

export default function Page() {
  const items = liveFocusProducts();
  return (
    <main id="main" className="page top-products-page">
      <PageHero
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Top products", path: "/top-products/" },
        ]}
        eyebrow="OUR MOST REQUESTED LINES"
        title="Top products"
        aside={
          <p className="page-hero-stat">
            <strong>{items.length}</strong> lead lines
          </p>
        }
      >
        <p className="page-hero-lead">
          The marine locks and sanitary fittings our customers ask for most.
          Open any product for full specifications and enquire directly.
        </p>
      </PageHero>
      {groups.map((group) => {
        const list = items.filter(
          (p) => focusEntry(p.slug)?.group === group.key,
        );
        if (!list.length) return null;
        return (
          <section
            className="top-products-group"
            key={group.key}
            aria-labelledby={"top-" + group.key}
          >
            <div className="top-products-group-head">
              <h2 id={"top-" + group.key}>{group.title}</h2>
              <p>{group.intro}</p>
            </div>
            <div className="grid">
              {list.map((p) => (
                <Card key={p.slug} product={catalogueItem(p)} />
              ))}
            </div>
          </section>
        );
      })}
      <section className="top-products-cta" aria-labelledby="top-cta">
        <h2 id="top-cta">Looking for a different model?</h2>
        <p>
          Send us the model number or a photo and our team in Deira, Dubai
          will confirm availability.
        </p>
        <div className="enquiry-actions">
          <a className="button" href="/contact-us/">
            Make an enquiry
          </a>
          <a className="button outline" href={whatsapp("Top products")}>
            Enquire on WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}

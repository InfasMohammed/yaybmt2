import { catalogueItems } from "../lib/catalogue-data";
import Catalogue from "./Catalogue";
import PageHero from "./PageHero";
export default function CataloguePage({ page = 1 }: { page?: number }) {
  return (
    <main id="main" className="page">
      <PageHero
        eyebrow="PRODUCT CATALOGUE"
        title={page > 1 ? "Catalogue – Page " + page : "Catalogue"}
        aside={
          <p className="page-hero-stat">
            <strong>{catalogueItems.length}</strong> products
          </p>
        }
      >
        <p className="page-hero-lead">
          Marine hardware, sanitary fittings and building materials. Search by
          name or model, filter by brand and range, then enquire directly.
        </p>
      </PageHero>
      <Catalogue items={catalogueItems} initialPage={page} />
    </main>
  );
}

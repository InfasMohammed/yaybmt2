import { LogoCloud } from "../../components/ui/logo-cloud";
import PageHero from "../../components/PageHero";
import { metadata as meta } from "../../lib/site";
export const metadata = meta(
  "Browse brands",
  "Explore brand catalogue information and enquiries at YAYBMT, Deira, Dubai.",
  "/brands/",
);
export default function Page() {
  return (
    <main id="main" className="page">
      <PageHero
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Brands", path: "/brands/" },
        ]}
        eyebrow="EXPLORE THE CATALOGUE"
        title="Browse by brand."
      >
        <p className="page-hero-lead">
          Trusted manufacturers across marine, sanitary and building ranges.
        </p>
      </PageHero>
      <LogoCloud />
    </main>
  );
}

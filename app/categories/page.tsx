import PageHero from "../../components/PageHero";
import { categories } from "../../data/categories";
import { metadata as meta } from "../../lib/site";
export const metadata = meta(
  "Browse product categories",
  "Explore building materials and marine hardware category information at YAYBMT.",
  "/categories/",
);
export default function Page() {
  const roots = categories.filter((c) => !c.slug.includes("/"));
  return (
    <main id="main" className="page">
      <PageHero
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Categories", path: "/categories/" },
        ]}
        eyebrow="EXPLORE THE CATALOGUE"
        title="Browse by range."
      >
        <p className="page-hero-lead">
          Every product range in the catalogue, from marine fittings to pipes,
          fasteners and tools.
        </p>
      </PageHero>
      {roots.map((root) => (
        <section className="category-group" key={root.slug}>
          <h2>
            <a href={"/product-category/" + root.slug + "/"}>{root.name}</a>
          </h2>
          <div className="directory">
            {categories
              .filter((c) => c.slug.startsWith(root.slug + "/"))
              .map((c) => (
                <a href={"/product-category/" + c.slug + "/"} key={c.slug}>
                  {c.name}
                  <span aria-hidden="true">→</span>
                </a>
              ))}
          </div>
        </section>
      ))}
    </main>
  );
}

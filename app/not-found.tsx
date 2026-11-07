export default function NotFound() {
  return (
    <main id="main" className="page not-found-page">
      <div className="not-found-card">
        <p className="not-found-code" aria-hidden="true">
          404
        </p>
        <p className="eyebrow">PAGE NOT FOUND</p>
        <h1>This page has moved or never existed.</h1>
        <p>
          This address is not part of the current catalogue. Try searching for
          a product, or browse by brand or range.
        </p>
        <form
          className="not-found-search"
          action="/shop/"
          method="get"
          role="search"
        >
          <label className="sr-only" htmlFor="not-found-q">
            Search products
          </label>
          <input
            id="not-found-q"
            type="search"
            name="q"
            placeholder="Search by name or model…"
          />
          <button className="button" type="submit">
            Search
          </button>
        </form>
        <div className="enquiry-actions">
          <a className="button outline" href="/shop/">
            Browse the catalogue
          </a>
          <a className="button outline" href="/brands/">
            View brands
          </a>
          <a className="button outline" href="/contact-us/">
            Contact our team
          </a>
        </div>
      </div>
    </main>
  );
}

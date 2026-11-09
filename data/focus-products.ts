import { products } from "./products";
import type { Product } from "./types";

/**
 * Client's 20 focus products (contract section 3.4), in the client's order.
 *
 * - `live` entries point at existing catalogue products and get prominence + search targeting.
 * - `awaiting` entries have no catalogue record yet; they publish nothing until the client
 *   supplies Section 6 data (name, model, description, sourced specs, photo). See docs/focus-products.md.
 * - SEO titles/descriptions only restate facts already present in each product's imported record.
 * - `extraSpecs` derive specifications from the product's own imported description, keeping
 *   the same source reference; nothing is invented.
 */
export type FocusEntry = {
  rank: number;
  clientLabel: string;
  status: "live" | "awaiting";
  slugs: string[];
  group: "locks" | "sanitary";
  confirm?: string;
  missing?: string;
  searchTerms: string[];
  seo?: { title: string; description: string };
  extraSpecs?: Record<string, { label: string; value: string; source: string }[]>;
};

export const focusEntries: FocusEntry[] = [
  {
    rank: 1,
    clientLabel: "SUNGMI LOCK 1501",
    status: "awaiting",
    slugs: [],
    group: "locks",
    confirm:
      "The catalogue only has the Sung Mi SM-1105 cylinder mortise lock. Is “1501” the SM-1105, or a different model?",
    searchTerms: ["Sung Mi marine mortise lock", "Sungmi lock Dubai"],
  },
  {
    rank: 2,
    clientLabel: "COSMO LOCK 5600",
    status: "live",
    slugs: ["5600"],
    group: "locks",
    searchTerms: [
      "Cosmo CD-5600 mortice lock",
      "marine cabin door lock 6-pin",
      "Cosmo marine lock UAE",
    ],
    seo: {
      title: "COSMO CD-5600 Marine Mortice Lock | Cabin Door Lock",
      description:
        "COSMO CD-5600 marine-grade cylinder mortice lock for interior and cabin doors: 6-pin tumbler, 54.5 mm backset, fits 35–45 mm doors. Enquire with YAYBMT, Deira, Dubai.",
    },
  },
  {
    rank: 3,
    clientLabel: "STACO LOCK 7000",
    status: "live",
    slugs: ["7000"],
    group: "locks",
    searchTerms: ["Staco 7000 lockcase", "Staco marine mortice lock", "marine lockcase Dubai"],
    seo: {
      title: "Staco 7000 Marine Mortice Lockcase | Dubai Supplier",
      description:
        "Staco 7000 marine-grade mortice lockcase in locking, latching or WC versions, for interior and exterior marine doors. Ask YAYBMT in Dubai for cylinders and handles.",
    },
  },
  {
    rank: 4,
    clientLabel: "KOPAT LOCK 1100",
    status: "live",
    slugs: ["s-1100pc"],
    group: "locks",
    confirm: "Matched to the KOPAT S-1100PC(LH) mortise lever lock — please confirm.",
    searchTerms: ["Kopat 1100 mortise lock", "Kopat S-1100PC", "Kopat marine lock UAE"],
    seo: {
      title: "KOPAT S-1100PC Mortise Lever Lock | Marine Doors",
      description:
        "KOPAT S-1100PC(LH) mortise lever lock for frequent use on hospital, marine and commercial interior doors. Official KOPAT distributor in the Gulf — enquire at YAYBMT.",
    },
  },
  {
    rank: 5,
    clientLabel: "HORSE DOOR LOCK C1",
    status: "live",
    slugs: ["marine-fire-lock-c1-ohs-2320-rho"],
    group: "locks",
    searchTerms: ["Horse C1 marine fire lock", "OHS-2320 door lock", "marine fire door lock UAE"],
    seo: {
      title: "Horse C1 OHS-2320 Marine Fire Door Lock | 304 SS",
      description:
        "Horse C1 OHS-2320 RHO marine fire lock: double-tongue 304 stainless steel lock for 35–50 mm interior doors, 102 mm centre distance. Enquire with YAYBMT, Dubai.",
    },
  },
  {
    rank: 6,
    clientLabel: "C1 MARINE DOOR LOCK",
    status: "live",
    slugs: ["c1"],
    group: "locks",
    searchTerms: ["C1 marine door lock", "ship cabin door lock master key", "marine fireproof door lock"],
    seo: {
      title: "C1 Marine Door Lock | Fireproof Ship Cabin Lock",
      description:
        "C1 marine fireproof door lock for ship cabin and A-class fire doors: double bolt, single cylinder and master key system. Supplied by YAYBMT in Deira, Dubai.",
    },
  },
  {
    rank: 7,
    clientLabel: "C4 MARINE DOOR LOCK",
    status: "live",
    slugs: ["c4"],
    group: "locks",
    searchTerms: ["C4 marine door lock", "ship toilet door lock indicator", "marine privacy lock"],
    seo: {
      title: "C4 Marine Door Lock | Ship Toilet Privacy Lock",
      description:
        "C4 marine privacy lock for ship toilet and bathroom doors: double bolts, red outside indicator, fits 35–45 mm doors. Enquire with YAYBMT, Dubai.",
    },
  },
  {
    rank: 8,
    clientLabel: "C2 MARINE DOOR LOCK WEATHER TIGHT",
    status: "live",
    slugs: ["c2"],
    group: "locks",
    searchTerms: ["C2 weather tight door lock", "marine watertight door lock", "ship steel door lock"],
    seo: {
      title: "C2 Weather-Tight Marine Door Lock | Ship Doors",
      description:
        "C2 marine weather-tight door lock for steel and watertight ship doors: double bolt, single cylinder, master key, fits 38–42 mm doors. Enquire at YAYBMT, Dubai.",
    },
  },
  {
    rank: 9,
    clientLabel: "MORTISE DOOR LOCK OHS 2320 S500",
    status: "awaiting",
    slugs: [],
    group: "locks",
    confirm:
      "OHS-2320 is already #5 (Horse C1 OHS-2320). There is no “S500” in the catalogue — which product is this?",
    searchTerms: ["OHS 2320 mortise lock", "S500 mortise door lock"],
  },
  {
    rank: 10,
    clientLabel: "CF-3 SLIDING DOOR LOCK (NEW PRODUCT)",
    status: "awaiting",
    slugs: [],
    group: "locks",
    missing: "New product: name, model, description, specifications and photo needed.",
    searchTerms: ["CF-3 sliding door lock", "marine sliding door lock"],
  },
  {
    rank: 11,
    clientLabel: "FLUSH VALVE DAELIM FC 110 CS",
    status: "live",
    slugs: ["fc-110cs"],
    group: "sanitary",
    searchTerms: ["Daelim FC110CS flush valve", "urinal flush valve UAE", "delay urinal flush valve"],
    seo: {
      title: "Daelim FC 110CS Urinal Flush Valve | Brass",
      description:
        "Daelim FC 110CS wall-mounted brass urinal flush valve with time-delayed operation for public washrooms. Enquire with YAYBMT, Deira, Dubai.",
    },
  },
  {
    rank: 12,
    clientLabel: "WASH BASIN MIXER FL-3200 / FL-0200 DAELIM",
    status: "live",
    slugs: ["fl-3200c"],
    group: "sanitary",
    missing: "FL-0200 is not in the catalogue yet: name, specifications and photo needed.",
    searchTerms: ["Daelim FL 3200 basin mixer", "Daelim wash basin tap", "chrome wash tap UAE"],
    seo: {
      title: "Daelim FL 3200C Wash Basin Mixer Tap | Chrome",
      description:
        "Daelim FL 3200C chrome wash basin tap in brass with a polished chrome finish, for washbasins and utility sinks. Enquire with YAYBMT, Dubai.",
    },
  },
  {
    rank: 13,
    clientLabel: "THERMOSTATIC SHOWER MIXER DAELIM HB2060 NRC",
    status: "live",
    slugs: ["fb-2060nc"],
    group: "sanitary",
    confirm: "Matched to Daelim FB2060NC (catalogue uses “FB”, list says “HB”) — please confirm.",
    searchTerms: ["Daelim 2060 thermostatic shower mixer", "thermostatic shower mixer UAE", "FB2060NC"],
    seo: {
      title: "Daelim FB2060NC Thermostatic Shower Mixer",
      description:
        "Daelim FB2060NC wall-mounted thermostatic shower mixer: solid brass body, chrome finish, preset 38°C safety temperature. Enquire with YAYBMT, Dubai.",
    },
  },
  {
    rank: 14,
    clientLabel: "CC 114 DAELIM FLOOR MOUNTED WC",
    status: "awaiting",
    slugs: [],
    group: "sanitary",
    missing: "Not in the catalogue: name, model, specifications and photo needed.",
    searchTerms: ["Daelim CC 114 floor mounted WC", "floor mounted toilet Daelim"],
  },
  {
    rank: 15,
    clientLabel: "DC 701 WALL HUNG WC WITH SEAT COVER",
    status: "live",
    slugs: ["dc-701"],
    group: "sanitary",
    searchTerms: ["Daelim DC 701 wall hung WC", "wall hung toilet UAE", "DC701"],
    seo: {
      title: "Daelim DC 701 Wall-Hung WC | Space-Saving Toilet System",
      description:
        "Daelim DC 701 manual wall-hung toilet system: space-saving, wall-mounted design for residential, commercial and public washrooms. Enquire with YAYBMT, Dubai.",
    },
  },
  {
    rank: 16,
    clientLabel: "RWL 220 ROYAL & CO WASH BASIN",
    status: "live",
    slugs: ["rwl220"],
    group: "sanitary",
    searchTerms: ["Royal & Co RWL220 wash basin", "wall hung wash basin UAE", "RWL 220"],
    seo: {
      title: "Royal & Co RWL220 Wall-Hung Wash Basin",
      description:
        "Royal & Co RWL220 wall-hung ceramic washbasin with exposed trap and 3-hole centre-set tap fitting. Enquire with YAYBMT, Deira, Dubai.",
    },
  },
  {
    rank: 17,
    clientLabel: "WEATHER TIGHT DOOR HATCH HANDLE (NEW PRODUCT)",
    status: "awaiting",
    slugs: [],
    group: "locks",
    missing: "New product: name, model, description, specifications and photo needed.",
    searchTerms: ["weather tight door hatch handle", "marine hatch handle"],
  },
  {
    rank: 18,
    clientLabel: "DAELIM S TRAP FL 222 / FL 247 POP UP",
    status: "live",
    slugs: ["fl-247"],
    group: "sanitary",
    confirm:
      "FL 247 pop-up waste is live. The catalogue’s FL 222N is a stainless bathroom accessory, not an S-trap — please confirm FL 222.",
    searchTerms: ["Daelim FL 247 pop up waste", "push open basin waste", "Daelim S trap"],
    seo: {
      title: "Daelim FL 247 Pop-Up Basin Waste | 1¼″ Push-Open",
      description:
        "Daelim FL 247 1¼″ push-open pop-up basin waste with removable cover and built-in overflow, for bathroom sinks. Enquire with YAYBMT, Dubai.",
    },
  },
  {
    rank: 19,
    clientLabel: "THERMOSTATIC SHOWER MIXER (NEW PRODUCT)",
    status: "awaiting",
    slugs: [],
    group: "sanitary",
    missing: "New product: name, model, description, specifications and photo needed.",
    searchTerms: ["thermostatic shower mixer Dubai"],
  },
  {
    rank: 20,
    clientLabel: "THERMOSTATIC SHOWER MIXER DAELIM HB2060 TKR WITH SPOUT",
    status: "live",
    slugs: ["fb-2060tkr"],
    group: "sanitary",
    confirm: "Matched to Daelim FB2060TKR (catalogue uses “FB”) — please confirm.",
    searchTerms: ["Daelim 2060 TKR thermostatic mixer with spout", "thermostatic bath mixer spout"],
    seo: {
      title: "Daelim FB2060TKR Thermostatic Mixer with Spout",
      description:
        "Daelim FB2060TKR wall-mounted thermostatic mixer with spout: chrome finish, preset 38°C anti-scald control, for bathrooms and hotels. Enquire with YAYBMT, Dubai.",
    },
  },
];

const bySlug = new Map<string, FocusEntry>();
for (const entry of focusEntries)
  if (entry.status === "live") entry.slugs.forEach((slug) => bySlug.set(slug, entry));

export function focusEntry(slug: string) {
  return bySlug.get(slug);
}
export function isFocusProduct(slug: string) {
  return bySlug.has(slug);
}
export function focusRank(slug: string) {
  return bySlug.get(slug)?.rank;
}

/** Live focus products, resolved to catalogue records, in the client's order. */
export function liveFocusProducts(): Product[] {
  return focusEntries
    .filter((entry) => entry.status === "live")
    .flatMap((entry) =>
      entry.slugs
        .map((slug) => products.find((p) => p.slug === slug))
        .filter((p): p is Product => Boolean(p)),
    );
}

/** Specifications for display: imported specs minus code/supplier noise, plus sourced extras. */
export function displaySpecifications(product: Product) {
  const noise = /^(payment terms|shipping port|transaction number|quality guarantee)/i;
  // Imported page CSS that leaked into some spec tables (e.g. "display" = "flex;").
  const codeLabel = (text: string) => /[;{}<>]|\/\*|@media/i.test(text);
  const codeValue = (text: string) =>
    /;\s*$|\d\s*px\b|!important|rgba?\(|[{}]|\/\*/i.test(text);
  const extras = focusEntry(product.slug)?.extraSpecs?.[product.slug] ?? [];
  const kept = product.specifications.filter(
    (spec) =>
      !noise.test(spec.label) &&
      !codeLabel(spec.label) &&
      !codeValue(spec.value),
  );
  const seen = new Set<string>();
  return [...kept, ...extras].filter((spec) => {
    const key = spec.label.toLowerCase() + "|" + spec.value.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Material / size / finish / use summary taken only from sourced specifications. */
export function keyFacts(product: Product) {
  const specs = displaySpecifications(product);
  // First matching label wins, in priority order.
  const pick = (...patterns: RegExp[]) => {
    for (const re of patterns) {
      const hit = specs.find((spec) => re.test(spec.label));
      if (hit) return hit.value;
    }
    return undefined;
  };
  return [
    { label: "Material", value: pick(/^material/i, /^panel & handle material/i) },
    {
      label: "Size",
      value: pick(
        /^(size|dimensions?)/i,
        /door thickness/i,
        /backset/i,
        /cent(re|er) distance/i,
      ),
    },
    { label: "Finish", value: pick(/^finish/i, /^surface/i, /^colou?r/i) },
    {
      label: "Use",
      value: pick(/^application/i, /^(functional use|usage)/i, /^function/i),
    },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value));
}

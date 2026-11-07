# Design system — "Harbour & Brass"

The site-wide visual language. Tokens are CSS custom properties on `:root` in [app/globals.css](../app/globals.css); the modern component layer is [app/modern.css](../app/modern.css), imported last in [app/layout.tsx](../app/layout.tsx). The homepage uses the same values through the prefixed Tailwind theme in [app/tailwind-home.css](../app/tailwind-home.css) (`tw:bg-ink`, `tw:bg-copper`, `tw:bg-mist`, …).

## Colour

| Token | Value | Use |
| --- | --- | --- |
| `--ink` | `#0e1a22` | Text, dark buttons (the UI itself is light-only) |
| `--canvas` (`--paper`) | `#f5f4f0` | Page background |
| `--surface` | `#ffffff` | Cards, panels, inputs |
| `--mist` | `#e9eef0` | Cool tinted sections and info boxes |
| `--brass` | `#c7832a` | Primary button fill (ink text), focus rings, accents. Not for small text on light backgrounds. |
| `--brass-light` | `#e9b86b` | Accent text on dark backgrounds, button hover |
| `--copper` | `#9c5f18` | Accent **text** on light backgrounds (AA) |
| `--copper-dark` | `#7a4a10` | Eyebrows, hover text |
| `--muted` | `#5b646a` | Secondary text |
| `--line` | `#e3e1da` | Hairline borders |

WhatsApp actions keep a green (`#1f8f5f`) so they stay recognisable.

## Type, shape, depth

- Inter Variable (body) and Manrope Variable (headings, 700–800, tight negative tracking), both self-hosted.
- Radii: `--radius-sm` 10px, `--radius` 16px, `--radius-lg` 24px; buttons, chips and pagination are pills.
- Shadows: `--shadow-sm`, `--shadow`, `--shadow-lg` (soft, navy-tinted).
- Motion: `--ease` (`cubic-bezier(0.22, 1, 0.36, 1)`); hover lifts are disabled under `prefers-reduced-motion`.

## Components

- **Header**: light frosted bar (sticky on inner pages, transparent over the light homepage hero) with the colour logo on a white tile. `.header-cta` is an ink pill to `/contact-us/` (the header must not contain WhatsApp links).
- **`PageHero`** ([components/PageHero.tsx](../components/PageHero.tsx)): light title band (soft brass/blue glow, faint grid) with breadcrumbs, eyebrow, the page's single H1, optional lead (`.page-hero-lead`) and aside stat (`.page-hero-stat`). Use it for every inner page.
- **Buttons**: `.button` (brass), `.button.outline` (surface), `.button-whatsapp`.
- **Eyebrow**: `.eyebrow` pill with a brass dot.
- **Product card** (`.card`): open tile with a framed square photo that lifts and zooms on hover, a "View details" pill, brand label, model chip and rotating arrow.
- **Catalogue**: toolbar card with icon search, sticky filter card, count badges, ink chips, pill pagination, bottom-sheet filter dialog on mobile.
- **Product detail**: sticky gallery, two CTAs, assurance list, `<details class="product-panel">` accordions with striped spec tables (works without JavaScript).
- **Homepage** (top to bottom): centred hero on a light gradient (welcome heading, CTAs, stats strip, industry pills); dark brands card with an infinite logo marquee ([components/ui/text-scroll-animation.tsx](../components/ui/text-scroll-animation.tsx), static wrapping row under reduced motion/no JS, duplicate set is `aria-hidden`); product ranges as an even 4-column grid of bordered photo cards whose brand-green hover panel shows the real product count and sub-ranges; Industries We Serve as a compact full-width dark band (intro beside three slim rows with small 3:2 thumbnails, `#industry-…` anchors kept); testimonials (light section, dark review cards). The company video lives on the contact page in a scroll-linked 3D card ([components/ui/container-scroll.tsx](../components/ui/container-scroll.tsx)). Avoid continuous animations behind `backdrop-filter` surfaces: they re-blur every frame.
- **Footer**: light surface with a brass-tinted CTA card and link columns.
- **About / contact**: long copy is split into a lead statement, numbered point cards, range tags and an action panel; original paragraphs stay intact. The contact page has no map: the company video sits beside the enquiry form.
- **Motion**: inner-page elements reveal once (fade, 12px rise, slight scale and de-blur, staggered) via [components/ui/page-scroll-animation.tsx](../components/ui/page-scroll-animation.tsx); page navigations cross-fade with a soft slide. Everything is disabled under reduced motion.

When adding a page, wrap content in `<main id="main" className="page">`, start with `PageHero`, and use the tokens above instead of new hex values.

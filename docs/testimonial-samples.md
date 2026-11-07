# Homepage customer reviews

The supplied TestimonialsSection card format sits after Industries We Serve and before the enquiry section. The initial three clearly-labelled dummy cards were replaced at the client's request with Google-review records recovered from the client-supplied softsql.zip WordPress export. There is no WordPress runtime dependency.

## Source and limits

Read-only public homepage and About Us retrieval on 6 November 2026 (Dubai) showed testimonial headings but did not expose widget review text. Novamira discovery returned an internal error. The offline Trustindex Google reviews table contains four unhidden records. Its page-details option identifies Yusuf Al Yousfi Building Materials Trading LLC (YAYBMT), Souk Deira St, Naif, Dubai; its Google CID matches the confirmed 10643360148458649588. No credentials, plugin tokens, private SQL or profile-photo URLs are committed.

All four public review records are preserved in data/testimonials.ts with exact names, text where present, ratings, stored dates, original review IDs and legacy-page provenance. The first three are displayed: two written reviews (Mustafa Mithi, 5/5; salman rangwala, 4/5) followed by Tasneem Mithi's 5/5 rating-only record. Mohammed Mithi's 5/5 rating-only record remains in local data. No third quote is fabricated; the rating-only card says “No written comment.” No job titles, company names or real customer portraits are invented; circles show initials only.

The section says “Feedback shared by our customers on Google” and links to the confirmed business Maps listing. These are historical cached records dated 20 May 2025, not a live Google feed or independently refreshed ratings. There is no aggregate score/count or Review/AggregateRating structured data. Read reviews on Google leads to the real business listing rather than an invented per-review URL.

## Rendering

The section uses the supplied 21st.dev "Simple Animated Testimonials" component, ported to components/ui/simple-animated-testimonials.tsx: shadcn Card/Button/Avatar/Separator are replaced by plain elements styled in app/testimonials.css (the site's Tailwind is prefixed with no shadcn theme), `framer-motion` is the already-installed `motion/react`, and icons are inline SVG. The light section shows one dark review card at a time that slides in, auto-rotates every 6 seconds (paused on hover/focus, never under reduced motion), with arrow buttons and dots. Without JavaScript every review renders as a readable list.

All four imported reviews are shown (visibleTestimonials no longer limits to three). The two rating-only records say they left a star rating without a written comment. Avatars show initials: the export holds no reviewer photos, and Google's Places terms don't permit downloading reviewer photos to self-host. Real photos can be added through the component's `avatar` field only with the customer's permission (or by embedding Google's own review widget). No extra testimonials are written to reach a target count.

`npm run test:testimonials` verifies exact review content, one featured card, arrow/dot navigation, auto-rotation (none under reduced motion), four widths without overflow and the no-JS list.

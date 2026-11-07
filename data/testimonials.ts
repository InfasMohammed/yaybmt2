export type Testimonial = {
  id: string;
  name: string;
  quote?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  date?: string;
  status: "sample" | "imported" | "approved";
  source?: { kind: "Google review"; reviewId: string; legacyUrl: string };
};

// Public Google-review cache recovered from the client-supplied WordPress export.
// Exact names/text/ratings are retained. Two records contain no written comment.
export const testimonials: Testimonial[] = [
  {
    id: "wordpress-google-review-2",
    name: "Mustafa Mithi",
    quote:
      "Best quality product and prices\nfor Marine Sanitary-ware , along with the best Brands like Daelim , Kopat  .",
    rating: 5,
    date: "2025-05-20",
    status: "imported",
    source: {
      kind: "Google review",
      reviewId: "ChZDSUhNMG9nS0VJQ0FnTUNZbE1qU2FREAE",
      legacyUrl: "https://yaybmt.com/",
    },
  },
  {
    id: "wordpress-google-review-4",
    name: "salman rangwala",
    quote: "Best price",
    rating: 4,
    date: "2025-05-20",
    status: "imported",
    source: {
      kind: "Google review",
      reviewId: "ChdDSUhNMG9nS0VNTzQ3cjc1X2ZmZ3VnRRAB",
      legacyUrl: "https://yaybmt.com/",
    },
  },
  {
    id: "wordpress-google-review-1",
    name: "Tasneem Mithi",
    rating: 5,
    date: "2025-05-20",
    status: "imported",
    source: {
      kind: "Google review",
      reviewId: "ChZDSUhNMG9nS0VKVGV4Y2JLelo2QU9nEAE",
      legacyUrl: "https://yaybmt.com/",
    },
  },
  {
    id: "wordpress-google-review-3",
    name: "Mohammed Mithi",
    rating: 5,
    date: "2025-05-20",
    status: "imported",
    source: {
      kind: "Google review",
      reviewId: "ChdDSUhNMG9nS0VNbl9yNy1NcTZtSDVnRRAB",
      legacyUrl: "https://yaybmt.com/",
    },
  },
];

export function visibleTestimonials(production: boolean) {
  return testimonials.filter(
    (item) => !production || item.status !== "sample",
  );
}

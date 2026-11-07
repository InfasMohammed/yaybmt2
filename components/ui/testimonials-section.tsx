import { visibleTestimonials } from "../../data/testimonials";
import { contacts } from "../../data/contacts";
import { TestimonialsSection as AnimatedTestimonials } from "./simple-animated-testimonials";
import "../../app/testimonials.css";

/** Homepage testimonials: the real Google reviews, shown in the animated testimonial carousel. */
export function TestimonialsSection() {
  const items = visibleTestimonials(process.env.YAYBMT_PRODUCTION === "true");
  if (!items.length) return null;
  const hasSamples = items.some((item) => item.status === "sample");
  return (
    <AnimatedTestimonials
      title="Real Results, Real Voices"
      subtitle={
        hasSamples
          ? "Design preview — sample content only, not real customer testimonials."
          : "Feedback shared by our customers on Google."
      }
      verifiedLabel={hasSamples ? "Sample" : "Google review"}
      testimonials={items.map((item) => ({
        id: item.id,
        name: item.name,
        role: "Customer",
        content: item.quote,
        rating: item.rating ?? 5,
        date: item.date,
      }))}
      footer={
        <a className="testimonials-source" href={contacts.maps}>
          Read reviews on Google <span aria-hidden="true">→</span>
        </a>
      }
    />
  );
}

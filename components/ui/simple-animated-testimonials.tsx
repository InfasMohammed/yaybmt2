"use client";

/*
 * Simple Animated Testimonials (supplied 21st.dev component), ported to this codebase:
 *  - shadcn Card/Button/Avatar/Separator replaced by plain elements styled in app/testimonials.css:
 *    the site's Tailwind is prefixed (`tw:`) with no Preflight and no shadcn theme tokens, so the
 *    original utility classes would render unstyled.
 *  - `framer-motion` → `motion/react` (same library, already installed); lucide icons → inline SVG.
 *  - Works without JavaScript (cards render as a readable list until hydrated), respects reduced
 *    motion (no auto-rotation or slide), pauses auto-rotation on hover/focus, and uses real
 *    <button>s for the dots.
 */

import { motion, useAnimation, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";

export interface Testimonial {
  id: string | number;
  name: string;
  role: string;
  company?: string;
  content?: string;
  rating: number;
  avatar?: string;
  date?: string;
}

export interface TestimonialsSectionProps {
  title?: string;
  subtitle?: string;
  testimonials?: Testimonial[];
  autoRotateInterval?: number;
  showVerifiedBadge?: boolean;
  verifiedLabel?: string;
  trustedCompanies?: string[];
  trustedCompaniesTitle?: string;
  footer?: React.ReactNode;
  className?: string;
}

/** Generic profile silhouette, used when a reviewer has no permitted photo. */
function DefaultAvatar() {
  return (
    <svg
      className="testimonial-avatar-icon"
      viewBox="0 0 64 64"
      width="100%"
      height="100%"
      aria-hidden="true"
    >
      <circle cx="32" cy="24" r="11" fill="currentColor" />
      <path
        d="M10 60c1.5-12.5 10.5-20 22-20s20.5 7.5 22 20Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Star() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        d="m12 2.6 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5L2.6 9.4l6.5-.9L12 2.6Z"
      />
    </svg>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function TestimonialsSection({
  title = "Loved by our customers",
  subtitle,
  testimonials = [],
  autoRotateInterval = 6000,
  showVerifiedBadge = true,
  verifiedLabel = "Verified customer",
  trustedCompanies = [],
  trustedCompaniesTitle = "Trusted by teams at these companies and more",
  footer,
  className,
}: TestimonialsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const controls = useAnimation();

  useEffect(() => setEnhanced(true), []);

  // Automatically cycle through testimonials (not under reduced motion or while paused).
  useEffect(() => {
    if (
      autoRotateInterval <= 0 ||
      testimonials.length <= 1 ||
      reduceMotion ||
      paused
    )
      return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, autoRotateInterval);
    return () => clearInterval(interval);
  }, [testimonials.length, autoRotateInterval, reduceMotion, paused]);

  // Trigger the staggered reveal when the section scrolls into view.
  useEffect(() => {
    if (isInView || reduceMotion) controls.start("visible");
  }, [isInView, reduceMotion, controls]);

  const handlePrev = () =>
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  const handleNext = () =>
    setActiveIndex((prev) => (prev + 1) % testimonials.length);

  if (testimonials.length === 0) return null;

  // Before hydration (or without JS) everything renders visible as a plain list.
  const initial = enhanced && !reduceMotion ? "hidden" : false;

  return (
    <section
      ref={sectionRef}
      className={cn(
        "testimonials-section",
        enhanced && "testimonials-enhanced",
        className,
      )}
      aria-labelledby="testimonials-heading"
    >
      <div className="testimonials-inner">
        <motion.div
          initial={initial}
          animate={controls}
          variants={containerVariants}
          className="testimonials-heading"
        >
          <motion.h2 variants={itemVariants} id="testimonials-heading">
            {title}
          </motion.h2>
          {subtitle && <motion.p variants={itemVariants}>{subtitle}</motion.p>}
        </motion.div>

        <motion.div
          initial={initial}
          animate={controls}
          variants={containerVariants}
          className="testimonials-stage"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <motion.div variants={itemVariants} className="testimonials-track">
            <svg
              className="testimonials-quote"
              viewBox="0 0 24 24"
              width="56"
              height="56"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              aria-hidden="true"
            >
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
            </svg>
            <div
              className="testimonials-cards"
              aria-live={enhanced && !paused ? "off" : "polite"}
            >
              {testimonials.map((testimonial, index) => (
                <figure
                  key={testimonial.id}
                  className={cn(
                    "testimonial-card",
                    index === activeIndex && "is-active",
                  )}
                  aria-hidden={enhanced && index !== activeIndex}
                >
                  <div className="testimonial-top">
                    <figcaption className="testimonial-person">
                      <span className="testimonial-avatar" aria-hidden="true">
                        {testimonial.avatar ? (
                          <img src={testimonial.avatar} alt="" />
                        ) : (
                          <DefaultAvatar />
                        )}
                      </span>
                      <span className="testimonial-person-copy">
                        <strong>{testimonial.name}</strong>
                        <span>
                          {testimonial.role}
                          {testimonial.company && ", " + testimonial.company}
                          {testimonial.date && (
                            <>
                              {" · "}
                              <time dateTime={testimonial.date}>
                                {new Date(
                                  testimonial.date + "T00:00:00Z",
                                ).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  timeZone: "UTC",
                                })}
                              </time>
                            </>
                          )}
                        </span>
                      </span>
                    </figcaption>
                    <span
                      className="testimonial-stars"
                      role="img"
                      aria-label={`${testimonial.rating} out of 5 stars`}
                    >
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          key={i}
                          className={i < testimonial.rating ? "is-on" : ""}
                        >
                          <Star />
                        </span>
                      ))}
                    </span>
                  </div>
                  <hr className="testimonial-separator" />
                  {testimonial.content ? (
                    <blockquote className="testimonial-content">
                      <p>{testimonial.content}</p>
                    </blockquote>
                  ) : (
                    <p className="testimonial-content testimonial-rating-only">
                      Left a {testimonial.rating}-star rating without a written
                      comment.
                    </p>
                  )}
                  {showVerifiedBadge && (
                    <p className="testimonial-verified">
                      <svg
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      {verifiedLabel}
                    </p>
                  )}
                </figure>
              ))}
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div variants={itemVariants} className="testimonials-nav">
            <button
              type="button"
              className="testimonials-arrow"
              onClick={handlePrev}
              aria-label="Previous testimonial"
            >
              <Chevron direction="left" />
            </button>
            <div className="testimonials-dots">
              {testimonials.map((t, index) => (
                <button
                  type="button"
                  key={t.id}
                  className={cn(
                    "testimonials-dot",
                    index === activeIndex && "is-active",
                  )}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                />
              ))}
            </div>
            <button
              type="button"
              className="testimonials-arrow"
              onClick={handleNext}
              aria-label="Next testimonial"
            >
              <Chevron direction="right" />
            </button>
          </motion.div>
        </motion.div>

        {trustedCompanies.length > 0 && (
          <div className="testimonials-trusted">
            <h3>{trustedCompaniesTitle}</h3>
            <div>
              {trustedCompanies.map((company) => (
                <span key={company}>{company}</span>
              ))}
            </div>
          </div>
        )}
        {footer}
      </div>
    </section>
  );
}

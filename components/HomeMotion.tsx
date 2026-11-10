"use client";

import { useEffect } from "react";

/** One-time homepage reveals (fade, 12px rise, scale, de-blur, staggered) with no-motion fallbacks. */
export default function HomeMotion() {
  useEffect(() => {
    if (
      !("IntersectionObserver" in window) ||
      !("animate" in Element.prototype)
    )
      return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 901px)");
    const elements = [
      ...document.querySelectorAll<HTMLElement>(
        ".home-page [data-home-reveal], .home-page .hero-intro > *, .home-page .hero-industry-links > *, .home-page .industry-scroll-copy, .home-page [data-home-reveal-image], .home-page .testimonials-heading, body:has(.home-page) > header > *, body:has(.home-page) > footer > *",
      ),
    ];
    const played = new WeakSet<HTMLElement>();
    const hidden = new Map<HTMLElement, { value: string; priority: string }>();
    const animations = new Set<Animation>();
    const restore = (element: HTMLElement) => {
      const original = hidden.get(element);
      if (!original) return;
      if (original.value)
        element.style.setProperty("opacity", original.value, original.priority);
      else element.style.removeProperty("opacity");
      hidden.delete(element);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          const element = entry.target as HTMLElement;
          if (!entry.isIntersecting || preference.matches) return;
          observer.unobserve(element);
          if (played.has(element)) {
            restore(element);
            return;
          }
          played.add(element);
          element.dataset.homeDrop = "played";
          // Header, footer, hero and the near-the-fold top products get a plain fade-rise (cheaper at load).
          const chrome = !!element.closest("header, footer, .hero, .home-top-products");
          const animation = element.animate(
            chrome
              ? [
                  { opacity: 0, translate: "0 12px" },
                  { opacity: 1, translate: "0 0" },
                ]
              : [
                  {
                    opacity: 0,
                    translate: "0 12px",
                    scale: "0.98",
                    filter: "blur(8px)",
                  },
                  {
                    opacity: 1,
                    translate: "0 0",
                    scale: "1",
                    filter: "blur(0)",
                  },
                ],
            {
              duration: 620,
              delay: Math.min(index * 70, 280),
              fill: "both",
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            },
          );
          restore(element);
          animations.add(animation);
          animation.onfinish = () => {
            animation.cancel();
            animations.delete(animation);
          };
          animation.oncancel = () => animations.delete(animation);
        });
      },
      { threshold: 0.12 },
    );
    const update = () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
      [...hidden.keys()].forEach(restore);
      if (preference.matches) return;
      elements.forEach((element) => {
        // Desktop industry images have their own active-step drop, preserving crossfades.
        if (
          played.has(element) ||
          (element.hasAttribute("data-home-reveal-image") && desktop.matches)
        )
          return;
        hidden.set(element, {
          value: element.style.getPropertyValue("opacity"),
          priority: element.style.getPropertyPriority("opacity"),
        });
        element.style.setProperty("opacity", "0");
        observer.observe(element);
      });
    };
    const revealFocused = (event: FocusEvent) => {
      if (!(event.target instanceof Node)) return;
      elements
        .filter((element) => element.contains(event.target as Node))
        .forEach((element) => {
          restore(element);
          observer.unobserve(element);
          played.add(element);
          element.getAnimations().forEach((animation) => animation.cancel());
        });
    };
    update();
    preference.addEventListener("change", update);
    desktop.addEventListener("change", update);
    document.addEventListener("focusin", revealFocused);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", update);
      desktop.removeEventListener("change", update);
      document.removeEventListener("focusin", revealFocused);
      animations.forEach((animation) => animation.cancel());
      [...hidden.keys()].forEach(restore);
    };
  }, []);
  return null;
}

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** One-time soft reveal: fade, 12px rise, slight scale and de-blur, staggered; no bounce or scrubbing. */
export default function PageScrollAnimation() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("main");
    if (!root || root.classList.contains("home-page")) return;
    if (
      !("IntersectionObserver" in window) ||
      !("animate" in Element.prototype)
    )
      return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cards =
      ".card, .logo-cloud-shell, .logo-cloud-card, .company-value-card, .about-intro-lead, .about-intro-point, .page-hero-copy, .page-hero-aside, .product-panel, .product-cta, .leadership-card, .directory > a, .showroom-expandable-photo, .gallery-photo, [data-page-reveal], .contact-intro-card, .contact-detail-card, .contact-panel";
    const elements: HTMLElement[] = [];
    const tracked = new WeakSet<HTMLElement>();
    const candidates = () =>
      [...root.querySelectorAll<HTMLElement>(`h1,h2,img,${cards}`)].filter(
        (element) => {
          if (element.closest("dialog,.gallery-thumbnails,.showroom-viewer"))
            return false;
          if (element.parentElement?.closest(cards)) return false;
          if (element.classList.contains("sr-only")) return false;
          return true;
        },
      );
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
          element.dataset.pageDrop = "played";
          const animation = element.animate(
            [
              {
                opacity: 0,
                translate: "0 12px",
                scale: "0.985",
                filter: "blur(6px)",
              },
              { opacity: 1, translate: "0 0", scale: "1", filter: "blur(0)" },
            ],
            {
              duration: 520,
              delay: Math.min(index * 40, 120),
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
        if (played.has(element)) return;
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
    const discover = () => {
      candidates().forEach((element) => {
        if (tracked.has(element)) return;
        tracked.add(element);
        elements.push(element);
        element.dataset.pageDrop = "pending";
        if (preference.matches) return;
        hidden.set(element, {
          value: element.style.getPropertyValue("opacity"),
          priority: element.style.getPropertyPriority("opacity"),
        });
        element.style.setProperty("opacity", "0");
        observer.observe(element);
      });
    };
    discover();
    const mutations = new MutationObserver(discover);
    mutations.observe(root, { childList: true, subtree: true });
    preference.addEventListener("change", update);

    document.addEventListener("focusin", revealFocused);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", update);
      mutations.disconnect();
      document.removeEventListener("focusin", revealFocused);
      animations.forEach((animation) => animation.cancel());
      [...hidden.keys()].forEach(restore);
    };
  }, [pathname]);
  return null;
}

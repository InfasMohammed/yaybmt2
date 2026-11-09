"use client";

import NavMenu, { MenuHoverLabel } from "./ui/menu-hover-effects";

import { useEffect, useRef, useState } from "react";

type NavigationItem = { slug: string; name: string };

export default function HeaderMenu({
  categories,
  brands,
}: {
  categories: NavigationItem[];
  brands: NavigationItem[];
}) {
  const navigation = useRef<HTMLDivElement>(null);
  const mobileMenu = useRef<HTMLDetailsElement>(null);
  const [view, setView] = useState<"main" | "products" | "brands">("main");
  const [enhanced, setEnhanced] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const previousView = useRef(view);
  const backButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setEnhanced(true);
  }, []);
  useEffect(() => {
    if (previousView.current !== view && mobileMenu.current?.open) {
      if (view === "main") {
        mobileMenu.current
          .querySelector<HTMLAnchorElement>(
            `[data-mobile-view="${previousView.current}"]`,
          )
          ?.focus();
      } else backButton.current?.focus();
    }
    previousView.current = view;
  }, [view]);
  useEffect(() => {
    if (!mobileOpen || !window.matchMedia("(max-width: 650px)").matches) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const media = window.matchMedia("(max-width: 650px)");
    const resize = () => {
      if (!media.matches && mobileMenu.current) mobileMenu.current.open = false;
    };
    media.addEventListener("change", resize);
    return () => {
      document.body.style.overflow = previous;
      media.removeEventListener("change", resize);
    };
  }, [mobileOpen]);
  function closeMobile() {
    if (!mobileMenu.current) return;
    mobileMenu.current.open = false;
    mobileMenu.current.querySelector("summary")?.focus();
    setView("main");
  }
  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) return;
      navigation.current
        ?.querySelectorAll<HTMLDetailsElement>(".nav-dropdown[open]")
        .forEach((dropdown) => {
          if (!dropdown.contains(event.target as Node)) dropdown.open = false;
        });
      if (
        mobileMenu.current?.open &&
        !mobileMenu.current.contains(event.target)
      ) {
        mobileMenu.current.open = false;
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);

  function dropdown(
    label: string,
    path: string,
    entries: NavigationItem[],
    prefix: string,
  ) {
    return (
      <details
        className="nav-dropdown"
        name="primary-navigation"
        onToggle={(event) => {
          if (!event.currentTarget.open) {
            delete event.currentTarget.dataset.hoverOpened;
            return;
          }
          const current = event.currentTarget;
          navigation.current
            ?.querySelectorAll<HTMLDetailsElement>(".nav-dropdown[open]")
            .forEach((other) => {
              if (other !== current) other.open = false;
            });
        }}
        onPointerEnter={(event) => {
          if (
            event.pointerType === "mouse" &&
            window.matchMedia(
              "(min-width: 651px) and (hover: hover) and (pointer: fine)",
            ).matches
          ) {
            if (!event.currentTarget.open) {
              event.currentTarget.dataset.hoverOpened = "true";
              event.currentTarget.open = true;
            }
          }
        }}
        onPointerLeave={(event) => {
          if (
            event.pointerType === "mouse" &&
            !event.currentTarget.contains(document.activeElement)
          ) {
            delete event.currentTarget.dataset.hoverOpened;
            event.currentTarget.open = false;
          }
        }}
      >
        <summary
          aria-label={label}
          onClick={(event) => {
            const element = event.currentTarget
              .parentElement as HTMLDetailsElement;
            if (element.dataset.hoverOpened === "true") {
              delete element.dataset.hoverOpened;
              event.preventDefault();
            }
          }}
        >
          <MenuHoverLabel>
            {label}
            <span className="nav-chevron" aria-hidden="true">
              ⌄
            </span>
          </MenuHoverLabel>
        </summary>
        <div className="nav-dropdown-links">
          <a
            className="nav-view-all"
            href={path}
            aria-label={`All ${label.toLowerCase()}`}
          >
            <MenuHoverLabel>All {label.toLowerCase()}</MenuHoverLabel>
          </a>
          {path === "/shop/" && (
            <a
              className="nav-top-products"
              href="/top-products/"
              aria-label="Top products"
            >
              <MenuHoverLabel>Top products</MenuHoverLabel>
            </a>
          )}
          {entries.map((entry) => (
            <a
              href={prefix + entry.slug + "/"}
              aria-label={entry.name}
              key={entry.slug}
            >
              <MenuHoverLabel>{entry.name}</MenuHoverLabel>
            </a>
          ))}
        </div>
      </details>
    );
  }

  function links() {
    return (
      <>
        <a href="/" aria-label="Home">
          <MenuHoverLabel>Home</MenuHoverLabel>
        </a>
        {dropdown("Products", "/shop/", categories, "/product-category/")}
        {dropdown("Brands", "/brands/", brands, "/brand/")}
        <a href="/about-us/" aria-label="Company">
          <MenuHoverLabel>Company</MenuHoverLabel>
        </a>
        <a href="/contact-us/" aria-label="Contact">
          <MenuHoverLabel>Contact</MenuHoverLabel>
        </a>
      </>
    );
  }

  return (
    <div
      ref={navigation}
      className="header-navigation"
      onClick={(event) => {
        if (
          !event.defaultPrevented &&
          event.target instanceof Element &&
          event.target.closest("a") &&
          mobileMenu.current
        ) {
          mobileMenu.current.open = false;
        }
      }}
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        if (mobileMenu.current?.open) {
          if (view !== "main") setView("main");
          else closeMobile();
          event.preventDefault();
          return;
        }
        const open =
          navigation.current?.querySelector<HTMLDetailsElement>(
            ".nav-dropdown[open]",
          ) || (mobileMenu.current?.open ? mobileMenu.current : null);
        if (open) {
          open.open = false;
          open.querySelector("summary")?.focus();
          event.preventDefault();
        }
      }}
    >
      <NavMenu
        className="primary-navigation desktop-navigation"
        aria-label="Main navigation"
      >
        {links()}
      </NavMenu>
      <details
        className="mobile-navigation"
        ref={mobileMenu}
        data-enhanced={enhanced || undefined}
        onToggle={(event) => {
          setMobileOpen(event.currentTarget.open);
          if (!event.currentTarget.open) setView("main");
        }}
      >
        <summary aria-label="Menu">
          <svg
            aria-hidden="true"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path className="menu-toggle-line" d="M3 6h18" />
            <path className="menu-toggle-line" d="M3 12h18" />
            <path className="menu-toggle-line" d="M3 18h18" />
          </svg>
        </summary>
        <NavMenu
          className="primary-navigation mobile-menu-panel"
          aria-label="Main navigation"
        >
          <div className="mobile-menu-heading">
            {view !== "main" ? (
              <button
                type="button"
                ref={backButton}
                onClick={() => setView("main")}
              >
                ‹ Back
              </button>
            ) : (
              <span>Menu</span>
            )}
            {enhanced && view === "main" && (
              <button
                type="button"
                aria-label="Close menu"
                onClick={closeMobile}
              >
                Close <span aria-hidden="true">×</span>
              </button>
            )}
          </div>
          <div className="mobile-menu-items" key={view}>
            {view === "main" ? (
              <>
                <a href="/" aria-label="Home">
                  <MenuHoverLabel>Home</MenuHoverLabel>
                </a>
                <a
                  href="/shop/"
                  aria-label="Products"
                  data-mobile-view="products"
                  onClick={(event) => {
                    event.preventDefault();
                    setView("products");
                  }}
                >
                  <MenuHoverLabel>
                    Products <span aria-hidden="true">›</span>
                  </MenuHoverLabel>
                </a>
                <a
                  href="/brands/"
                  aria-label="Brands"
                  data-mobile-view="brands"
                  onClick={(event) => {
                    event.preventDefault();
                    setView("brands");
                  }}
                >
                  <MenuHoverLabel>
                    Brands <span aria-hidden="true">›</span>
                  </MenuHoverLabel>
                </a>
                <a href="/about-us/" aria-label="Company">
                  <MenuHoverLabel>Company</MenuHoverLabel>
                </a>
                <a href="/contact-us/" aria-label="Contact">
                  <MenuHoverLabel>Contact</MenuHoverLabel>
                </a>
              </>
            ) : (
              <>
                {view === "products" && (
                  <a
                    href="/top-products/"
                    aria-label="Top products"
                    className="nav-top-products"
                  >
                    <MenuHoverLabel>Top products</MenuHoverLabel>
                  </a>
                )}
                {(view === "products" ? categories : brands).map((entry) => (
                  <a
                    key={entry.slug}
                    aria-label={entry.name}
                    href={
                      (view === "products" ? "/product-category/" : "/brand/") +
                      entry.slug +
                      "/"
                    }
                  >
                    <MenuHoverLabel>{entry.name}</MenuHoverLabel>
                  </a>
                ))}
              </>
            )}
          </div>
        </NavMenu>
      </details>
    </div>
  );
}

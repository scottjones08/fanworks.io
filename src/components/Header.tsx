import { useEffect, useRef, useState } from "react";
import { navItems, scrollToId } from "../content";

type HeaderProps = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean | ((open: boolean) => boolean)) => void;
};

export function Header({ menuOpen, setMenuOpen }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const chromeRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const sync = () => {
      setScrolled(window.scrollY > 40);
      const isNarrow = window.innerWidth < 720;
      setNarrow(isNarrow);
      if (!isNarrow) setMenuOpen(false);
    };
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [setMenuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const root = chromeRef.current;
    const previous = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const focusables = () =>
      root ? Array.from(root.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]")) : [];

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    requestAnimationFrame(() => {
      focusables()
        .find((item) => item !== toggleRef.current)
        ?.focus();
    });

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previous?.focus();
    };
  }, [menuOpen, setMenuOpen]);

  const go = (id: string) => {
    setMenuOpen(false);
    scrollToId(id);
  };

  return (
    <div className="site-chrome" ref={chromeRef}>
      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <button className="brand-lockup" type="button" onClick={() => go("top")} aria-label="FanWorks home">
          <span className="wordmark">FANWORKS</span>
          {!narrow && !scrolled ? (
            <span className="brand-subtitle">Business systems consulting</span>
          ) : null}
        </button>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button type="button" key={item.id} onClick={() => go(item.id)}>
              {item.label}
            </button>
          ))}
          <button className="nav-cta" type="button" onClick={() => go("engage")}>
            Contact
          </button>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "×" : "≡"}
        </button>
      </header>

      {menuOpen ? (
        <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <button type="button" key={item.id} onClick={() => go(item.id)}>
              {item.label}
            </button>
          ))}
          <button type="button" className="mobile-nav-cta" onClick={() => go("engage")}>
            Contact
          </button>
        </nav>
      ) : null}
    </div>
  );
}

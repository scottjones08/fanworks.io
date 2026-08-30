import { List, X } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { navItems, scrollToId } from "../content";
import { Lockup } from "./Logo";

type HeaderProps = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean | ((open: boolean) => boolean)) => void;
};

export function Header({ menuOpen, setMenuOpen }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const sync = () => {
      setScrolled(window.scrollY > 28);
      if (window.innerWidth >= 800) setMenuOpen(false);
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
    const previous = document.activeElement as HTMLElement | null;
    const root = rootRef.current;
    document.body.style.overflow = "hidden";

    const focusables = () => {
      if (!root) return [];
      const menuItems = Array.from(root.querySelectorAll<HTMLElement>(".mobile-nav button:not([disabled])"));
      return toggleRef.current ? [...menuItems, toggleRef.current] : menuItems;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      const first = items[0];
      const last = items.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    requestAnimationFrame(() => focusables()[0]?.focus());
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previous?.focus();
    };
  }, [menuOpen, setMenuOpen]);

  const go = (id: string) => {
    setMenuOpen(false);
    scrollToId(id);
  };

  return (
    <div className="site-chrome" ref={rootRef}>
      <motion.header
        className={`site-header${scrolled ? " is-scrolled" : ""}`}
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <button className="brand-lockup" type="button" onClick={() => go("top")} aria-label="fanworks home">
          <Lockup />
        </button>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button type="button" key={item.id} onClick={() => go(item.id)}>
              {item.label}
            </button>
          ))}
          <button className="nav-contact" type="button" onClick={() => go("engage")}>
            Start a conversation
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
          {menuOpen ? <X size={20} weight="bold" /> : <List size={22} weight="bold" />}
        </button>
      </motion.header>

      {menuOpen ? (
        <motion.nav
          id="mobile-navigation"
          className="mobile-nav"
          aria-label="Mobile navigation"
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
        >
          <span className="mobile-nav-label">Navigate the work</span>
          {navItems.map((item, index) => (
            <button type="button" key={item.id} onClick={() => go(item.id)}>
              <span>0{index + 1}</span>
              {item.label}
            </button>
          ))}
          <button type="button" className="mobile-nav-cta" onClick={() => go("engage")}>
            Start a conversation
          </button>
        </motion.nav>
      ) : null}
    </div>
  );
}

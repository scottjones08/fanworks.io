import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { navItems, scrollToId } from "../content";
import { easeOut, useMotionConfig } from "../motion";

type HeaderProps = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean | ((open: boolean) => boolean)) => void;
};

export function Header({ menuOpen, setMenuOpen }: HeaderProps) {
  const { reduced, spring } = useMotionConfig();
  const [dense, setDense] = useState(false);
  const chromeRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setDense(window.scrollY > 36);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const root = chromeRef.current;
    const previous = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const focusables = () => {
      if (!root) return [] as HTMLElement[];
      return Array.from(root.querySelectorAll<HTMLElement>("button:not([disabled])"));
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
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
      const items = focusables();
      items.find((item) => item !== toggleRef.current)?.focus();
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
      <header className={`site-header${dense || menuOpen ? " is-dense" : ""}`}>
        <button className="brand-lockup" type="button" onClick={() => go("top")} aria-label="FanWorks home">
          <span className="wordmark">FANWORKS</span>
          <span className="brand-subtitle">Business systems consulting</span>
        </button>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button type="button" key={item.id} onClick={() => go(item.id)}>
              {item.label}
            </button>
          ))}
          <motion.button
            className="nav-cta"
            type="button"
            onClick={() => go("engage")}
            whileHover={reduced ? undefined : { scale: 1.04 }}
            whileTap={reduced ? undefined : { scale: 0.97 }}
            transition={spring}
          >
            Contact
          </motion.button>
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
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.nav
            id="mobile-navigation"
            className="mobile-nav"
            aria-label="Mobile navigation"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.32, ease: easeOut }}
          >
            {navItems.map((item, index) => (
              <motion.button
                type="button"
                key={item.id}
                onClick={() => go(item.id)}
                initial={reduced ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : 0.06 * index, ease: easeOut }}
              >
                {item.label}
              </motion.button>
            ))}
            <motion.button
              type="button"
              className="mobile-nav-cta"
              onClick={() => go("engage")}
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : 0.24, ease: easeOut }}
            >
              Contact
            </motion.button>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

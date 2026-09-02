import { useEffect, useState } from "react";
import { concepts, type ConceptSlug } from "./concepts";

/** Review-only floating control to hop between the three directions. */
export function ConceptSwitcher({ current }: { current: ConceptSlug | "current" }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  const active = concepts.find((c) => c.slug === current);
  return (
    <div className={`concept-switcher${open ? " is-open" : ""}`}>
      {open ? (
        <nav className="concept-switcher-menu" aria-label="Switch design concept">
          {concepts.map((c) => (
            <a key={c.slug} href={`/${c.slug}`} aria-current={c.slug === current ? "page" : undefined}>
              <span className="concept-switcher-swatch" aria-hidden="true">
                {c.palette.map((p) => (
                  <i key={p} style={{ background: p }} />
                ))}
              </span>
              <span>
                <b>
                  {c.number} · {c.name}
                </b>
                <small>{c.thesis}</small>
              </span>
            </a>
          ))}
          <a href="/current">
            <span className="concept-switcher-swatch" aria-hidden="true">
              <i style={{ background: "#100f0d" }} />
              <i style={{ background: "#d7a238" }} />
              <i style={{ background: "#f1ede3" }} />
            </span>
            <span>
              <b>Current site</b>
              <small>The live design, for comparison.</small>
            </span>
          </a>
          <a href="/" className="concept-switcher-home">
            All three side by side
          </a>
        </nav>
      ) : null}
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-haspopup="menu">
        <span className="concept-switcher-dot" aria-hidden="true" />
        {active ? `Concept ${active.number} · ${active.name}` : "Current site"}
        <span aria-hidden="true">{open ? "×" : "⇄"}</span>
      </button>
    </div>
  );
}

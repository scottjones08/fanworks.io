import { useEffect, useRef, useState } from "react";
import { dayCards } from "../content";
import { useReducedMotion } from "../hooks/useReducedMotion";

function CardGlyph({ name }: { name: string }) {
  if (name === "screens") {
    return (
      <svg viewBox="0 0 120 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="4" y="10" width="34" height="24" rx="2" />
        <rect x="26" y="22" width="34" height="24" rx="2" />
        <rect x="48" y="8" width="34" height="24" rx="2" />
        <rect x="88" y="18" width="28" height="34" rx="2" strokeDasharray="3 4" />
      </svg>
    );
  }
  if (name === "copy") {
    return (
      <svg viewBox="0 0 120 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <rect x="6" y="12" width="26" height="34" rx="2" />
        <rect x="48" y="12" width="26" height="34" rx="2" />
        <rect x="90" y="12" width="26" height="34" rx="2" />
        <path d="M36 29h8M78 29h8" />
      </svg>
    );
  }
  if (name === "inbox") {
    return (
      <svg viewBox="0 0 120 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <rect x="6" y="8" width="22" height="16" rx="2" />
        <rect x="48" y="4" width="22" height="16" rx="2" />
        <rect x="30" y="34" width="22" height="16" rx="2" />
        <rect x="76" y="30" width="22" height="16" rx="2" />
        <path d="M30 18c6 4 10 10 8 14M70 14c-6 6-14 14-16 22" strokeDasharray="2 4" />
      </svg>
    );
  }
  if (name === "list") {
    return (
      <svg viewBox="0 0 120 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <path d="M8 32h18M26 32c10 0 8-22 20-22M26 32c10 0 8 22 20 22" strokeDasharray="3 4" />
        <rect x="78" y="18" width="30" height="30" rx="2" />
        <path d="M100 42l4 4 8-9" />
      </svg>
    );
  }
  if (name === "dock") {
    return (
      <svg viewBox="0 0 120 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <path d="M6 46h56V22H6zM62 30h16l8 8v8h-24z" />
        <circle cx="20" cy="50" r="4" />
        <circle cx="72" cy="50" r="4" />
        <rect x="94" y="8" width="22" height="22" rx="2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <path d="M8 52V30M24 52V18M40 52V38M56 52V10M4 56h58" />
      <circle cx="8" cy="30" r="2.4" fill="currentColor" />
      <circle cx="24" cy="18" r="2.4" fill="currentColor" />
      <circle cx="40" cy="38" r="2.4" fill="currentColor" />
      <circle cx="56" cy="10" r="2.4" fill="currentColor" />
    </svg>
  );
}

export function Ledger() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const update = () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;
      if (reduced) {
        track.style.transform = "";
        setProgress(1);
        setActive(dayCards.length - 1);
        return;
      }
      const distance = Math.max(1, section.offsetHeight - window.innerHeight);
      const raw = Math.min(1, Math.max(0, (window.scrollY - section.offsetTop) / distance));
      const eased = raw < 0.5 ? 2 * raw * raw : 1 - (-2 * raw + 2) ** 2 / 2;
      const max = Math.max(0, track.scrollWidth - window.innerWidth);
      track.style.transform = `translate3d(${-eased * max}px,0,0)`;
      setProgress(raw);
      setActive(Math.min(dayCards.length - 1, Math.floor(raw * dayCards.length)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [reduced]);

  return (
    <section className={`ledger${reduced ? " is-static" : ""}`} id="ledger" ref={sectionRef} aria-label="A day on the floor">
      <div className="ledger-stage">
        <span className="ledger-ghost" aria-hidden="true">
          {dayCards[active].time}
        </span>
        <div className="ledger-top">
          <div className="section-kicker kicker-dark">
            <i />
            01 · A day on the floor
          </div>
          <span>Scroll ⟶</span>
        </div>
        <h2>The same day, run twice.</h2>

        <div className="ledger-track" ref={trackRef}>
          {dayCards.map((card, index) => (
            <article
              key={card.stamp}
              className={`ledger-card${"finale" in card && card.finale ? " is-finale" : ""}${active === index ? " is-active" : ""}`}
            >
              <div>
                <span>{card.stamp}</span>
                <span>{card.index}</span>
              </div>
              <CardGlyph name={card.icon} />
              <p>{card.before}</p>
              <div className="ledger-rule" aria-hidden="true">
                <b />
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 12h14M13 6l6 6-6 6" />
                </svg>
              </div>
              <h3>{card.after}</h3>
            </article>
          ))}
        </div>

        <div className="ledger-rail" aria-hidden="true">
          <div>
            <i style={{ width: `${progress * 100}%` }} />
            {dayCards.map((card, index) => (
              <span
                key={card.time}
                className={index <= active && progress > 0.01 ? "is-on" : ""}
                style={{ left: `${(index / (dayCards.length - 1)) * 100}%` }}
              />
            ))}
          </div>
          <div>
            <span>7 AM</span>
            <span>6 PM</span>
          </div>
        </div>
      </div>
    </section>
  );
}

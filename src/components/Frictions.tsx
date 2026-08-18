import { useState } from "react";
import { frictions } from "../content";
import { useReveal } from "../hooks/useReveal";

function FrictionIcon({ name }: { name: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round" as const,
    "aria-hidden": true,
  };
  if (name === "unlink") {
    return (
      <svg {...common}>
        <path d="M9 7H6a3.5 3.5 0 0 0 0 7h2" />
        <path d="M15 17h3a3.5 3.5 0 0 0 0-7h-2" />
        <path d="M5 20 19 4" />
      </svg>
    );
  }
  if (name === "manual") {
    return (
      <svg {...common} strokeLinejoin="round">
        <path d="M4 8h13l-3.2-3.2" />
        <path d="M20 16H7l3.2 3.2" />
      </svg>
    );
  }
  if (name === "tag") {
    return (
      <svg {...common} strokeLinejoin="round">
        <path d="M12 3h6a2 2 0 0 1 2 2v6l-8.5 8.5a2 2 0 0 1-2.8 0L4 14.8a2 2 0 0 1 0-2.8L12 3z" />
        <circle cx="16" cy="8" r="1.3" />
      </svg>
    );
  }
  if (name === "fork") {
    return (
      <svg {...common}>
        <path d="M3 12h4c3 0 3-6 6-6h8" />
        <path d="M3 12h4c3 0 3 6 6 6h8" />
        <path d="M13 12h8" opacity="0.45" />
      </svg>
    );
  }
  return (
    <svg {...common} strokeLinejoin="round">
      <path d="M3 12c2.2-3.8 5.2-6 9-6s6.8 2.2 9 6c-2.2 3.8-5.2 6-9 6s-6.8-2.2-9-6z" />
      <circle cx="12" cy="12" r="2.4" />
      <path d="M5 20 19 4" />
    </svg>
  );
}

function FrictionRow({
  item,
  onEnter,
}: {
  item: (typeof frictions)[number];
  onEnter: () => void;
}) {
  const rowRef = useReveal<HTMLElement>();

  return (
    <article
      ref={rowRef}
      className="friction-row reveal"
      onMouseEnter={onEnter}
    >
      <span>{item.number}</span>
      <div>
        <h3>{item.name}</h3>
        <p>{item.line}</p>
      </div>
      <FrictionIcon name={item.icon} />
    </article>
  );
}

export function Frictions() {
  const headRef = useReveal<HTMLDivElement>();
  const [ghost, setGhost] = useState("05");

  return (
    <section className="frictions" id="frictions" aria-labelledby="frictions-title">
      <span className="friction-ghost" aria-hidden="true">
        {ghost}
      </span>
      <div className="reveal" ref={headRef}>
        <div className="section-kicker">
          <i />
          03 · What we remove
        </div>
        <div className="split-head">
          <h2 id="frictions-title">Five frictions.</h2>
          <p>Every operation we walk into is fighting some mix of the same five. We find yours, rank them by drag, and take them out one at a time.</p>
        </div>
      </div>

      <div className="friction-list">
        {frictions.map((item) => (
          <FrictionRow
            key={item.number}
            item={item}
            onEnter={() => setGhost(item.number)}
          />
        ))}
      </div>
    </section>
  );
}

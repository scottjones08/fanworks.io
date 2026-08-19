import { practices } from "../content";
import { useReveal } from "../hooks/useReveal";

const proof = [
  { lead: "20+", label: "Years improving operations" },
  { lead: "Operator-led", label: "Executives & entrepreneurs — startup to Fortune 500" },
  { lead: "People first", label: "AI and automation only where they make the work better" },
] as const;

function PracticeIcon({ name }: { name: string }) {
  const common = {
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (name === "health") {
    return (
      <svg {...common}>
        <path d="M6 24h9l4-10 6 20 4-10h13" />
      </svg>
    );
  }
  if (name === "wealth") {
    return (
      <svg {...common}>
        <path d="M8 40V22M20 40V10M32 40V28M44 40V16M4 44h40" />
        <path d="M8 18 20 6l12 18 12-14" />
      </svg>
    );
  }
  if (name === "plant") {
    return (
      <svg {...common}>
        <path d="M6 42V18l10 6V18l10 6V12l16 8v22z" />
        <path d="M14 34h4M24 34h4M34 34h4" />
      </svg>
    );
  }
  if (name === "bag") {
    return (
      <svg {...common}>
        <path d="M8 16h32l-3 26H11z" />
        <path d="M17 22v-8a7 7 0 0 1 14 0v8" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M24 8v32M12 40h24" />
      <path d="M24 12 10 18l-6 12h12l-6-12M24 12l14 6 6 12H32l6-12" />
    </svg>
  );
}

export function Practices() {
  const headRef = useReveal<HTMLDivElement>();
  const proofRef = useReveal<HTMLUListElement>();
  const gridRef = useReveal<HTMLDivElement>();

  return (
    <section className="practices" id="practices" aria-labelledby="practices-title">
      <div className="reveal" ref={headRef}>
        <div className="section-kicker kicker-dark">
          <i />
          04 · People & practice areas
        </div>
        <div className="split-head">
          <h2 id="practices-title">Built around your people.</h2>
          <p>
            Your systems should support how your people actually work — not make them work around
            the systems. We sit with the teams doing the work, rebuild what runs underneath them,
            and train in the style that fits the staff, so the new line is used from the first
            week, not the first quarter.
          </p>
        </div>
      </div>

      <ul className="practice-proof reveal" ref={proofRef} aria-label="Who runs the work">
        {proof.map((item) => (
          <li key={item.lead}>
            <strong>{item.lead}</strong>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>

      <div className="practice-grid-head reveal" ref={gridRef}>
        <h3>Where we've run it</h3>
        <p>Different industries, same frictions. The tools change; the line of work — intake to invoice — doesn't.</p>
      </div>

      <div className="practice-grid">
        {practices.map((item) => (
          <article key={item.name} className="practice-card">
            <PracticeIcon name={item.icon} />
            <h3>{item.name}</h3>
            <p>{item.line}</p>
            <em>{item.tags}</em>
          </article>
        ))}
      </div>
    </section>
  );
}

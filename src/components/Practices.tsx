import { practices } from "../content";
import { useReveal } from "../hooks/useReveal";

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

  return (
    <section className="practices" id="practices" aria-labelledby="practices-title">
      <div className="reveal" ref={headRef}>
        <div className="section-kicker kicker-dark">
          <i />
          05 · Practice areas
        </div>
        <div className="split-head">
          <h2 id="practices-title">Where we've run it.</h2>
          <p>Different industries, same frictions. The tools change; the line of work — intake to invoice — doesn't.</p>
        </div>
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

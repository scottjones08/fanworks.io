import { useReveal } from "../hooks/useReveal";

const points = [
  {
    number: "01",
    title: "Sit with the work",
    body: "We watch the real day: the handoffs, decisions, and workarounds a process map never shows.",
  },
  {
    number: "02",
    title: "AI only where it helps",
    body: "Automation earns its place. If it doesn't make the work better, it doesn't go in.",
  },
  {
    number: "03",
    title: "Train the way they learn",
    body: "The training fits the staff, not a generic playbook — so the new line is used from week one.",
  },
] as const;

function AroundMark() {
  return (
    <svg viewBox="0 0 360 200" aria-hidden="true">
      <rect x="118" y="62" width="124" height="76" fill="none" stroke="rgba(242,238,228,0.55)" strokeWidth="2.2" />
      <text x="180" y="106" textAnchor="middle">
        System
      </text>
      <path
        d="M180 36 C 64 36, 36 164, 180 168 C 324 172, 332 40, 180 36"
        fill="none"
        stroke="rgba(242,238,228,0.7)"
        strokeWidth="2.4"
        strokeDasharray="7 8"
      />
    </svg>
  );
}

function ThroughMark() {
  return (
    <svg viewBox="0 0 360 200" aria-hidden="true">
      <path d="M36 100 H324" stroke="#d5a13b" strokeWidth="4" strokeLinecap="round" />
      <circle cx="88" cy="100" r="8" fill="#173c2e" stroke="#d5a13b" strokeWidth="2.4" />
      <circle cx="180" cy="100" r="8" fill="#173c2e" stroke="#d5a13b" strokeWidth="2.4" />
      <circle cx="272" cy="100" r="8" fill="#d5a13b" />
      <text x="88" y="148" textAnchor="middle">
        Watch
      </text>
      <text x="180" y="148" textAnchor="middle">
        Build
      </text>
      <text x="272" y="148" textAnchor="middle">
        Train
      </text>
    </svg>
  );
}

export function Adopt() {
  const headRef = useReveal<HTMLDivElement>();
  const methodRef = useReveal<HTMLDivElement>();

  return (
    <section className="adopt" id="adopt" aria-labelledby="adopt-title">
      <div className="adopt-head reveal" ref={headRef}>
        <div className="section-kicker">
          <i />
          05 · The real question
        </div>
        <h2 id="adopt-title">How will they adopt this?</h2>
        <p className="adopt-creed">
          Your systems should support how people actually work, not make them work around the systems.
        </p>

        <div className="adopt-compare">
          <figure>
            <figcaption>Work around it</figcaption>
            <AroundMark />
          </figure>
          <span className="adopt-arrow" aria-hidden="true">
            →
          </span>
          <figure className="is-on">
            <figcaption>Work through it</figcaption>
            <ThroughMark />
          </figure>
        </div>
      </div>

      <div className="adopt-method reveal" ref={methodRef}>
        <ol className="adopt-points">
          {points.map((point) => (
            <li key={point.number}>
              <span>{point.number}</span>
              <h3>{point.title}</h3>
              <p>{point.body}</p>
            </li>
          ))}
        </ol>

        <p className="adopt-result">
          <span>The result</span>
          Less work between the work. Better visibility. Systems that help your teams move.
        </p>
      </div>
    </section>
  );
}

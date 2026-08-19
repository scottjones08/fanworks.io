import { useReveal } from "../hooks/useReveal";

const points = [
  {
    number: "01",
    title: "Sit with the work",
    body: "We watch the real day: the handoffs, decisions, and workarounds a process map never shows — and how your people prefer to work.",
  },
  {
    number: "02",
    title: "AI only where it helps",
    body: "Not everything can be done with AI. Automation earns its place. If it doesn't make the work better, it doesn't go in.",
  },
  {
    number: "03",
    title: "Train the way they learn",
    body: "The training style fits the staff, not a generic playbook — so the transition is quick, smooth, and actually used.",
  },
] as const;

function SitWithWork() {
  return (
    <svg className="adopt-art" viewBox="0 0 420 240" aria-hidden="true">
      <path d="M40 168 H380" stroke="rgba(242,238,228,0.28)" strokeWidth="2" />
      <rect x="86" y="118" width="248" height="14" rx="2" fill="rgba(242,238,228,0.12)" />
      <rect x="108" y="86" width="72" height="46" rx="3" fill="none" stroke="rgba(242,238,228,0.45)" strokeWidth="2" />
      <rect x="240" y="86" width="72" height="46" rx="3" fill="none" stroke="rgba(242,238,228,0.45)" strokeWidth="2" />
      <circle cx="144" cy="64" r="16" fill="none" stroke="#d5a13b" strokeWidth="2.4" />
      <path d="M128 108 C128 86, 160 86, 160 108" fill="none" stroke="#d5a13b" strokeWidth="2.4" />
      <circle cx="210" cy="58" r="16" fill="none" stroke="rgba(242,238,228,0.7)" strokeWidth="2.4" />
      <path d="M194 108 C194 80, 226 80, 226 108" fill="none" stroke="rgba(242,238,228,0.7)" strokeWidth="2.4" />
      <circle cx="276" cy="64" r="16" fill="none" stroke="rgba(242,238,228,0.55)" strokeWidth="2.4" />
      <path d="M260 108 C260 86, 292 86, 292 108" fill="none" stroke="rgba(242,238,228,0.55)" strokeWidth="2.4" />
      <path d="M70 168 C 90 148, 70 128, 96 122" fill="none" stroke="rgba(213,161,59,0.7)" strokeWidth="1.6" />
      <circle cx="96" cy="122" r="3" fill="#d5a13b" />
    </svg>
  );
}

export function Adopt() {
  const headRef = useReveal<HTMLDivElement>();
  const methodRef = useReveal<HTMLDivElement>();

  return (
    <section className="adopt" id="adopt" aria-labelledby="adopt-title">
      <div className="adopt-quote reveal" ref={headRef}>
        <div className="adopt-quote-copy">
          <div className="section-kicker">
            <i />
            04 · The real question
          </div>
          <h2 id="adopt-title">How will they adopt this?</h2>
          <blockquote className="adopt-creed">
            <span aria-hidden="true">“</span>
            <p>Your systems should support how your people actually work, not make them work around the systems.</p>
          </blockquote>
        </div>
        <SitWithWork />
      </div>

      <div className="adopt-method reveal" ref={methodRef}>
        <div className="adopt-body">
          <p>
            We sit with the teams doing the work to understand how it really happens: the handoffs, decisions,
            workarounds, and friction that don't show up on a process map. Then we redesign and connect the
            systems underneath it, using automation and AI where they genuinely make the work better.
          </p>
          <p>
            A new platform asks people to rethink the day. We learn how the workforce thinks, then train in a
            style that fits the staff — so they can use the new line from the first week, not the first quarter.
          </p>
        </div>

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
          The result? Less work between the work. Better visibility. And systems that help your teams move.
        </p>
      </div>
    </section>
  );
}

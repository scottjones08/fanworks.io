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

export function Adopt() {
  const headRef = useReveal<HTMLDivElement>();
  const bodyRef = useReveal<HTMLDivElement>();
  const pointsRef = useReveal<HTMLDivElement>();

  return (
    <section className="adopt" id="adopt" aria-labelledby="adopt-title">
      <div className="reveal" ref={headRef}>
        <div className="section-kicker kicker-dark">
          <i />
          05 · The real question
        </div>
        <div className="split-head">
          <h2 id="adopt-title">How will they adopt this?</h2>
          <p className="adopt-creed">
            Your systems should support how your people actually work, not make them work around the systems.
          </p>
        </div>
      </div>

      <div className="adopt-body reveal" ref={bodyRef}>
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

      <div className="adopt-points reveal" ref={pointsRef}>
        {points.map((point) => (
          <article key={point.number}>
            <span>{point.number}</span>
            <h3>{point.title}</h3>
            <p>{point.body}</p>
          </article>
        ))}
      </div>

      <p className="adopt-result">
        The result? Less work between the work. Better visibility. And systems that help your teams move.
      </p>
    </section>
  );
}

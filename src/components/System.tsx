import { useReveal } from "../hooks/useReveal";

const sources = [
  "CRM",
  "ERP",
  "Sheets",
  "Email",
  "Drive",
  "Paper",
  "Texts",
  "Whiteboard",
  "Accounting",
  "Scheduler",
];

const outcomes = ["Searchable", "Connected", "Owned"];

export function System() {
  const revealRef = useReveal<HTMLDivElement>();

  return (
    <section className="system system-convergence" id="system" aria-labelledby="system-title">
      <span className="corner" aria-hidden="true">+</span>
      <span className="corner corner-tr" aria-hidden="true">+</span>
      <span className="corner corner-bl" aria-hidden="true">+</span>
      <span className="corner corner-br" aria-hidden="true">+</span>

      <div className="reveal" ref={revealRef}>
        <div className="section-kicker">
          <i />
          01 · The data layer
        </div>
        <div className="split-head system-convergence-head">
          <h2 id="system-title">One data layer.</h2>
          <p>
            CRM, shared drives, whiteboards, inboxes, the spreadsheet only one person understands —
            even the paper tickets. All of it has to come with you. We don&apos;t add another tool. We
            build one data layer the work actually follows, and migrate every workspace into it.
          </p>
        </div>
      </div>

      <div
        className="system-convergence-frame"
        role="img"
        aria-label="Ten disconnected workspaces converging into one searchable, connected, owned operating layer"
      >
        <div className="system-source-group">
          <p className="system-state system-state-before">Before</p>
          <ul className="system-source-list">
            {sources.map((source) => (
              <li key={source}>
                <span>{source}</span>
                <i aria-hidden="true" />
              </li>
            ))}
          </ul>
        </div>

        <div className="system-converge-axis" aria-hidden="true">
          <span />
        </div>

        <div className="system-result">
          <p className="system-state system-state-after">After</p>
          <div className="system-result-card">One operating layer</div>
          <ul className="system-outcomes" aria-label="Benefits of the operating layer">
            {outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

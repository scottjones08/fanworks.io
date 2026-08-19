import { useLayoutEffect, useRef, useState } from "react";
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

type Flow = {
  width: number;
  height: number;
  paths: string[];
  node: { x: number; y: number };
  trunk: string;
  head: string;
};

export function System() {
  const revealRef = useReveal<HTMLDivElement>();
  const frameRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [flow, setFlow] = useState<Flow | null>(null);

  // Draw the converging lines from measured layout so every line starts at a
  // box edge and meets the junction node exactly, at any viewport width.
  useLayoutEffect(() => {
    const measure = () => {
      const frame = frameRef.current;
      const list = listRef.current;
      const card = cardRef.current;
      if (!frame || !list || !card || window.innerWidth < 900) {
        setFlow(null);
        return;
      }
      const fr = frame.getBoundingClientRect();
      const cr = card.getBoundingClientRect();
      const cardX = cr.left - fr.left;
      const nodeY = cr.top - fr.top + cr.height / 2;
      const node = { x: cardX - 56, y: nodeY };
      const paths = Array.from(list.children).map((item) => {
        const box = (item.firstElementChild ?? item).getBoundingClientRect();
        const x = box.right - fr.left;
        const y = box.top - fr.top + box.height / 2;
        const dx = Math.max(40, (node.x - x) * 0.5);
        return `M ${x} ${y} C ${x + dx} ${y}, ${node.x - dx * 0.6} ${node.y}, ${node.x - 8} ${node.y}`;
      });
      setFlow({
        width: fr.width,
        height: fr.height,
        paths,
        node,
        trunk: `M ${node.x + 8} ${node.y} H ${cardX - 13}`,
        head: `M ${cardX - 13} ${node.y - 6} L ${cardX - 3} ${node.y} L ${cardX - 13} ${node.y + 6} Z`,
      });
    };

    measure();
    document.fonts?.ready.then(measure).catch(() => undefined);
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    if (frameRef.current && observer) observer.observe(frameRef.current);
    window.addEventListener("resize", measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

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
        ref={frameRef}
        role="img"
        aria-label="Ten disconnected workspaces converging into one searchable, connected, owned operating layer"
      >
        <div className="system-source-group">
          <p className="system-state system-state-before">Before</p>
          <ul className="system-source-list" ref={listRef}>
            {sources.map((source) => (
              <li key={source}>
                <span>{source}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="system-converge-axis" aria-hidden="true">
          <span />
        </div>

        <div className="system-result">
          <p className="system-state system-state-after">After</p>
          <div className="system-result-card" ref={cardRef}>One operating layer</div>
          <ul className="system-outcomes" aria-label="Benefits of the operating layer">
            {outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
          </ul>
        </div>

        {flow ? (
          <svg
            className="system-flow"
            viewBox={`0 0 ${flow.width} ${flow.height}`}
            aria-hidden="true"
          >
            {flow.paths.map((d) => (
              <path key={d} d={d} className="system-flow-line" />
            ))}
            <path d={flow.trunk} className="system-flow-trunk" />
            <path d={flow.head} className="system-flow-head" />
            <circle cx={flow.node.x} cy={flow.node.y} r="8" className="system-flow-node" />
          </svg>
        ) : null}
      </div>
    </section>
  );
}

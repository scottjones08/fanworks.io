import { useEffect, useRef } from "react";
import { lineStages } from "../content";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useReveal } from "../hooks/useReveal";

const xs = [60, 240, 420, 600, 780, 960, 1140];

const tools = [
  [40, 56, "PAPER", 100, 81],
  [210, 44, "CRM", 270, 69],
  [420, 58, "ERP", 480, 83],
  [640, 46, "SHEETS", 700, 71],
  [880, 54, "EMAIL", 940, 79],
  [70, 150, "TEXTS", 130, 175],
  [260, 166, "WHITEBOARD", 325, 191],
  [500, 148, "DRIVE", 560, 173],
  [720, 160, "ACCOUNTING", 785, 185],
  [960, 152, "SCHEDULER", 1025, 177],
] as const;

const mobileTools = [
  "PAPER",
  "CRM",
  "ERP",
  "SHEETS",
  "EMAIL",
  "TEXTS",
  "WHITEBOARD",
  "DRIVE",
  "ACCOUNTING",
  "SCHEDULER",
] as const;

export function System() {
  const reduced = useReducedMotion();
  const revealRef = useReveal<HTMLDivElement>();
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const run = () => {
      frame.querySelectorAll<SVGElement | HTMLElement>("[data-line]").forEach((line) => {
        line.style.strokeDashoffset = "0";
      });
      frame.querySelectorAll<SVGElement | HTMLElement>("[data-node]").forEach((node) => {
        const index = Number(node.dataset.node);
        window.setTimeout(() => {
          node.style.opacity = "1";
        }, reduced ? 0 : 300 + index * 280);
      });
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <section className="system" id="system" aria-labelledby="system-title">
      <span className="corner" aria-hidden="true">+</span>
      <span className="corner corner-tr" aria-hidden="true">+</span>
      <span className="corner corner-bl" aria-hidden="true">+</span>
      <span className="corner corner-br" aria-hidden="true">+</span>

      <div className="reveal" ref={revealRef}>
        <div className="section-kicker">
          <i />
          02 · The data layer
        </div>
        <div className="split-head">
          <h2 id="system-title">One data layer.</h2>
          <p>
            CRM, shared drives, whiteboards, inboxes, the spreadsheet only one person understands —
            even the paper tickets. All of it has to come with you. We don't add another tool. We
            build one data layer the work actually follows, and migrate every workspace into it.
          </p>
        </div>
      </div>

      <div className="system-frame" ref={frameRef}>
        <svg
          className="system-desktop"
          viewBox="0 0 1200 620"
          role="img"
          aria-label="Diagram: disconnected tools and paper above, one unified data layer and line of work below"
        >
          <text x="40" y="30" className="sys-label">BEFORE — EVERY WORKSPACE, NO LAYER</text>
          <g className="sys-tangle">
            <path d="M100 76 L480 83" />
            <path d="M100 76 L700 71" />
            <path d="M270 69 L130 175" />
            <path d="M270 69 L325 191" />
            <path d="M480 83 L560 173" />
            <path d="M700 71 L325 191" />
            <path d="M940 79 L785 185" />
            <path d="M940 79 L1025 177" />
            <path d="M130 175 L560 173" />
            <path d="M130 175 L785 185" />
            <path d="M325 191 L1025 177" />
            <path d="M100 76 L1025 177" />
            <path d="M700 71 L130 175" />
            <path d="M480 83 L785 185" />
          </g>
          <g className="sys-boxes">
            {tools.map(([x, y, label, tx, ty]) => (
              <g key={label}>
                <rect
                  x={x}
                  y={y}
                  width={label.length > 8 ? 130 : 120}
                  height="40"
                  rx="4"
                  className={label === "PAPER" ? "is-paper" : undefined}
                />
                <text x={tx} y={ty}>{label}</text>
              </g>
            ))}
          </g>
          <g className="sys-join">
            <path d="M600 230 v52" />
            <path d="M593 274 l7 10 7-10" />
            <text x="620" y="262">ONE DATA LAYER</text>
          </g>
          <text x="40" y="368" className="sys-label">AFTER — ONE LINE, END TO END</text>
          <path data-line="true" pathLength={1} d="M60 430 H1140" className="sys-line" />
          {lineStages.map((label, index) => (
            <g key={label}>
              <circle data-node={index} cx={xs[index]} cy="430" r="7" />
              <text data-node={index} x={xs[index]} y="472">{label}</text>
            </g>
          ))}
          <text data-node="6" x="600" y="540" className="sys-caption">
            PAPER TO DIGITAL · ENTERED ONCE · EVERY HANDOFF OWNED
          </text>
        </svg>

        <div className="system-mobile">
          <p className="sys-mobile-label">Before — every workspace, no layer</p>
          <div
            className="sys-tangle-board"
            role="img"
            aria-label="Disconnected workspaces in a tangle: paper, CRM, ERP, sheets, email, texts, whiteboard, drive, accounting, and scheduler"
          >
            <svg className="sys-tangle-lines" viewBox="0 0 100 72" preserveAspectRatio="none" aria-hidden="true">
              <path d="M12 16 L48 42" />
              <path d="M12 16 L86 18" />
              <path d="M48 10 L16 36" />
              <path d="M48 10 L86 34" />
              <path d="M86 18 L48 42" />
              <path d="M16 36 L48 42" />
              <path d="M16 36 L86 34" />
              <path d="M48 42 L22 60" />
              <path d="M86 34 L70 58" />
              <path d="M12 16 L70 58" />
              <path d="M86 18 L22 60" />
              <path d="M16 36 L70 58" />
              <path d="M48 10 L22 60" />
            </svg>
            {mobileTools.map((label) => (
              <span key={label} className={`sys-chip${label === "PAPER" ? " is-paper" : ""}`}>
                {label}
              </span>
            ))}
          </div>

          <div className="sys-join-mobile">
            <i aria-hidden="true" />
            <span>One data layer · every workspace migrates</span>
          </div>

          <p className="sys-mobile-label">After — one line, end to end</p>
          <ol className="sys-spine">
            {lineStages.map((label, index) => (
              <li key={label} data-node={index}>{label}</li>
            ))}
          </ol>
          <p className="sys-mobile-caption">Paper to digital · entered once · every handoff owned</p>
        </div>
      </div>
    </section>
  );
}

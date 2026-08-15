import { useEffect, useRef } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useReveal } from "../hooks/useReveal";

const nodes = ["Intake", "Quote", "Order", "Schedule", "Production", "Delivery", "Invoice"];
const xs = [60, 240, 420, 600, 780, 960, 1140];

const tools = [
  [100, 64, "CRM", 160, 89],
  [410, 74, "ERP", 470, 99],
  [580, 64, "SHEETS", 640, 89],
  [880, 68, "EMAIL", 940, 93],
  [140, 154, "TEXTS", 200, 179],
  [410, 168, "WHITEBOARD", 475, 193],
  [720, 164, "ACCOUNTING", 785, 189],
  [1000, 150, "SCHEDULER", 1065, 175],
] as const;

const mobileTools = [
  { label: "CRM", className: "sys-chip-crm" },
  { label: "ERP", className: "sys-chip-erp" },
  { label: "SHEETS", className: "sys-chip-sheets" },
  { label: "TEXTS", className: "sys-chip-texts" },
  { label: "WHITEBOARD", className: "sys-chip-whiteboard" },
  { label: "EMAIL", className: "sys-chip-email" },
  { label: "ACCOUNTING", className: "sys-chip-accounting" },
  { label: "SCHEDULER", className: "sys-chip-scheduler" },
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
          02 · What we build
        </div>
        <div className="split-head">
          <h2 id="system-title">From tangle to line.</h2>
          <p>Most operations run on nine tools and no line between them. We don't add a tenth — we draw the line: one system of record the work actually follows.</p>
        </div>
      </div>

      <div className="system-frame" ref={frameRef}>
        <svg
          className="system-desktop"
          viewBox="0 0 1200 560"
          role="img"
          aria-label="Diagram: nine disconnected tools above, one connected line of work below"
        >
          <text x="40" y="34" className="sys-label">BEFORE — NINE TOOLS, NO LINE</text>
          <g className="sys-tangle">
            <path d="M160 86 L470 190" />
            <path d="M160 86 L700 66" />
            <path d="M300 176 L640 86" />
            <path d="M300 176 L940 90" />
            <path d="M470 96 L200 176" />
            <path d="M470 96 L780 186" />
            <path d="M640 86 L470 190" />
            <path d="M700 66 L780 186" />
            <path d="M940 90 L780 186" />
            <path d="M200 176 L640 86" />
            <path d="M470 190 L940 90" />
            <path d="M160 86 L780 186" />
          </g>
          <g className="sys-boxes">
            {tools.map(([x, y, label, tx, ty]) => (
              <g key={label}>
                <rect x={x} y={y} width={label.length > 8 ? 130 : 120} height="40" rx="4" />
                <text x={tx} y={ty}>{label}</text>
              </g>
            ))}
          </g>
          <g className="sys-join">
            <path d="M600 246 v56" />
            <path d="M593 294 l7 10 7-10" />
            <text x="620" y="282">ONE SYSTEM OF RECORD</text>
          </g>
          <text x="40" y="368" className="sys-label">AFTER — ONE LINE, END TO END</text>
          <path data-line="true" pathLength={1} d="M60 430 H1140" className="sys-line" />
          {nodes.map((label, index) => (
            <g key={label}>
              <circle data-node={index} cx={xs[index]} cy="430" r="7" />
              <text data-node={index} x={xs[index]} y="472">{label}</text>
            </g>
          ))}
          <text data-node="6" x="600" y="530" className="sys-caption">
            EVERY STAGE VISIBLE · EVERY HANDOFF OWNED · ENTERED ONCE
          </text>
        </svg>

        <div className="system-mobile">
          <p className="sys-mobile-label">Before — nine tools, no line</p>
          <div className="sys-tangle-board" role="img" aria-label="Disconnected tools in a tangle: CRM, ERP, sheets, texts, whiteboard, email, accounting, and scheduler">
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
            {mobileTools.map((tool) => (
              <span key={tool.label} className={`sys-chip ${tool.className}`}>{tool.label}</span>
            ))}
          </div>

          <div className="sys-join-mobile">
            <i aria-hidden="true" />
            <span>One system of record</span>
          </div>

          <p className="sys-mobile-label">After — one line, end to end</p>
          <ol className="sys-spine">
            {nodes.map((label, index) => (
              <li key={label} data-node={index}>{label}</li>
            ))}
          </ol>
          <p className="sys-mobile-caption">Every stage visible · every handoff owned · entered once</p>
        </div>
      </div>
    </section>
  );
}

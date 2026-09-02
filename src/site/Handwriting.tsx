import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../shared/useReducedMotion";
import { PenArt, PenDefs } from "./Pen";

export type HandwritingItem = { label: string; before: string; after: string };

const SPEED = 260; // px per second at the pen's tip: a hand, not a printer
const HOLD = 4200; // ms a finished line stays before the next one

/**
 * A ballpoint pen writes each situation out by hand, line by line, then the
 * rebuilt version appears beneath it. Cycles through every item while in view.
 */
export function Handwriting({ items }: { items: HandwritingItem[] }) {
  const reduced = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<SVGTextElement>(null);
  const penRef = useRef<SVGGElement>(null);
  const clipRefs = useRef<(SVGRectElement | null)[]>([]);
  const [width, setWidth] = useState(0);
  const [fontsReady, setFontsReady] = useState(false);
  const [index, setIndex] = useState(0);
  const [lines, setLines] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<"writing" | "hold">("writing");

  const narrow = width < 640;
  const fontSize = narrow ? 22 : 34;
  const lh = Math.round(fontSize * 1.9);
  const pad = 14;
  const height = Math.max(1, lines.length) * lh + pad * 2;
  const item = items[index];

  // Measure the column and wait for the italic to load before wrapping.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const sync = () => setWidth(host.getBoundingClientRect().width);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(host);
    document.fonts?.ready.then(() => setFontsReady(true)).catch(() => setFontsReady(true));
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(host);
    return () => io.disconnect();
  }, []);

  // Wrap the sentence to the column, measuring with the real font.
  useEffect(() => {
    const m = measureRef.current;
    if (!m || !width) return;
    const max = width - 24;
    const measure = (s: string) => {
      m.textContent = s;
      return m.getComputedTextLength();
    };
    const out: string[] = [];
    let cur = "";
    item.before.split(" ").forEach((word) => {
      const next = cur ? `${cur} ${word}` : word;
      if (cur && measure(next) > max) {
        out.push(cur);
        cur = word;
      } else {
        cur = next;
      }
    });
    if (cur) out.push(cur);
    setLines(out);
  }, [item, width, fontsReady, fontSize]);

  // Write.
  useEffect(() => {
    const pen = penRef.current;
    const svg = pen?.ownerSVGElement;
    if (!pen || !svg || !lines.length) return;
    const texts = Array.from(svg.querySelectorAll<SVGTextElement>("text.hw-line:not(.hw-measure)"));
    const widths = texts.map((t) => t.getComputedTextLength());
    const rects = clipRefs.current.slice(0, lines.length);
    rects.forEach((r) => r?.setAttribute("width", "0"));
    if (reduced) {
      rects.forEach((r, i) => r?.setAttribute("width", `${widths[i] + 8}`));
      pen.style.opacity = "0";
      setPhase("hold");
      return;
    }
    if (!visible) {
      pen.style.opacity = "0";
      return;
    }
    const starts = widths.map((_, i) => widths.slice(0, i).reduce((a, b) => a + b, 0));
    const total = widths.reduce((a, b) => a + b, 0);
    const duration = (total / SPEED) * 1000;
    const scale = narrow ? 0.55 : 0.82;
    const t0 = performance.now() + 400;
    let frame = 0;
    let hold = 0;
    setPhase("writing");
    const tick = (now: number) => {
      const t = Math.max(0, Math.min(1, (now - t0) / duration));
      const drawn = t * total;
      let px = 0;
      let py = pad + fontSize * 0.8;
      widths.forEach((w, i) => {
        const local = Math.max(0, Math.min(w, drawn - starts[i]));
        rects[i]?.setAttribute("width", `${local + 6}`);
        if (drawn >= starts[i] && (drawn < starts[i] + w || i === widths.length - 1)) {
          px = local;
          py = pad + i * lh + fontSize * 1.1;
        }
      });
      const wob = Math.sin(now / 55) * 1.6;
      pen.setAttribute("transform", `translate(${px.toFixed(1)} ${(py - 3 + wob * 0.4).toFixed(1)}) rotate(${(-48 + wob).toFixed(1)}) scale(${scale})`);
      pen.style.opacity = t > 0 && t < 1 ? "1" : "0";
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setPhase("hold");
        hold = window.setTimeout(() => setIndex((i) => (i + 1) % items.length), HOLD);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(hold);
    };
  }, [lines, visible, reduced, narrow, fontSize, lh, items.length]);

  return (
    <div ref={hostRef} className={`hw is-${phase}`}>
      <p className="hw-label">
        <span>{item.label}</span>
        <span>
          {index + 1} / {items.length}
        </span>
      </p>
      <svg className="hw-svg" width={width || 1} height={height} viewBox={`0 0 ${width || 1} ${height}`} aria-hidden="true">
        <defs>
          <PenDefs />
          {lines.map((_, i) => (
            <clipPath key={i} id={`hw-clip-${i}`}>
              <rect
                ref={(el) => {
                  clipRefs.current[i] = el;
                }}
                x={-4}
                y={pad + i * lh - 10}
                width="0"
                height={lh + 20}
              />
            </clipPath>
          ))}
        </defs>
        <text ref={measureRef} className="hw-line hw-measure" x={0} y={-300} style={{ fontSize }} />
        {lines.map((line, i) => (
          <text key={`${index}-${i}`} className="hw-line" x={0} y={pad + i * lh + fontSize * 1.1} style={{ fontSize }} clipPath={`url(#hw-clip-${i})`}>
            {line}
          </text>
        ))}
        <g ref={penRef} className="hw-pen" filter="url(#pen-shadow)">
          <PenArt />
        </g>
      </svg>
      <p className="hw-sr">{item.before}</p>
      <p className="hw-after" aria-live="polite">
        <span className="hw-after-k">Rebuilt</span>
        {item.after}
      </p>
    </div>
  );
}

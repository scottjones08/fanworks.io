import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../shared/useReducedMotion";

export type HandwritingItem = { label: string; before: string; after: string };

const WRITE = 300; // px per second at the pencil's tip
const ERASE = 520; // px per second for the eraser
const HOLD = 3000; // ms the rebuilt line stays before the next item
const PAUSE = 1100; // ms between writing and erasing

type Phase = "writing" | "erasing" | "rewriting" | "hold";

/** A yellow pencil, tip at the origin, drawn along +x. */
function PencilArt() {
  return (
    <g>
      <path d="M0 0 L 18 -5 L 18 5 Z" fill="#e8c9a0" />
      <path d="M0 0 L 6 -1.7 L 6 1.7 Z" fill="#2c2c2c" />
      <rect x="18" y="-5.5" width="150" height="11" rx="1" fill="#f2b632" />
      <rect x="18" y="-5.5" width="150" height="3.4" fill="#f7c95b" />
      <rect x="18" y="2.2" width="150" height="3.3" fill="#c98f1c" />
      <rect x="168" y="-5.8" width="9" height="11.6" fill="#b9b9b9" />
      <rect x="169.5" y="-5.8" width="1.6" height="11.6" fill="#8d8d8d" />
      <rect x="173.5" y="-5.8" width="1.6" height="11.6" fill="#8d8d8d" />
      <rect x="177" y="-5.5" width="13" height="11" rx="3" fill="#e9a0a5" />
    </g>
  );
}

/** A pink block eraser, centred on the origin. */
function EraserArt() {
  return (
    <g>
      <rect x="-22" y="-11" width="44" height="22" rx="4" fill="#ef9aa3" />
      <rect x="-22" y="-11" width="44" height="7" rx="4" fill="#f6b8bf" />
      <rect x="-6" y="-11" width="12" height="22" fill="#5b7fd6" opacity="0.85" />
    </g>
  );
}

/**
 * A pencil writes each situation on ruled paper, an eraser rubs it out, and
 * the pencil writes the rebuilt line beneath it. Cycles while in view.
 */
export function Handwriting({ items }: { items: HandwritingItem[] }) {
  const reduced = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<SVGTextElement>(null);
  const pencilRef = useRef<SVGGElement>(null);
  const eraserRef = useRef<SVGGElement>(null);
  const crumbsRef = useRef<SVGGElement>(null);
  const beforeClips = useRef<(SVGRectElement | null)[]>([]);
  const afterClips = useRef<(SVGRectElement | null)[]>([]);
  const [width, setWidth] = useState(0);
  const [fontsReady, setFontsReady] = useState(false);
  const [index, setIndex] = useState(0);
  const [lines, setLines] = useState<{ before: string[]; after: string[] }>({ before: [], after: [] });
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<Phase>("writing");
  const phaseRef = useRef<Phase>("writing");

  const narrow = width < 640;
  const fontSize = narrow ? 26 : 36;
  const lh = Math.round(fontSize * 1.65);
  const left = narrow ? 44 : 72;
  const top = lh;
  const rows = Math.max(3, lines.before.length + lines.after.length + 1);
  const height = top + rows * lh + lh * 0.6;
  const item = items[index];
  const afterRow = lines.before.length;

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
      { threshold: 0.35 },
    );
    io.observe(host);
    return () => io.disconnect();
  }, []);

  // Wrap both sentences to the paper, measuring with the real font.
  useEffect(() => {
    const m = measureRef.current;
    if (!m || !width) return;
    const max = width - left - 28;
    const measure = (t: string) => {
      m.textContent = t;
      return m.getComputedTextLength();
    };
    const wrap = (text: string) => {
      const out: string[] = [];
      let cur = "";
      text.split(" ").forEach((word) => {
        const next = cur ? `${cur} ${word}` : word;
        if (cur && measure(next) > max) {
          out.push(cur);
          cur = word;
        } else {
          cur = next;
        }
      });
      if (cur) out.push(cur);
      return out;
    };
    setLines({ before: wrap(item.before), after: wrap(item.after) });
  }, [item, width, left, fontsReady, fontSize]);

  // Write, erase, rewrite.
  useEffect(() => {
    const pencil = pencilRef.current;
    const eraser = eraserRef.current;
    const crumbs = crumbsRef.current;
    const svg = pencil?.ownerSVGElement;
    if (!pencil || !eraser || !crumbs || !svg || !lines.before.length) return;
    const measure = (sel: string) => Array.from(svg.querySelectorAll<SVGTextElement>(sel)).map((t) => t.getComputedTextLength());
    const bw = measure("text.hw-before");
    const aw = measure("text.hw-after");
    const bClips = beforeClips.current.slice(0, lines.before.length);
    const aClips = afterClips.current.slice(0, lines.after.length);
    bClips.forEach((r) => {
      r?.setAttribute("x", `${left - 6}`);
      r?.setAttribute("width", "0");
    });
    aClips.forEach((r) => r?.setAttribute("width", "0"));
    const hide = () => {
      pencil.style.opacity = "0";
      eraser.style.opacity = "0";
      crumbs.style.opacity = "0";
    };
    if (reduced) {
      bClips.forEach((r, i) => r?.setAttribute("width", `${bw[i] + 10}`));
      aClips.forEach((r, i) => r?.setAttribute("width", `${aw[i] + 10}`));
      hide();
      setPhase("hold");
      return;
    }
    if (!visible) {
      hide();
      return;
    }
    const scale = narrow ? 0.62 : 0.9;
    const baseline = (row: number) => top + row * lh + fontSize * 0.72;
    const starts = (ws: number[]) => ws.map((_, i) => ws.slice(0, i).reduce((a, b) => a + b, 0));
    const bStarts = starts(bw);
    const bTotal = bw.reduce((a, b) => a + b, 0);
    const aStarts = starts(aw);
    const aTotal = aw.reduce((a, b) => a + b, 0);
    const writeMs = (bTotal / WRITE) * 1000;
    const eraseMs = (bTotal / ERASE) * 1000;
    const rewriteMs = (aTotal / WRITE) * 1000;
    const t0 = performance.now() + 400;
    const tErase = t0 + writeMs + PAUSE;
    const tRewrite = tErase + eraseMs + 500;
    const tDone = tRewrite + rewriteMs;
    let frame = 0;
    let hold = 0;
    let crumbSeed = 1;
    const rnd = () => {
      crumbSeed = (crumbSeed * 1664525 + 1013904223) % 4294967296;
      return crumbSeed / 4294967296;
    };
    const placePencil = (x: number, y: number, now: number) => {
      const wob = Math.sin(now / 60) * 1.4;
      pencil.setAttribute("transform", `translate(${x.toFixed(1)} ${(y - 2 + wob * 0.3).toFixed(1)}) rotate(${(-48 + wob).toFixed(1)}) scale(${scale})`);
    };
    setPhase("writing");
    const tick = (now: number) => {
      if (now < tErase) {
        // 1. write the situation
        const drawn = Math.min(1, Math.max(0, (now - t0) / writeMs)) * bTotal;
        let px = left;
        let py = baseline(0);
        bw.forEach((w, i) => {
          const local = Math.max(0, Math.min(w, drawn - bStarts[i]));
          bClips[i]?.setAttribute("width", `${local + 8}`);
          if (drawn >= bStarts[i] && (drawn < bStarts[i] + w || i === bw.length - 1)) {
            px = left + local;
            py = baseline(i);
          }
        });
        placePencil(px, py, now);
        pencil.style.opacity = now > t0 && now < t0 + writeMs ? "1" : "0";
        eraser.style.opacity = "0";
      } else if (now < tRewrite) {
        // 2. rub it out, line by line, left to right
        if (phaseRef.current !== "erasing") {
          phaseRef.current = "erasing";
          setPhase("erasing");
        }
        const gone = Math.min(1, Math.max(0, (now - tErase) / eraseMs)) * bTotal;
        let ex = left;
        let ey = baseline(0);
        bw.forEach((w, i) => {
          const local = Math.max(0, Math.min(w, gone - bStarts[i]));
          bClips[i]?.setAttribute("x", `${left - 6 + local}`);
          bClips[i]?.setAttribute("width", local >= w ? "0" : `${w + 8 - local}`);
          if (gone >= bStarts[i] && (gone < bStarts[i] + w || i === bw.length - 1)) {
            ex = left + local;
            ey = baseline(i);
          }
        });
        const scrub = Math.sin(now / 45) * 9;
        eraser.setAttribute("transform", `translate(${(ex + 10 + scrub).toFixed(1)} ${(ey - fontSize * 0.3).toFixed(1)}) rotate(-18) scale(${scale * 1.4})`);
        eraser.style.opacity = now < tErase + eraseMs ? "1" : "0";
        pencil.style.opacity = "0";
        // crumbs trail behind the eraser
        if (now < tErase + eraseMs) {
          crumbs.style.opacity = "1";
          Array.from(crumbs.children).forEach((c, i) => {
            if (i % 3 === 0 || !c.getAttribute("cx")) {
              c.setAttribute("cx", `${Math.max(left + 4, ex - 10 - rnd() * 70)}`);
              c.setAttribute("cy", `${ey + 2 + rnd() * 14}`);
              c.setAttribute("r", `${1 + rnd() * 1.6}`);
            }
          });
        } else {
          crumbs.style.opacity = "0";
        }
      } else {
        // 3. write the rebuilt line beneath
        if (phaseRef.current !== "rewriting") {
          phaseRef.current = "rewriting";
          setPhase("rewriting");
        }
        const drawn = Math.min(1, Math.max(0, (now - tRewrite) / rewriteMs)) * aTotal;
        let px = left;
        let py = baseline(afterRow);
        aw.forEach((w, i) => {
          const local = Math.max(0, Math.min(w, drawn - aStarts[i]));
          aClips[i]?.setAttribute("width", `${local + 8}`);
          if (drawn >= aStarts[i] && (drawn < aStarts[i] + w || i === aw.length - 1)) {
            px = left + local;
            py = baseline(afterRow + i);
          }
        });
        placePencil(px, py, now);
        pencil.style.opacity = now < tDone ? "1" : "0";
        eraser.style.opacity = "0";
        crumbs.style.opacity = "0";
      }
      if (now < tDone) {
        frame = requestAnimationFrame(tick);
      } else {
        phaseRef.current = "hold";
        setPhase("hold");
        hold = window.setTimeout(() => {
          phaseRef.current = "writing";
          setIndex((i) => (i + 1) % items.length);
        }, HOLD);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(hold);
    };
  }, [lines, visible, reduced, narrow, fontSize, lh, left, top, afterRow, items.length]);
  const rules = Array.from({ length: rows + 1 }, (_, i) => top + i * lh + fontSize * 0.95);

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
          {lines.before.map((_, i) => (
            <clipPath key={`b${i}`} id={`hw-b-${i}`}>
              <rect
                ref={(el) => {
                  beforeClips.current[i] = el;
                }}
                x={left - 6}
                y={top + i * lh - 8}
                width="0"
                height={lh + 6}
              />
            </clipPath>
          ))}
          {lines.after.map((_, i) => (
            <clipPath key={`a${i}`} id={`hw-a-${i}`}>
              <rect
                ref={(el) => {
                  afterClips.current[i] = el;
                }}
                x={left - 6}
                y={top + (afterRow + i) * lh - 8}
                width="0"
                height={lh + 6}
              />
            </clipPath>
          ))}
        </defs>
        {/* looseleaf */}
        <rect x="0" y="0" width={width || 1} height={height} fill="#fffdf8" />
        {rules.map((y) => (
          <line key={y} x1="0" y1={y} x2={width || 1} y2={y} stroke="#c9dbf2" strokeWidth="1" />
        ))}
        <line x1={left - 18} y1="0" x2={left - 18} y2={height} stroke="#f0a6b0" strokeWidth="1.2" />
        {[0.2, 0.5, 0.8].map((f) => (
          <circle key={f} cx={narrow ? 14 : 22} cy={height * f} r={narrow ? 5 : 7} fill="#f5f5f3" stroke="#e2e0da" />
        ))}
        <text ref={measureRef} className="hw-line hw-measure" x={0} y={-300} style={{ fontSize }} />
        {lines.before.map((line, i) => (
          <text key={`${index}-b${i}`} className="hw-line hw-before" x={left} y={top + i * lh + fontSize * 0.72} style={{ fontSize }} clipPath={`url(#hw-b-${i})`}>
            {line}
          </text>
        ))}
        {lines.after.map((line, i) => (
          <text key={`${index}-a${i}`} className="hw-line hw-after" x={left} y={top + (afterRow + i) * lh + fontSize * 0.72} style={{ fontSize }} clipPath={`url(#hw-a-${i})`}>
            {line}
          </text>
        ))}
        <g ref={crumbsRef} className="hw-crumbs" style={{ opacity: 0 }}>
          {Array.from({ length: 14 }, (_, i) => (
            <circle key={i} r="1.4" fill="#8a8a8a" />
          ))}
        </g>
        <g ref={eraserRef} className="hw-eraser" style={{ opacity: 0 }}>
          <EraserArt />
        </g>
        <g ref={pencilRef} className="hw-pen" style={{ opacity: 0 }}>
          <PencilArt />
        </g>
      </svg>
      <p className="hw-sr">
        {item.before} {item.after}
      </p>
    </div>
  );
}

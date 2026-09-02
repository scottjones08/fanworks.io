import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../shared/useReducedMotion";
import { stages } from "../content";

/**
 * A pencil sketches the workflow on ruled paper: the seven stations, the
 * tangle of arrows and notes that connects them today, then an eraser
 * clears the tangle and the pencil draws one line through the same
 * stations. Short labels, no sentences. Loops while in view.
 */

const GRAPHITE = "#2e2e33";
const LIGHT = "#5a5a60";

function PencilArt() {
  return (
    <g>
      <path d="M0 0 L 18 -5 L 18 5 Z" fill="#e8c9a0" />
      <path d="M0 0 L 6 -1.7 L 6 1.7 Z" fill="#2c2c2c" />
      <rect x="18" y="-5.5" width="150" height="11" rx="1" fill="#f2b632" />
      <rect x="18" y="-5.5" width="150" height="3.4" fill="#f7c95b" />
      <rect x="18" y="2.2" width="150" height="3.3" fill="#c98f1c" />
      <rect x="168" y="-5.8" width="9" height="11.6" fill="#b9b9b9" />
      <rect x="177" y="-5.5" width="13" height="11" rx="3" fill="#e9a0a5" />
    </g>
  );
}

function EraserArt() {
  return (
    <g>
      <rect x="-26" y="-13" width="52" height="26" rx="5" fill="#ef9aa3" />
      <rect x="-26" y="-13" width="52" height="8" rx="5" fill="#f6b8bf" />
      <rect x="-7" y="-13" width="14" height="26" fill="#5b7fd6" opacity="0.85" />
    </g>
  );
}

type Box = { x: number; y: number; w: number; h: number; cx: number; cy: number };

/** A rectangle drawn by hand: four slightly uneven strokes. */
function boxPath(b: Box) {
  const j = (n: number) => (n * 7919) % 5 - 2;
  return `M ${b.x} ${b.y + j(1)} L ${b.x + b.w + j(2)} ${b.y} L ${b.x + b.w} ${b.y + b.h + j(3)} L ${b.x + j(4)} ${b.y + b.h} Z`;
}

function layout(narrow: boolean) {
  const n = stages.length;
  if (!narrow) {
    const W = 1000, H = 440, bw = 108, bh = 56, x0 = 50, y = 150;
    const gap = (W - 2 * x0 - n * bw) / (n - 1);
    const boxes: Box[] = stages.map((_, i) => {
      const x = x0 + i * (bw + gap);
      return { x, y, w: bw, h: bh, cx: x + bw / 2, cy: y + bh / 2 };
    });
    const forward = boxes.slice(0, -1).map((a, i) => {
      const b = boxes[i + 1];
      const s = i % 2 ? -1 : 1;
      return `M ${a.x + a.w - 10} ${a.cy + 14 * s} C ${a.x + a.w + 50} ${a.cy - 110 * s}, ${b.x - 50} ${a.cy + 110 * s}, ${b.x + 10} ${b.cy - 14 * s}`;
    });
    const back = [
      `M ${boxes[3].cx} ${boxes[3].y + bh} C ${boxes[3].cx} ${y + bh + 120}, ${boxes[1].cx} ${y + bh + 120}, ${boxes[1].cx} ${boxes[1].y + bh + 4}`,
      `M ${boxes[5].cx} ${boxes[5].y} C ${boxes[5].cx} ${y - 90}, ${boxes[2].cx} ${y - 90}, ${boxes[2].cx} ${boxes[2].y - 4}`,
    ];
    const notes = [
      { x: boxes[1].x + 40, y: 118, text: "retyped" },
      { x: boxes[2].cx - 40, y: y + bh + 140, text: "chased twice" },
      { x: boxes[3].cx - 30, y: y - 100, text: "who owns this?" },
    ];
    const ly = y + bh - 12;
    const line = `M ${boxes[0].x - 6} ${ly} ${boxes.map((b, i) => `L ${b.x + b.w + (i < n - 1 ? 6 : 0)} ${ly + (i % 2 ? 1.5 : -1.5)}`).join(" ")}`;
    const captions = [
      { x: boxes[1].x, y: y + bh + 48, text: "entered once" },
      { x: boxes[3].x, y: y + bh + 48, text: "seen everywhere" },
      { x: boxes[5].x - 30, y: y + bh + 48, text: "owned by your people" },
    ];
    return { W, H, boxes, forward, back, notes, line, captions, title: { x: 50, y: 78 }, titleSize: 34, labelSize: 19, noteSize: 22, erase: "x" as const };
  }
  const W = 420, H = 1000, bw = 132, bh = 50, x = 150, y0 = 120;
  const step = (H - y0 - 80 - bh) / (n - 1);
  const boxes: Box[] = stages.map((_, i) => {
    const y = y0 + i * step;
    return { x, y, w: bw, h: bh, cx: x + bw / 2, cy: y + bh / 2 };
  });
  const forward = boxes.slice(0, -1).map((a, i) => {
    const b = boxes[i + 1];
    const s = i % 2 ? -1 : 1;
    return `M ${a.cx} ${a.y + a.h} C ${a.cx - 70 * s} ${a.y + a.h + 20}, ${b.cx + 70 * s} ${b.y - 20}, ${b.cx} ${b.y}`;
  });
  const back = [
    `M ${boxes[3].x} ${boxes[3].cy} C ${x - 110} ${boxes[3].cy}, ${x - 110} ${boxes[1].cy}, ${boxes[1].x - 4} ${boxes[1].cy}`,
    `M ${boxes[5].x + bw} ${boxes[5].cy} C ${x + bw + 110} ${boxes[5].cy}, ${x + bw + 110} ${boxes[2].cy}, ${boxes[2].x + bw + 4} ${boxes[2].cy}`,
  ];
  const notes = [
    { x: x + bw + 14, y: boxes[0].cy + step / 2 + 6, text: "retyped" },
    { x: 20, y: boxes[2].cy - 6, text: "chased" },
    { x: x + bw + 14, y: boxes[3].cy + step / 2 + 6, text: "who owns this?" },
  ];
  const lx = x + 18;
  const line = `M ${lx} ${boxes[0].y - 6} ${boxes.map((b, i) => `L ${lx + (i % 2 ? 1.5 : -1.5)} ${b.y + b.h + (i < n - 1 ? 6 : 0)}`).join(" ")}`;
  const captions = [
    { x: x + bw + 14, y: boxes[1].cy + 7, text: "entered once" },
    { x: x + bw + 14, y: boxes[3].cy + 7, text: "seen everywhere" },
    { x: x + bw + 14, y: boxes[5].cy + 7, text: "owned by you" },
  ];
  return { W, H, boxes, forward, back, notes, line, captions, title: { x: 24, y: 64 }, titleSize: 28, labelSize: 18, noteSize: 19, erase: "y" as const };
}

type Step = { id: string; at: number; dur: number; kind: "path" | "text" | "erase" };

export function Sketch() {
  const reduced = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [narrow, setNarrow] = useState(false);
  const [visible, setVisible] = useState(false);
  const [round, setRound] = useState(0);
  const L = layout(narrow);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const sync = () => setNarrow(host.getBoundingClientRect().width < 640);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(host);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(host);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  // The timeline, in seconds.
  const steps: Step[] = [];
  let t = 0.4;
  const add = (id: string, dur: number, kind: Step["kind"], gap = 0.08) => {
    steps.push({ id, at: t, dur, kind });
    t += dur + gap;
  };
  add("title-before", 1.4, "text", 0.3);
  L.boxes.forEach((_, i) => {
    add(`box-${i}`, 0.42, "path", 0.02);
    add(`label-${i}`, 0.34, "text", 0.05);
  });
  t += 0.2;
  L.forward.forEach((_, i) => add(`fwd-${i}`, 0.36, "path", 0.04));
  add("back-0", 0.6, "path", 0.04);
  add("note-1", 0.55, "text", 0.05);
  add("back-1", 0.6, "path", 0.04);
  add("note-2", 0.7, "text", 0.05);
  add("note-0", 0.5, "text", 0.05);
  t += 1.1;
  add("erase-tangle", 2.4, "erase", 0.5);
  add("title-after", 1.2, "text", 0.3);
  add("line", 1.7, "path", 0.15);
  L.boxes.forEach((_, i) => add(`owner-${i}`, 0.16, "path", 0.03));
  L.captions.forEach((_, i) => add(`cap-${i}`, 0.7, "text", 0.1));
  t += 3.6;
  add("erase-all", 2.2, "erase", 0.2);
  const total = t + 0.4;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !visible) return;
    const q = <T extends Element>(id: string) => svg.querySelector<T>(`[data-id="${id}"]`);
    const pencil = q<SVGGElement>("pencil");
    const eraser = q<SVGGElement>("eraser");
    const clipTangle = q<SVGRectElement>("clip-tangle");
    const clipAll = q<SVGRectElement>("clip-all");
    if (!pencil || !eraser || !clipTangle || !clipAll) return;
    const paths = new Map<string, { el: SVGPathElement; len: number }>();
    const texts = new Map<string, { el: SVGTextElement; clip: SVGRectElement; len: number; x: number; y: number }>();
    steps.forEach((s) => {
      if (s.kind === "path") {
        const el = q<SVGPathElement>(s.id);
        if (!el) return;
        const len = el.getTotalLength();
        el.style.strokeDasharray = `${len}`;
        el.style.strokeDashoffset = `${len}`;
        paths.set(s.id, { el, len });
      } else if (s.kind === "text") {
        const el = q<SVGTextElement>(s.id);
        const clip = q<SVGRectElement>(`clip-${s.id}`);
        if (!el || !clip) return;
        const len = el.getComputedTextLength();
        clip.setAttribute("width", "0");
        if (el.getAttribute("text-anchor") === "middle") clip.setAttribute("x", `${Number(el.getAttribute("x")) - len / 2 - 4}`);
        texts.set(s.id, { el, clip, len, x: Number(el.getAttribute("x")), y: Number(el.getAttribute("y")) });
      }
    });
    const resetClips = () => {
      clipTangle.setAttribute(L.erase, "0");
      clipTangle.setAttribute(L.erase === "x" ? "width" : "height", `${L.erase === "x" ? L.W : L.H}`);
      clipAll.setAttribute(L.erase, "0");
      clipAll.setAttribute(L.erase === "x" ? "width" : "height", `${L.erase === "x" ? L.W : L.H}`);
    };
    resetClips();
    const scale = narrow ? 0.75 : 1;
    if (reduced) {
      // Show the finished picture: stations and the one line.
      paths.forEach((p, id) => {
        p.el.style.strokeDashoffset = id.startsWith("fwd") || id.startsWith("back") ? `${p.len}` : "0";
      });
      texts.forEach((tx, id) => tx.clip.setAttribute("width", id === "title-before" || id.startsWith("note") ? "0" : `${tx.len + 6}`));
      pencil.style.opacity = "0";
      eraser.style.opacity = "0";
      return;
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const s = (now - start) / 1000;
      const at: { pen: { x: number; y: number } | null; eraser: { x: number; y: number } | null } = { pen: null, eraser: null };
      steps.forEach((st) => {
        const p = Math.max(0, Math.min(1, (s - st.at) / st.dur));
        const active = s >= st.at && s < st.at + st.dur;
        if (st.kind === "path") {
          const pd = paths.get(st.id);
          if (!pd) return;
          pd.el.style.strokeDashoffset = `${pd.len * (1 - p)}`;
          if (active) {
            const pt = pd.el.getPointAtLength(pd.len * p);
            at.pen = { x: pt.x, y: pt.y };
          }
        } else if (st.kind === "text") {
          const tx = texts.get(st.id);
          if (!tx) return;
          tx.clip.setAttribute("width", `${tx.len * p + 6}`);
          if (active) at.pen = { x: (tx.el.getAttribute("text-anchor") === "middle" ? tx.x - tx.len / 2 : tx.x) + tx.len * p, y: tx.y - 2 };
        } else {
          const clip = st.id === "erase-tangle" ? clipTangle : clipAll;
          if (p > 0) {
            const size = L.erase === "x" ? L.W : L.H;
            clip.setAttribute(L.erase, `${size * p}`);
            clip.setAttribute(L.erase === "x" ? "width" : "height", `${size * (1 - p)}`);
          }
          if (active) {
            const scrub = Math.sin(s * 22) * 8;
            at.eraser = L.erase === "x" ? { x: L.W * p + scrub, y: st.id === "erase-tangle" ? 190 + Math.sin(s * 5) * 60 : 220 + Math.sin(s * 4) * 120 } : { x: 210 + Math.sin(s * 5) * 110, y: L.H * p + scrub };
          }
        }
      });
      if (at.pen) {
        const wob = Math.sin(s * 14) * 1.3;
        pencil.setAttribute("transform", `translate(${at.pen.x.toFixed(1)} ${at.pen.y.toFixed(1)}) rotate(${(-46 + wob).toFixed(1)}) scale(${scale})`);
        pencil.style.opacity = "1";
      } else {
        pencil.style.opacity = "0";
      }
      if (at.eraser) {
        eraser.setAttribute("transform", `translate(${at.eraser.x.toFixed(1)} ${at.eraser.y.toFixed(1)}) rotate(-16) scale(${scale * 1.2})`);
        eraser.style.opacity = "1";
      } else {
        eraser.style.opacity = "0";
      }
      if (s < total) {
        frame = requestAnimationFrame(tick);
      } else {
        setRound((r) => r + 1);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, reduced, narrow, round]);

  const rules = Array.from({ length: Math.floor(L.H / 44) }, (_, i) => 44 * (i + 1));
  const ink = { fill: "none", stroke: GRAPHITE, strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const soft = { ...ink, stroke: LIGHT, strokeWidth: 1.8 };
  const Text = ({ id, x, y, size, children, anchor }: { id: string; x: number; y: number; size: number; children: string; anchor?: "middle" }) => (
    <>
      <clipPath id={`sk-clip-${id}`}>
        <rect data-id={`clip-${id}`} x={anchor ? x - 200 : x - 4} y={y - size} width="0" height={size * 1.4} />
      </clipPath>
      <text data-id={id} x={x} y={y} fontSize={size} textAnchor={anchor} className="sk-text" clipPath={`url(#sk-clip-${id})`}>
        {children}
      </text>
    </>
  );

  return (
    <div ref={hostRef} className="sk">
      <svg ref={svgRef} key={`${narrow}-${round}`} className="sk-svg" viewBox={`0 0 ${L.W} ${L.H}`} aria-hidden="true">
        <defs>
          <filter id="sk-ink" x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="1.6" />
          </filter>
          <clipPath id="sk-erase-tangle">
            <rect data-id="clip-tangle" x="0" y="0" width={L.W} height={L.H} />
          </clipPath>
          <clipPath id="sk-erase-all">
            <rect data-id="clip-all" x="0" y="0" width={L.W} height={L.H} />
          </clipPath>
        </defs>
        <rect width={L.W} height={L.H} fill="#fffdf8" />
        {rules.map((y) => (
          <line key={y} x1="0" y1={y} x2={L.W} y2={y} stroke="#cfdff3" strokeWidth="1" />
        ))}
        <line x1={narrow ? 16 : 34} y1="0" x2={narrow ? 16 : 34} y2={L.H} stroke="#f0a6b0" strokeWidth="1.2" />

        <g clipPath="url(#sk-erase-all)" filter="url(#sk-ink)">
          <g clipPath="url(#sk-erase-tangle)">
            <Text id="title-before" x={L.title.x} y={L.title.y} size={L.titleSize}>
              How the work moves today
            </Text>
            {L.forward.map((d, i) => (
              <path key={i} data-id={`fwd-${i}`} d={d} {...soft} />
            ))}
            {L.back.map((d, i) => (
              <path key={i} data-id={`back-${i}`} d={d} {...soft} strokeDasharray="6 5" />
            ))}
            {L.notes.map((n, i) => (
              <Text key={i} id={`note-${i}`} x={n.x} y={n.y} size={L.noteSize}>
                {n.text}
              </Text>
            ))}
          </g>
          {L.boxes.map((b, i) => (
            <g key={i}>
              <path data-id={`box-${i}`} d={boxPath(b)} {...ink} />
              <Text id={`label-${i}`} x={b.cx} y={b.cy + L.labelSize * 0.36} size={L.labelSize} anchor="middle">
                {stages[i].label}
              </Text>
              <path data-id={`owner-${i}`} d={`M ${b.x + b.w - 20} ${b.y - 4} l 5 5 l 10 -12`} {...ink} strokeWidth="2.6" />
            </g>
          ))}
          <Text id="title-after" x={L.title.x} y={L.title.y} size={L.titleSize}>
            How it moves after
          </Text>
          <path data-id="line" d={L.line} {...ink} strokeWidth="3" />
          {L.captions.map((c, i) => (
            <Text key={i} id={`cap-${i}`} x={c.x} y={c.y} size={L.noteSize}>
              {c.text}
            </Text>
          ))}
        </g>

        <g data-id="eraser" className="sk-tool" style={{ opacity: 0 }}>
          <EraserArt />
        </g>
        <g data-id="pencil" className="sk-tool" style={{ opacity: 0 }}>
          <PencilArt />
        </g>
      </svg>
    </div>
  );
}

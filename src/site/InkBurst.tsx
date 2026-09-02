import { motion } from "motion/react";
import { useEffect, useMemo, useRef } from "react";
import { PenArt, PenDefs } from "./Pen";

type Stroke = { d: string; x: number; y: number; rot: number; delay: number; dur: number; width: number; drift: number };

function seeded(seed: number) {
  let t = seed;
  return () => {
    t = (t * 1664525 + 1013904223) % 4294967296;
    return t / 4294967296;
  };
}

/** A small ballpoint mark, drawn tip-first in local units of size s. */
function mark(kind: number, s: number, r: () => number) {
  const k = s.toFixed(1);
  const h = (s / 2).toFixed(1);
  switch (kind) {
    case 0: // loop
      return `M0 0 c ${(s * 1.2).toFixed(1)} ${(-s).toFixed(1)}, ${(s * 1.6).toFixed(1)} ${(s * 0.6).toFixed(1)}, ${(s * 0.4).toFixed(1)} ${(s * 0.8).toFixed(1)} c ${(-s * 1.1).toFixed(1)} ${(s * 0.2).toFixed(1)}, ${(-s * 0.8).toFixed(1)} ${(-s * 1.2).toFixed(1)}, ${(s * 0.5).toFixed(1)} ${(-s * 0.9).toFixed(1)}`;
    case 1: // spiral of three shrinking loops
      return [1, 0.62, 0.36]
        .map((f) => `c ${(s * f).toFixed(1)} ${(-s * f).toFixed(1)}, ${(s * 1.5 * f).toFixed(1)} ${(s * 0.5 * f).toFixed(1)}, ${(s * 0.3 * f).toFixed(1)} ${(s * 0.7 * f).toFixed(1)} c ${(-s * 0.9 * f).toFixed(1)} ${(s * 0.15 * f).toFixed(1)}, ${(-s * 0.7 * f).toFixed(1)} ${(-s * 0.9 * f).toFixed(1)}, ${(s * 0.25 * f).toFixed(1)} ${(-s * 0.55 * f).toFixed(1)}`)
        .join(" ")
        .replace(/^/, "M0 0 ");
    case 2: // check
      return `M0 0 l ${(s * 0.35).toFixed(1)} ${(s * 0.42).toFixed(1)} l ${(s * 0.95).toFixed(1)} ${(-s * 1).toFixed(1)}`;
    case 3: // dash with a little curve
      return `M0 0 q ${h} ${(-s * 0.18).toFixed(1)} ${k} 0`;
    case 4: // dot
      return `M0 0 l 0.6 0.4`;
    case 5: // squiggle
      return `M0 0 q ${(s * 0.25).toFixed(1)} ${(-s * 0.5).toFixed(1)} ${h} 0 t ${h} 0 t ${h} 0`;
    default: // scribbled star
      return `M0 0 l ${(s * 0.6).toFixed(1)} ${(-s * 0.2).toFixed(1)} l ${(-s * 0.6).toFixed(1)} ${(s * 0.5).toFixed(1)} l ${(s * 0.3 + r() * 4).toFixed(1)} ${(-s * 0.8).toFixed(1)} l 0 ${(s * 0.9).toFixed(1)}`;
  }
}

const FLOURISH = "M -130 78 c 36 -66, 88 -66, 60 -8 c -26 54, -74 60, -30 16 c 52 -52, 150 -34, 330 -12 c 26 3, 40 12, 30 24";

/**
 * Ballpoint confetti: a burst of small ink marks radiating from the Send
 * dot, each drawing itself, while the pen signs a flourish underneath.
 */
export function InkBurst({ origin, reduced }: { origin: { x: number; y: number }; reduced: boolean }) {
  const strokes = useMemo<Stroke[]>(() => {
    const r = seeded(7);
    return Array.from({ length: 96 }, (_, i) => {
      const angle = r() * Math.PI * 2;
      const dist = 140 + r() * 460;
      const s = 14 + r() * 34;
      return {
        d: mark(i % 7, s, r),
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist * 0.72 - 40,
        rot: r() * 360,
        delay: r() * 0.35,
        dur: 1.7 + r() * 1.1,
        width: i % 7 === 4 ? 5.5 : 2 + r() * 1.4,
        drift: 30 + r() * 60,
      };
    });
  }, []);

  const flourishRef = useRef<SVGPathElement>(null);
  const penRef = useRef<SVGGElement>(null);

  // The pen signs the flourish: draw it in over 1.6 s with the pen on its tip.
  useEffect(() => {
    const path = flourishRef.current;
    const pen = penRef.current;
    if (!path || !pen || reduced) return;
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    const start = performance.now();
    let frame = 0;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (now: number) => {
      const t = Math.min(1, (now - start - 350) / 1600);
      const len = t <= 0 ? 0 : ease(t) * length;
      path.style.strokeDashoffset = `${length - len}`;
      const p = path.getPointAtLength(len);
      const q = path.getPointAtLength(Math.min(length, len + 3));
      const heading = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
      const lean = Math.max(-16, Math.min(16, (heading - 0) * 0.12));
      pen.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${(-48 + lean).toFixed(1)}) scale(0.9)`);
      pen.style.opacity = t < 1 ? "1" : "0";
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);

  if (reduced) return null;
  return (
    <svg className="ink-burst" aria-hidden="true">
      <defs>
        <PenDefs />
      </defs>
      <g transform={`translate(${origin.x} ${origin.y})`}>
        {strokes.map((st, i) => (
          <motion.g
            key={i}
            initial={{ x: 0, y: 0, rotate: st.rot - 40, opacity: 1, scale: 0.6 }}
            animate={{ x: st.x, y: [0, st.y - st.drift, st.y + st.drift * 0.6], rotate: st.rot, opacity: [1, 1, 0], scale: 1 }}
            transition={{
              x: { duration: st.dur, delay: st.delay, ease: [0.16, 0.84, 0.3, 1] },
              y: { duration: st.dur, delay: st.delay, ease: [0.16, 0.84, 0.3, 1], times: [0, 0.55, 1] },
              rotate: { duration: st.dur, delay: st.delay, ease: [0.16, 0.84, 0.3, 1] },
              scale: { duration: 0.6, delay: st.delay, ease: "easeOut" },
              opacity: { duration: st.dur, delay: st.delay, ease: "linear", times: [0, 0.72, 1] },
            }}
          >
            <motion.path
              d={st.d}
              className="ink-mark"
              style={{ strokeWidth: st.width }}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.55, delay: st.delay + 0.05, ease: "easeOut" }}
            />
          </motion.g>
        ))}
        <path ref={flourishRef} d={FLOURISH} className="ink-flourish" />
        <g ref={penRef} className="ink-pen" filter="url(#pen-shadow)">
          <PenArt />
        </g>
      </g>
    </svg>
  );
}

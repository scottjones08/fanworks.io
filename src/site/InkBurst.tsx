import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { FAN_BLADE, FAN_BLADE_ROTATIONS, FAN_F } from "../shared/Logo";
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
    case 0:
      return `M0 0 c ${(s * 1.2).toFixed(1)} ${(-s).toFixed(1)}, ${(s * 1.6).toFixed(1)} ${(s * 0.6).toFixed(1)}, ${(s * 0.4).toFixed(1)} ${(s * 0.8).toFixed(1)} c ${(-s * 1.1).toFixed(1)} ${(s * 0.2).toFixed(1)}, ${(-s * 0.8).toFixed(1)} ${(-s * 1.2).toFixed(1)}, ${(s * 0.5).toFixed(1)} ${(-s * 0.9).toFixed(1)}`;
    case 1:
      return [1, 0.62, 0.36]
        .map((f) => `c ${(s * f).toFixed(1)} ${(-s * f).toFixed(1)}, ${(s * 1.5 * f).toFixed(1)} ${(s * 0.5 * f).toFixed(1)}, ${(s * 0.3 * f).toFixed(1)} ${(s * 0.7 * f).toFixed(1)} c ${(-s * 0.9 * f).toFixed(1)} ${(s * 0.15 * f).toFixed(1)}, ${(-s * 0.7 * f).toFixed(1)} ${(-s * 0.9 * f).toFixed(1)}, ${(s * 0.25 * f).toFixed(1)} ${(-s * 0.55 * f).toFixed(1)}`)
        .join(" ")
        .replace(/^/, "M0 0 ");
    case 2:
      return `M0 0 l ${(s * 0.35).toFixed(1)} ${(s * 0.42).toFixed(1)} l ${(s * 0.95).toFixed(1)} ${(-s * 1).toFixed(1)}`;
    case 3:
      return `M0 0 q ${h} ${(-s * 0.18).toFixed(1)} ${k} 0`;
    case 4:
      return `M0 0 l 0.6 0.4`;
    case 5:
      return `M0 0 q ${(s * 0.25).toFixed(1)} ${(-s * 0.5).toFixed(1)} ${h} 0 t ${h} 0 t ${h} 0`;
    default:
      return `M0 0 l ${(s * 0.6).toFixed(1)} ${(-s * 0.2).toFixed(1)} l ${(-s * 0.6).toFixed(1)} ${(s * 0.5).toFixed(1)} l ${(s * 0.3 + r() * 4).toFixed(1)} ${(-s * 0.8).toFixed(1)} l 0 ${(s * 0.9).toFixed(1)}`;
  }
}

const FLOURISH = "M -130 78 c 36 -66, 88 -66, 60 -8 c -26 54, -74 60, -30 16 c 52 -52, 150 -34, 330 -12 c 26 3, 40 12, 30 24";
const LINES = ["Thanks for reaching out.", "We will see you soon."];

// Timeline, in milliseconds from mount.
const T = { flourish: 350, flourishDur: 1600, stage: 1500, logo: 2000, logoDur: 2300, ink: 4400, write: 4700, writeDur: 1400, writeGap: 250, done: 7600, auto: 15000 };

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * The moment a note is received: ballpoint confetti from the Send dot and a
 * signed flourish, then the page dims to stone while the pen draws the
 * fanworks mark, inks it, and writes the thank-you, line by line.
 */
export function InkBurst({ origin, reduced, onDone }: { origin: { x: number; y: number }; reduced: boolean; onDone: () => void }) {
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
  const logoRef = useRef<SVGGElement>(null);
  const textRefs = useRef<(SVGTextElement | null)[]>([]);
  const clipRefs = useRef<(SVGRectElement | null)[]>([]);
  const [staged, setStaged] = useState(false);
  const [inked, setInked] = useState(false);
  const [finished, setFinished] = useState(false);

  // Geometry for the stage: the mark sits above centre, the words beneath it.
  const geo = useMemo(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const narrow = w < 640;
    const k = narrow ? 0.72 : 1.05;
    const cx = w / 2;
    const cy = h * 0.4;
    return { narrow, k, cx, cy, logoX: cx - 64 * k, logoY: cy - 52 * k - (narrow ? 70 : 96), fontSize: narrow ? 24 : 34, lineGap: narrow ? 36 : 50, firstBaseline: cy + (narrow ? 44 : 60) };
  }, []);

  useEffect(() => {
    const pen = penRef.current;
    const flourish = flourishRef.current;
    const logo = logoRef.current;
    if (!pen || !flourish || !logo) return;
    if (reduced) {
      setStaged(true);
      setInked(true);
      setFinished(true);
      clipRefs.current.forEach((r) => r?.setAttribute("width", "2000"));
      return;
    }

    const fLen = flourish.getTotalLength();
    flourish.style.strokeDasharray = `${fLen}`;
    const logoPaths = Array.from(logo.querySelectorAll<SVGPathElement>("path"));
    const logoLens = logoPaths.map((el) => el.getTotalLength());
    const logoTotal = logoLens.reduce((a, b) => a + b, 0);
    logoPaths.forEach((el, i) => {
      el.style.strokeDasharray = `${logoLens[i]}`;
      el.style.strokeDashoffset = `${logoLens[i]}`;
    });
    const textWidths = textRefs.current.map((t) => (t ? t.getComputedTextLength() : 0));
    clipRefs.current.forEach((r) => r?.setAttribute("width", "0"));

    const placePen = (x: number, y: number, deg: number, scale: number) => {
      pen.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${deg.toFixed(1)}) scale(${scale})`);
    };
    const penScale = geo.narrow ? 0.62 : 0.9;

    const start = performance.now();
    let frame = 0;
    let stagedYet = false;
    let inkedYet = false;
    let doneYet = false;
    const tick = (now: number) => {
      const t = now - start;

      // 1. The flourish under the Send button.
      if (t >= T.flourish && t < T.logo) {
        const u = Math.min(1, (t - T.flourish) / T.flourishDur);
        const len = easeOut(u) * fLen;
        flourish.style.strokeDashoffset = `${fLen - len}`;
        const p = flourish.getPointAtLength(len);
        const q = flourish.getPointAtLength(Math.min(fLen, len + 3));
        const heading = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
        placePen(origin.x + p.x, origin.y + p.y, -48 + Math.max(-16, Math.min(16, heading * 0.12)), penScale);
        pen.style.opacity = "1";
      }
      if (t >= T.stage && !stagedYet) {
        stagedYet = true;
        setStaged(true);
      }

      // 2. The mark, traced stroke by stroke.
      if (t >= T.logo && t < T.ink) {
        const u = Math.min(1, (t - T.logo) / T.logoDur);
        let remaining = easeInOut(u) * logoTotal;
        let px = 0;
        let py = 0;
        logoPaths.forEach((el, i) => {
          const l = logoLens[i];
          const drawn = Math.max(0, Math.min(l, remaining));
          el.style.strokeDashoffset = `${l - drawn}`;
          if (remaining > 0 && remaining <= l) {
            const pt = el.getPointAtLength(drawn).matrixTransform(el.getCTM() ?? new DOMMatrix());
            px = pt.x;
            py = pt.y;
          } else if (remaining > l && i === logoPaths.length - 1) {
            const pt = el.getPointAtLength(l).matrixTransform(el.getCTM() ?? new DOMMatrix());
            px = pt.x;
            py = pt.y;
          }
          remaining -= l;
        });
        placePen(px, py, -50 + Math.sin(t / 90) * 2, penScale);
        pen.style.opacity = "1";
      }
      if (t >= T.ink && !inkedYet) {
        inkedYet = true;
        setInked(true);
      }

      // 3. The words, written left to right.
      LINES.forEach((_, i) => {
        const begin = T.write + i * (T.writeDur + T.writeGap);
        if (t < begin) return;
        const u = Math.min(1, (t - begin) / T.writeDur);
        const w = textWidths[i];
        const x0 = geo.cx - w / 2;
        const drawn = easeInOut(u) * w;
        clipRefs.current[i]?.setAttribute("x", `${x0 - 4}`);
        clipRefs.current[i]?.setAttribute("width", `${drawn + 8}`);
        if (u < 1 || i === LINES.length - 1) {
          const baseline = geo.firstBaseline + i * geo.lineGap;
          placePen(x0 + drawn, baseline - 2, -50 + Math.sin(t / 70) * 3, penScale);
          pen.style.opacity = u < 1 ? "1" : "0";
        }
      });

      if (t >= T.done && !doneYet) {
        doneYet = true;
        pen.style.opacity = "0";
        setFinished(true);
      }
      if (t >= T.auto) {
        onDone();
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [geo, origin.x, origin.y, reduced, onDone]);

  useEffect(() => {
    if (!staged) return;
    const key = (e: KeyboardEvent) => (e.key === "Escape" || e.key === "Enter") && onDone();
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [staged, onDone]);

  return (
    <>
      <div className={`ink-stage${staged ? " is-on" : ""}`} onClick={staged ? onDone : undefined} role={staged ? "button" : undefined} aria-label={staged ? "Return to the page" : undefined} />
      <svg className="ink-burst" aria-hidden="true">
        <defs>
          <PenDefs />
          {LINES.map((_, i) => (
            <clipPath key={i} id={`ink-clip-${i}`}>
              <rect ref={(el) => (clipRefs.current[i] = el)} x={geo.cx - 600} y={geo.firstBaseline + i * geo.lineGap - geo.fontSize * 1.2} width="0" height={geo.fontSize * 1.7} />
            </clipPath>
          ))}
        </defs>

        {!reduced ? (
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
                <motion.path d={st.d} className="ink-mark" style={{ strokeWidth: st.width }} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.55, delay: st.delay + 0.05, ease: "easeOut" }} />
              </motion.g>
            ))}
            <path ref={flourishRef} d={FLOURISH} className="ink-flourish" />
          </g>
        ) : null}

        <g className={`ink-stage-art${staged ? " is-on" : ""}`}>
          <g ref={logoRef} className={`ink-logo${inked ? " is-inked" : ""}`} transform={`translate(${geo.logoX} ${geo.logoY}) scale(${geo.k})`}>
            <path d={FAN_F} />
            {FAN_BLADE_ROTATIONS.map((deg) => (
              <path key={deg} d={FAN_BLADE} transform={deg ? `rotate(${deg} 46 100)` : undefined} />
            ))}
          </g>
          {LINES.map((line, i) => (
            <text
              key={line}
              ref={(el) => (textRefs.current[i] = el)}
              className="ink-words"
              x={geo.cx}
              y={geo.firstBaseline + i * geo.lineGap}
              textAnchor="middle"
              style={{ fontSize: geo.fontSize }}
              clipPath={`url(#ink-clip-${i})`}
            >
              {line}
            </text>
          ))}
          <text className={`ink-hint${finished ? " is-on" : ""}`} x={geo.cx} y={geo.firstBaseline + LINES.length * geo.lineGap + (geo.narrow ? 40 : 56)} textAnchor="middle">
            tap anywhere to return
          </text>
        </g>

        <g ref={penRef} className="ink-pen" filter="url(#pen-shadow)">
          <PenArt />
        </g>
      </svg>
    </>
  );
}

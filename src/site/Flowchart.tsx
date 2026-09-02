import { useEffect, useState } from "react";

/**
 * A hand-drawn flowchart of what happens after a note arrives, drawn by the
 * page's pen as part of the one line. Geometry is in chart units; the thread
 * scales it to the element's width. Two layouts: a snake for wide screens
 * and a single column for phones. Every command is absolute so the thread
 * can scale it, and M lifts the pen between shapes.
 */

type Label = { x: number; y: number; title?: string; small?: string; kind?: "box" | "decision" | "end" | "branch" };

const box = (x: number, y: number, w: number, h: number) => `M${x} ${y} L${x + w} ${y} L${x + w} ${y + h} L${x} ${y + h} Z`;
const diamond = (cx: number, cy: number, hw: number, hh: number) => `M${cx - hw} ${cy} L${cx} ${cy - hh} L${cx + hw} ${cy} L${cx} ${cy + hh} Z`;
const right = (x0: number, x1: number, y: number) => `M${x0} ${y} L${x1} ${y} L${x1 - 10} ${y - 6} M${x1} ${y} L${x1 - 10} ${y + 6}`;
const left = (x0: number, x1: number, y: number) => `M${x0} ${y} L${x1} ${y} L${x1 + 10} ${y - 6} M${x1} ${y} L${x1 + 10} ${y + 6}`;
const down = (x: number, y0: number, y1: number) => `M${x} ${y0} L${x} ${y1} L${x - 6} ${y1 - 10} M${x} ${y1} L${x + 6} ${y1 - 10}`;

const WIDE = {
  w: 1000,
  h: 620,
  entry: [40, 40],
  exit: [695, 620],
  d: [
    box(40, 40, 210, 80),
    right(250, 300, 80),
    box(300, 40, 220, 80),
    right(520, 570, 80),
    diamond(680, 80, 110, 60),
    right(790, 850, 80),
    box(850, 50, 130, 60),
    down(680, 140, 200),
    box(560, 200, 240, 80),
    left(560, 510, 240),
    box(300, 200, 220, 80),
    left(300, 250, 240),
    diamond(150, 240, 100, 55),
    down(150, 295, 330),
    box(60, 330, 180, 60),
    `M50 240 L30 240 L30 480 L300 480 L290 474 M300 480 L290 486`,
    box(300, 440, 220, 80),
    right(520, 570, 480),
    box(570, 440, 250, 80),
    `M820 480 L870 480 L870 400 L695 400 L695 440 L689 430 M695 440 L701 430`,
    `M695 520 L695 620`,
  ].join(" "),
  labels: [
    { x: 145, y: 80, title: "A note arrives", small: "the sentence, your name" },
    { x: 410, y: 80, title: "Thirty minutes", small: "together, on the phone" },
    { x: 680, y: 80, title: "A handoff worth fixing?", kind: "decision" },
    { x: 820, y: 66, title: "no", kind: "branch" },
    { x: 915, y: 80, title: "We say so.", kind: "end" },
    { x: 700, y: 170, title: "yes", kind: "branch" },
    { x: 680, y: 240, title: "Workday MRI", small: "days beside your team" },
    { x: 410, y: 240, title: "One map", small: "friction ranked by cost" },
    { x: 150, y: 240, title: "Rebuild it?", kind: "decision" },
    { x: 172, y: 312, title: "no", kind: "branch" },
    { x: 150, y: 360, title: "You keep the map.", kind: "end" },
    { x: 160, y: 466, title: "yes", kind: "branch" },
    { x: 410, y: 480, title: "Operating line rebuild", small: "intake to invoice, connected" },
    { x: 695, y: 480, title: "Hand off", small: "your people own it" },
    { x: 782, y: 386, title: "keep it improving", kind: "branch" },
  ] as Label[],
};

const NARROW = {
  w: 400,
  h: 1200,
  entry: [30, 30],
  exit: [140, 1200],
  d: [
    box(30, 30, 220, 80),
    down(140, 110, 160),
    box(30, 160, 220, 80),
    down(140, 240, 290),
    diamond(140, 360, 110, 70),
    right(250, 280, 360),
    box(280, 330, 110, 60),
    down(140, 430, 480),
    box(30, 480, 220, 80),
    down(140, 560, 610),
    box(30, 610, 220, 80),
    down(140, 690, 740),
    diamond(140, 810, 110, 70),
    right(250, 280, 810),
    box(280, 780, 110, 60),
    down(140, 880, 930),
    box(30, 930, 220, 80),
    down(140, 1010, 1060),
    box(30, 1060, 220, 80),
    `M250 1100 L300 1100 L300 1020 L200 1020 L200 1060 L194 1050 M200 1060 L206 1050`,
    `M140 1140 L140 1200`,
  ].join(" "),
  labels: [
    { x: 140, y: 70, title: "A note arrives", small: "the sentence, your name" },
    { x: 140, y: 200, title: "Thirty minutes", small: "together, on the phone" },
    { x: 140, y: 360, title: "A handoff worth fixing?", kind: "decision" },
    { x: 265, y: 346, title: "no", kind: "branch" },
    { x: 335, y: 360, title: "We say so.", kind: "end" },
    { x: 160, y: 455, title: "yes", kind: "branch" },
    { x: 140, y: 520, title: "Workday MRI", small: "days beside your team" },
    { x: 140, y: 650, title: "One map", small: "friction ranked by cost" },
    { x: 140, y: 810, title: "Rebuild it?", kind: "decision" },
    { x: 265, y: 796, title: "no", kind: "branch" },
    { x: 335, y: 810, title: "You keep the map.", kind: "end" },
    { x: 160, y: 905, title: "yes", kind: "branch" },
    { x: 140, y: 970, title: "Operating line rebuild", small: "intake to invoice" },
    { x: 140, y: 1100, title: "Hand off", small: "your people own it" },
    { x: 250, y: 1006, title: "keep it improving", kind: "branch" },
  ] as Label[],
};

export function Flowchart() {
  const [narrow, setNarrow] = useState(() => window.innerWidth < 700);
  useEffect(() => {
    const sync = () => setNarrow(window.innerWidth < 700);
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);
  const c = narrow ? NARROW : WIDE;
  return (
    <div
      className={`one-chart${narrow ? " is-narrow" : ""}`}
      style={{ aspectRatio: `${c.w} / ${c.h}` }}
      data-thread="chart"
      data-thread-w={c.w}
      data-thread-d={c.d}
      data-thread-entry={c.entry.join(",")}
      data-thread-exit={c.exit.join(",")}
      role="img"
      aria-label="How it goes: a note arrives, thirty minutes together, and if there is a handoff worth fixing, a Workday MRI produces one map with friction ranked by cost. If it is worth rebuilding, the operating line is rebuilt and handed off to your people, who keep it improving. If not, you keep the map."
    >
      {c.labels.map((l, i) => (
        <div key={i} className={`one-chart-label is-${l.kind || "box"}`} style={{ left: `${(l.x / c.w) * 100}%`, top: `${(l.y / c.h) * 100}%` }} data-thread-note>
          {l.title ? <strong>{l.title}</strong> : null}
          {l.small ? <small>{l.small}</small> : null}
        </div>
      ))}
    </div>
  );
}

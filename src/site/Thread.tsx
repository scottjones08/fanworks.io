import { type ReactNode, type RefObject, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../shared/useReducedMotion";
import { PenArt, PenDefs } from "./Pen";

/**
 * A sketch the ballpoint pen draws inside one section, once the section is
 * in view. Every element in the host carrying data-thread is an anchor; the
 * path is built through them in document order. Kinds combine with spaces:
 *   fixed        the anchor sits in the fixed header; measured as at scroll 0
 *   knot         a small tangle at the anchor
 *   scribble     a large, messy tangle at the anchor
 *   back         the approach overshoots the anchor and doubles back to it
 *   line-start / line-end   a dead-straight run between the two
 *   tick         a short downward tick at the anchor
 *   circle       an ellipse drawn around the anchor element
 *   chart        the element carries its own drawing (data-thread-d in chart
 *                units, data-thread-w, -entry, -exit)
 *   park         the pen stops here until `released` is true
 * Elements carrying data-thread-note light up once the pen has passed the
 * point of the path nearest them.
 */

type Note = { el: HTMLElement; x: number; y: number; at: number };
type Sample = { len: number; x: number; y: number };

function placeNotes(notes: Note[], pts: Sample[]) {
  if (!pts.length) return;
  notes.forEach((note) => {
    let best = 0;
    let bestD = Infinity;
    pts.forEach((pt) => {
      const dd = (pt.x - note.x) ** 2 + (pt.y - note.y) ** 2;
      if (dd < bestD) {
        bestD = dd;
        best = pt.len;
      }
    });
    note.at = best;
  });
}

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export function Thread({ hostRef, released = false }: { hostRef: RefObject<HTMLElement | null>; released?: boolean }) {
  const reduced = useReducedMotion();
  const partRefs = useRef<(SVGPathElement | null)[]>([]);
  const wetRef = useRef<SVGPathElement>(null);
  const penRef = useRef<SVGGElement>(null);
  const [d, setD] = useState("");
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [visible, setVisible] = useState(false);
  const notes = useRef<Note[]>([]);
  const ptsRef = useRef<Sample[]>([]);
  const park = useRef<{ x: number; y: number } | null>(null);
  const rebuild = useRef<() => void>(() => undefined);
  const drawn = useRef(0);
  const angle = useRef(-52);
  const lift = useRef(0);

  // Measure the anchors and build the path.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const build = () => {
      const hr = host.getBoundingClientRect();
      const anchors = Array.from(host.querySelectorAll<HTMLElement>("[data-thread]"));
      if (anchors.length < 1) return;
      const f = (n: number) => n.toFixed(1);
      const pts = anchors.map((el) => {
        const r = el.getBoundingClientRect();
        const kinds = (el.dataset.thread || "").split(/\s+/);
        const top = kinds.includes("fixed") ? r.top - hr.top - window.scrollY : r.top - hr.top;
        const left = r.left - hr.left;
        if (kinds.includes("chart")) {
          const k = r.width / Number(el.dataset.threadW || 1000);
          const [ex, ey] = (el.dataset.threadEntry || "0,0").split(",").map(Number);
          const [xx, xy] = (el.dataset.threadExit || "0,0").split(",").map(Number);
          let axis = 0;
          const shape = (el.dataset.threadD || "").replace(/-?\d*\.?\d+|[MLCQZ]/g, (tok) => {
            if (/[MLCQZ]/.test(tok)) {
              axis = 0;
              return tok;
            }
            const n = Number(tok);
            const out = axis % 2 === 0 ? left + n * k : top + n * k;
            axis += 1;
            return out.toFixed(1);
          });
          return { x: left + ex * k, y: top + ey * k, kinds, shape, exit: { x: left + xx * k, y: top + xy * k } };
        }
        if (kinds.includes("circle")) {
          // A hand-drawn ellipse around the element, entered at its left.
          const cx = left + r.width / 2;
          const cy = top + r.height / 2;
          const rx = r.width / 2 + 14;
          const ry = r.height / 2 + 10;
          const kk = 0.5523;
          const shape =
            ` C ${f(cx - rx)} ${f(cy - ry * kk)}, ${f(cx - rx * kk)} ${f(cy - ry)}, ${f(cx)} ${f(cy - ry)}` +
            ` C ${f(cx + rx * kk)} ${f(cy - ry)}, ${f(cx + rx)} ${f(cy - ry * kk)}, ${f(cx + rx)} ${f(cy)}` +
            ` C ${f(cx + rx)} ${f(cy + ry * kk)}, ${f(cx + rx * kk)} ${f(cy + ry)}, ${f(cx)} ${f(cy + ry)}` +
            ` C ${f(cx - rx * kk)} ${f(cy + ry)}, ${f(cx - rx - 8)} ${f(cy + ry * kk)}, ${f(cx - rx - 4)} ${f(cy - 6)}`;
          return { x: cx - rx, y: cy, kinds, shape, exit: { x: cx - rx - 4, y: cy - 6 } };
        }
        return { x: left + r.width / 2, y: top + r.height / 2, kinds, shape: "", exit: null as { x: number; y: number } | null };
      });

      let path = `M ${f(pts[0].x)} ${f(pts[0].y)}`;
      if (pts[0].shape) path += pts[0].shape;
      for (let i = 1; i < pts.length; i += 1) {
        const prev = pts[i - 1];
        const a = prev.exit ?? prev;
        const b = pts[i];
        if (b.kinds.includes("line-end")) {
          path += ` L ${f(b.x)} ${f(b.y)}`;
        } else {
          const dy = b.y - a.y;
          const pull = Math.max(40, Math.abs(dy) * 0.55);
          if (b.kinds.includes("back")) {
            const swing = Math.min(110, Math.max(36, b.x - 28));
            const px = b.x - swing;
            const py = b.y + 140;
            path += ` C ${f(a.x)} ${f(a.y + pull)}, ${f(Math.max(12, px - 70))} ${f(py - 90)}, ${f(px)} ${f(py)}`;
            path += ` C ${f(px + 90)} ${f(py + 60)}, ${f(b.x + 40)} ${f(b.y + 80)}, ${f(b.x)} ${f(b.y)}`;
          } else {
            path += ` C ${f(a.x)} ${f(a.y + pull)}, ${f(b.x)} ${f(b.y - pull)}, ${f(b.x)} ${f(b.y)}`;
          }
        }
        if (b.shape) path += b.shape;
        if (b.kinds.includes("tick")) path += " l 0 14 l 0 -14";
        if (b.kinds.includes("knot")) {
          path += " c 22 -18 40 6 18 22 c -22 16 -46 -10 -26 -26 c 20 -16 40 8 20 22 c -14 10 -30 -2 -12 -18";
        }
        if (b.kinds.includes("scribble")) {
          const k = hr.width < 640 ? 0.55 : 1;
          const loops = [
            [60, -50, 110, 18, 50, 60],
            [-60, 42, -126, -28, -72, -72],
            [54, -44, 122, 24, 62, 66],
            [-60, 42, -104, -14, -74, -70],
            [30, -56, 96, -6, 62, 34],
            [-34, 40, -72, 8, -28, -18],
          ];
          path += loops.map((c) => ` c ${c.map((v) => f(v * k)).join(" ")}`).join("");
        }
      }
      const parkPt = pts.find((pt) => pt.kinds.includes("park"));
      park.current = parkPt ? { x: parkPt.x, y: parkPt.y } : null;
      setD(path);
      setSize({ w: hr.width, h: hr.height });
      notes.current = Array.from(host.querySelectorAll<HTMLElement>("[data-thread-note]")).map((el) => {
        const r = el.getBoundingClientRect();
        return { el, x: r.left - hr.left + r.width / 2, y: r.top - hr.top + r.height / 2, at: Infinity };
      });
      placeNotes(notes.current, ptsRef.current);
    };

    rebuild.current = build;
    build();
    document.fonts?.ready.then(build).catch(() => undefined);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(build) : null;
    ro?.observe(host);
    window.addEventListener("resize", build);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", build);
    };
  }, [hostRef]);

  // Start drawing once the section is in view.
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
      { threshold: 0.28 },
    );
    io.observe(host);
    return () => io.disconnect();
  }, [hostRef]);

  // Draw.
  useEffect(() => {
    const host = hostRef.current;
    if (!host || !d) return;
    // Dashes restart at every subpath in browsers, so each subpath is its own
    // element and all of them are driven from one cumulative length.
    const els = partRefs.current.filter((el): el is SVGPathElement => Boolean(el));
    if (!els.length) return;
    const lens = els.map((el) => el.getTotalLength());
    const starts = lens.map((_, i) => lens.slice(0, i).reduce((a, b) => a + b, 0));
    const length = lens.reduce((a, b) => a + b, 0);
    els.forEach((el, i) => {
      el.style.strokeDasharray = `${lens[i]}`;
    });
    const partAt = (len: number) => {
      let i = 0;
      while (i < lens.length - 1 && len >= starts[i] + lens[i]) i += 1;
      return i;
    };
    const pointAt = (len: number) => {
      const i = partAt(len);
      return els[i].getPointAtLength(Math.max(0, Math.min(lens[i], len - starts[i])));
    };
    const n = Math.max(200, Math.round(length / 6));
    const pts: Sample[] = Array.from({ length: n + 1 }, (_, i) => {
      const len = (i / n) * length;
      const pt = pointAt(len);
      return { len, x: pt.x, y: pt.y };
    });
    ptsRef.current = pts;
    placeNotes(notes.current, pts);

    let parkLen: number | null = null;
    if (park.current) {
      const target = park.current;
      let bestD = Infinity;
      pts.forEach((pt) => {
        const dd = (pt.x - target.x) ** 2 + (pt.y - target.y) ** 2;
        if (dd < bestD) {
          bestD = dd;
          parkLen = pt.len;
        }
      });
    }
    const cap = parkLen !== null && !released ? parkLen : length;
    const pen = penRef.current;
    const wet = wetRef.current;
    const WET = 56;
    let wetPart = -1;

    const render = (len: number, speed: number) => {
      const active = partAt(len);
      els.forEach((el, i) => {
        const local = Math.max(0, Math.min(lens[i], len - starts[i]));
        el.style.strokeDashoffset = `${lens[i] - local}`;
        el.style.opacity = local > 0.5 ? "1" : "0";
      });
      if (wet) {
        if (wetPart !== active) {
          wetPart = active;
          wet.setAttribute("d", els[active].getAttribute("d") || "");
          wet.style.strokeDasharray = `${WET} ${lens[active] + WET}`;
        }
        wet.style.strokeDashoffset = `${WET - (len - starts[active])}`;
        wet.style.opacity = len > 2 && len < length - 2 ? "1" : "0";
      }
      const p = pointAt(len);
      if (pen) {
        const q = pointAt(Math.min(starts[active] + lens[active], len + 3));
        const heading = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
        const lean = Math.max(-14, Math.min(14, (heading - 90) * 0.12));
        const wobble = Math.sin(len / 38) * 1.6;
        const scale = window.innerWidth < 640 ? 0.52 : 1;
        const hostWidth = host.getBoundingClientRect().width;
        const flipped = p.x > hostWidth - 250 * scale;
        const base = (flipped ? -128 - lean : -52 + lean) + wobble;
        angle.current += (base - angle.current) * 0.12;
        lift.current += (Math.min(1, speed / 28) - lift.current) * 0.1;
        const rad = (angle.current * Math.PI) / 180;
        pen.setAttribute(
          "transform",
          `translate(${(p.x + Math.cos(rad) * 5 * lift.current).toFixed(1)} ${(p.y + Math.sin(rad) * 5 * lift.current).toFixed(1)}) rotate(${angle.current.toFixed(1)}) scale(${(scale * (1 + lift.current * 0.03)).toFixed(3)})`,
        );
        const parked = parkLen !== null && !released && len >= parkLen - 1;
        pen.style.opacity = len > 2 && (parked || len < length - 2) ? "1" : "0";
      }
      notes.current.forEach((note) => note.el.classList.toggle("is-lit", len >= length - 1 || len >= note.at - 6));
    };

    if (reduced) {
      render(cap, 0);
      if (pen) pen.style.opacity = "0";
      if (wet) wet.style.opacity = "0";
      notes.current.forEach((note) => note.el.classList.add("is-lit"));
      return;
    }
    if (!visible) {
      render(0, 0);
      return;
    }

    // Time-based: draw from wherever the pen is to the cap, at a pen's pace.
    const from = Math.min(drawn.current, cap);
    const distance = cap - from;
    const duration = Math.max(900, Math.min(4800, (distance / 620) * 1000));
    const start = performance.now();
    let last = from;
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const len = from + distance * easeInOut(t);
      render(len, Math.abs(len - last));
      last = len;
      drawn.current = len;
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    render(from, 0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [d, hostRef, reduced, visible, released]);

  partRefs.current.length = d ? d.split(/(?=M)/).length : 0;

  if (!d) return null;
  return (
    <svg className="thread" width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`} aria-hidden="true">
      <defs>
        <PenDefs />
      </defs>
      {d.split(/(?=M)/).map((part, i) => (
        <path
          key={i}
          ref={(el) => {
            partRefs.current[i] = el;
          }}
          d={part}
          className="thread-path"
        />
      ))}
      <path ref={wetRef} d="" className="thread-wet" />
      <g ref={penRef} className="thread-pen" filter="url(#pen-shadow)">
        <PenArt />
      </g>
    </svg>
  );
}

/** A section with its own sketch. */
export function Sketched({
  as: Tag = "section",
  released,
  children,
  ...rest
}: { as?: "section" | "div"; released?: boolean; children: ReactNode } & Omit<React.HTMLAttributes<HTMLElement>, "children">) {
  const ref = useRef<HTMLElement>(null);
  return (
    <Tag ref={ref as RefObject<HTMLDivElement>} {...rest}>
      {children}
      <Thread hostRef={ref} released={released} />
    </Tag>
  );
}

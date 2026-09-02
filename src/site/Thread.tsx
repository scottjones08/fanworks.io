import { type RefObject, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../shared/useReducedMotion";
import { PenArt, PenDefs } from "./Pen";

/**
 * One line through the page, drawn by a ballpoint pen as the reader scrolls.
 *
 * Every element carrying data-thread is an anchor; the path is built through
 * them in document order. Kinds combine with spaces:
 *   fixed      the anchor sits in the fixed header; measured as at scroll 0
 *   knot       a small tangle at the anchor
 *   scribble   a large, messy tangle at the anchor
 *   back       the approach overshoots the anchor and doubles back to it
 *   line-start / line-end   a dead-straight run between the two
 * Elements carrying data-thread-note light up once the pen has reached them.
 */
export function Thread({ hostRef }: { hostRef: RefObject<HTMLElement | null> }) {
  const reduced = useReducedMotion();
  const pathRef = useRef<SVGPathElement>(null);
  const wetRef = useRef<SVGPathElement>(null);
  const penRef = useRef<SVGGElement>(null);
  const [d, setD] = useState("");
  const [size, setSize] = useState({ w: 0, h: 0 });
  const samples = useRef<{ len: number; y: number }[]>([]);
  const notes = useRef<{ el: HTMLElement; y: number }[]>([]);
  const builtHeight = useRef(0);
  const rebuild = useRef<() => void>(() => undefined);
  const drawn = useRef(0);
  const angle = useRef(-52);
  const lift = useRef(0);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const build = () => {
      const hr = host.getBoundingClientRect();
      const anchors = Array.from(host.querySelectorAll<HTMLElement>("[data-thread]"));
      if (anchors.length < 2) return;
      const pts = anchors.map((el) => {
        const r = el.getBoundingClientRect();
        const kinds = (el.dataset.thread || "").split(/\s+/);
        // A "fixed" anchor lives in the fixed header: take its position as it
        // sits at the top of the page, whatever the current scroll.
        const top = kinds.includes("fixed") ? r.top - hr.top - window.scrollY : r.top - hr.top;
        return { x: r.left - hr.left + r.width / 2, y: top + r.height / 2, kinds };
      });
      const f = (n: number) => n.toFixed(1);
      let path = `M ${f(pts[0].x)} ${f(pts[0].y)}`;
      for (let i = 1; i < pts.length; i += 1) {
        const a = pts[i - 1];
        const b = pts[i];
        if (b.kinds.includes("line-end")) {
          path += ` L ${f(b.x)} ${f(b.y)}`;
          continue;
        }
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
      setD(path);
      setSize({ w: hr.width, h: host.scrollHeight });
      builtHeight.current = host.scrollHeight;
      notes.current = Array.from(host.querySelectorAll<HTMLElement>("[data-thread-note]")).map((el) => {
        const r = el.getBoundingClientRect();
        return { el, y: r.top - hr.top + r.height / 2 };
      });
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

  useEffect(() => {
    const path = pathRef.current;
    const host = hostRef.current;
    if (!path || !host || !d) return;
    const length = path.getTotalLength();
    const n = Math.max(400, Math.round(length / 6));
    samples.current = Array.from({ length: n + 1 }, (_, i) => {
      const len = (i / n) * length;
      return { len, y: path.getPointAtLength(len).y };
    });
    path.style.strokeDasharray = `${length}`;
    const pen = penRef.current;
    const wet = wetRef.current;
    const WET = 56;
    if (wet) wet.style.strokeDasharray = `${WET} ${length + WET}`;

    if (reduced) {
      path.style.strokeDashoffset = "0";
      if (pen) pen.style.opacity = "0";
      if (wet) wet.style.opacity = "0";
      notes.current.forEach((note) => note.el.classList.add("is-lit"));
      return;
    }

    // Where the pen should be for the current scroll position.
    const targetLength = () => {
      if (Math.abs(host.scrollHeight - builtHeight.current) > 2) rebuild.current();
      const hostTop = host.getBoundingClientRect().top + window.scrollY;
      const target = window.scrollY + window.innerHeight * 0.6 - hostTop;
      const atEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      if (atEnd || target >= samples.current[samples.current.length - 1].y) return length;
      let len = 0;
      for (let i = 0; i < samples.current.length; i += 1) {
        if (samples.current[i].y >= target) break;
        len = samples.current[i].len;
      }
      return len;
    };

    const render = (len: number, speed: number) => {
      path.style.strokeDashoffset = `${length - len}`;
      if (wet) {
        // A short run of fresher, wetter ink just behind the tip.
        wet.style.strokeDashoffset = `${WET - len}`;
        wet.style.opacity = len > 2 && len < length - 2 ? "1" : "0";
      }
      const p = path.getPointAtLength(len);
      if (pen) {
        // Lean the pen a little with the direction of the stroke, breathe as it
        // writes, and lift slightly when it is travelling fast.
        const q = path.getPointAtLength(Math.min(length, len + 3));
        const heading = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
        const lean = Math.max(-14, Math.min(14, (heading - 90) * 0.12));
        const wobble = Math.sin(len / 38) * 1.6;
        const scale = window.innerWidth < 640 ? 0.7 : 1;
        const hostWidth = host.getBoundingClientRect().width;
        const flipped = p.x > hostWidth - 250 * scale;
        const base = (flipped ? -128 - lean : -52 + lean) + wobble;
        angle.current += (base - angle.current) * 0.12;
        lift.current += (Math.min(1, speed / 28) - lift.current) * 0.1;
        const rad = (angle.current * Math.PI) / 180;
        const lx = Math.cos(rad) * 5 * lift.current;
        const ly = Math.sin(rad) * 5 * lift.current;
        pen.setAttribute(
          "transform",
          `translate(${(p.x + lx).toFixed(1)} ${(p.y + ly).toFixed(1)}) rotate(${angle.current.toFixed(1)}) scale(${(scale * (1 + lift.current * 0.03)).toFixed(3)})`,
        );
        pen.style.opacity = len > 2 && len < length - 2 ? "1" : "0";
      }
      notes.current.forEach((note) => note.el.classList.toggle("is-lit", len >= length - 1 || p.y >= note.y - 8));
    };

    // The pen eases toward its target so it moves like a pen, and draws the
    // first stroke in on load instead of appearing already drawn.
    let frame = 0;
    let target = targetLength();
    const step = () => {
      const diff = target - drawn.current;
      if (Math.abs(diff) < 0.4) {
        drawn.current = target;
        render(drawn.current, 0);
        frame = 0;
        return;
      }
      const move = diff * 0.11;
      drawn.current += move;
      render(drawn.current, Math.abs(move));
      frame = requestAnimationFrame(step);
    };
    const onScroll = () => {
      target = targetLength();
      if (!frame) frame = requestAnimationFrame(step);
    };
    if (drawn.current > length) drawn.current = 0;
    frame = requestAnimationFrame(step);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [d, hostRef, reduced]);

  if (!d) return null;
  return (
    <svg className="thread" width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`} aria-hidden="true">
      <defs>
        <PenDefs />
      </defs>
      <path ref={pathRef} d={d} className="thread-path" />
      <path ref={wetRef} d={d} className="thread-wet" />
      <g ref={penRef} className="thread-pen" filter="url(#pen-shadow)">
        <PenArt />
      </g>
    </svg>
  );
}

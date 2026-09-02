import { type RefObject, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../shared/useReducedMotion";

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
  const penRef = useRef<SVGGElement>(null);
  const [d, setD] = useState("");
  const [size, setSize] = useState({ w: 0, h: 0 });
  const samples = useRef<{ len: number; y: number }[]>([]);
  const notes = useRef<{ el: HTMLElement; y: number }[]>([]);
  const builtHeight = useRef(0);
  const rebuild = useRef<() => void>(() => undefined);
  const drawn = useRef(0);
  const angle = useRef(-52);

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

    if (reduced) {
      path.style.strokeDashoffset = "0";
      if (pen) pen.style.opacity = "0";
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

    const render = (len: number) => {
      path.style.strokeDashoffset = `${length - len}`;
      const p = path.getPointAtLength(len);
      if (pen) {
        // Lean the pen a little with the direction of the stroke.
        const q = path.getPointAtLength(Math.min(length, len + 3));
        const heading = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
        const lean = Math.max(-14, Math.min(14, (heading - 90) * 0.12));
        const scale = window.innerWidth < 640 ? 0.7 : 1;
        // Near the right edge the pen switches hands so it stays on the page.
        const hostWidth = host.getBoundingClientRect().width;
        const base = p.x > hostWidth - 250 * scale ? -128 - lean : -52 + lean;
        angle.current += (base - angle.current) * 0.12;
        pen.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${angle.current.toFixed(1)}) scale(${scale})`);
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
      if (Math.abs(diff) < 0.5) {
        drawn.current = target;
        render(drawn.current);
        frame = 0;
        return;
      }
      drawn.current += diff * 0.14;
      render(drawn.current);
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
        <linearGradient id="pen-barrel" x1="0" y1="-1" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="#f4f2ec" stopOpacity="0.55" />
          <stop offset="1" stopColor="#cfcbc2" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="pen-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e6e1d6" />
          <stop offset="0.5" stopColor="#b9b3a6" />
          <stop offset="1" stopColor="#8e887c" />
        </linearGradient>
        <filter id="pen-shadow" x="-20%" y="-60%" width="140%" height="220%">
          <feDropShadow dx="2" dy="6" stdDeviation="4" floodColor="#121212" floodOpacity="0.22" />
        </filter>
      </defs>
      <path ref={pathRef} d={d} className="thread-path" />
      <g ref={penRef} className="thread-pen" filter="url(#pen-shadow)">
        {/* tip at the origin; the barrel runs along +x and is rotated into the hand */}
        <path d="M0 0 L30 -4.6 L30 4.6 Z" fill="url(#pen-cone)" />
        <path d="M0 0 L9 -1.4 L9 1.4 Z" fill="#6f6a60" />
        <rect x="29" y="-6.5" width="176" height="13" rx="2.5" fill="url(#pen-barrel)" stroke="rgba(18,18,18,0.35)" strokeWidth="1" />
        <rect x="32" y="-2.4" width="152" height="4.8" rx="2.4" className="thread-pen-ink" />
        <rect x="29" y="-6.5" width="176" height="2.6" rx="1.3" fill="#ffffff" opacity="0.7" />
        <rect x="203" y="-7" width="26" height="14" rx="3" className="thread-pen-cap" />
        <rect x="228" y="-3.4" width="8" height="6.8" rx="2" className="thread-pen-cap" />
        <path d="M208 -7 L208 -18 L226 -18 L226 -12 L214 -12 L214 -7 Z" className="thread-pen-cap" opacity="0.9" />
      </g>
    </svg>
  );
}

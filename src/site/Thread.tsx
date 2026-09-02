import { type RefObject, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../shared/useReducedMotion";

/**
 * One line through the page. Every element carrying a data-thread attribute is
 * an anchor; the path is built through them in document order. Kinds, which
 * may be combined with spaces:
 *   knot       a small tangle at the anchor
 *   scribble   a large, messy tangle at the anchor
 *   back       the approach overshoots the anchor and doubles back to it
 *   line-start / line-end   a dead-straight run between the two
 * Elements carrying data-thread-note light up once the thread has reached them.
 */
export function Thread({ hostRef }: { hostRef: RefObject<HTMLElement | null> }) {
  const reduced = useReducedMotion();
  const pathRef = useRef<SVGPathElement>(null);
  const tipRef = useRef<SVGCircleElement>(null);
  const [d, setD] = useState("");
  const [size, setSize] = useState({ w: 0, h: 0 });
  const samples = useRef<{ len: number; y: number }[]>([]);
  const notes = useRef<{ el: HTMLElement; y: number }[]>([]);
  const builtHeight = useRef(0);
  const rebuild = useRef<() => void>(() => undefined);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const build = () => {
      const hr = host.getBoundingClientRect();
      const anchors = Array.from(host.querySelectorAll<HTMLElement>("[data-thread]"));
      if (anchors.length < 2) return;
      const pts = anchors.map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left - hr.left + r.width / 2, y: r.top - hr.top + r.height / 2, kinds: (el.dataset.thread || "").split(/\s+/) };
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
          // Overshoot past the anchor, swing out into the margin, and come back up to it.
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
          path +=
            " c 60 -50 110 18 50 60 c -60 42 -126 -28 -72 -72 c 54 -44 122 24 62 66 c -60 42 -104 -14 -74 -70 c 30 -56 96 -6 62 34 c -34 40 -72 8 -28 -18";
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

    let frame = 0;
    const draw = () => {
      frame = 0;
      const tip = tipRef.current;
      if (reduced) {
        path.style.strokeDashoffset = "0";
        if (tip) tip.style.opacity = "0";
        notes.current.forEach((note) => note.el.classList.add("is-lit"));
        return;
      }
      if (Math.abs(host.scrollHeight - builtHeight.current) > 2) {
        rebuild.current();
        return;
      }
      const hostTop = host.getBoundingClientRect().top + window.scrollY;
      const target = window.scrollY + window.innerHeight * 0.6 - hostTop;
      let len = 0;
      for (let i = 0; i < samples.current.length; i += 1) {
        if (samples.current[i].y >= target) break;
        len = samples.current[i].len;
      }
      const atEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      if (atEnd || target >= samples.current[samples.current.length - 1].y) len = length;
      path.style.strokeDashoffset = `${length - len}`;
      const p = path.getPointAtLength(len);
      if (tip) {
        tip.setAttribute("cx", `${p.x}`);
        tip.setAttribute("cy", `${p.y}`);
        tip.style.opacity = len > 4 && len < length - 4 ? "1" : "0";
      }
      notes.current.forEach((note) => note.el.classList.toggle("is-lit", len >= length - 1 || target >= note.y - 8));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    draw();
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
      <path ref={pathRef} d={d} className="thread-path" />
      <circle ref={tipRef} r="5" className="thread-tip" />
    </svg>
  );
}

import { type RefObject, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../shared/useReducedMotion";

/**
 * One line through the page. Every element carrying a data-thread attribute is
 * an anchor; the path is built through them in document order, knots where
 * asked, runs straight between "line-start" and "line-end", and draws itself
 * to just below the middle of the viewport as the reader scrolls.
 */
export function Thread({ hostRef }: { hostRef: RefObject<HTMLElement | null> }) {
  const reduced = useReducedMotion();
  const pathRef = useRef<SVGPathElement>(null);
  const tipRef = useRef<SVGCircleElement>(null);
  const [d, setD] = useState("");
  const [size, setSize] = useState({ w: 0, h: 0 });
  const samples = useRef<{ len: number; y: number }[]>([]);
  const total = useRef(0);
  const builtHeight = useRef(0);
  const rebuild = useRef<() => void>(() => undefined);

  // A passive effect: the host ref is only attached once the whole tree has mounted.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const build = () => {
      const hr = host.getBoundingClientRect();
      const anchors = Array.from(host.querySelectorAll<HTMLElement>("[data-thread]"));
      if (anchors.length < 2) return;
      const pts = anchors.map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left - hr.left + r.width / 2, y: r.top - hr.top + r.height / 2, kind: el.dataset.thread || "" };
      });
      let path = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
      for (let i = 1; i < pts.length; i += 1) {
        const a = pts[i - 1];
        const b = pts[i];
        if (b.kind === "line-end") {
          path += ` L ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
          continue;
        }
        const dy = b.y - a.y;
        const pull = Math.max(40, Math.abs(dy) * 0.55);
        path += ` C ${a.x.toFixed(1)} ${(a.y + pull).toFixed(1)}, ${b.x.toFixed(1)} ${(b.y - pull).toFixed(1)}, ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
        if (b.kind === "knot") {
          path += " c 22 -18 40 6 18 22 c -22 16 -46 -10 -26 -26 c 20 -16 40 8 20 22 c -14 10 -30 -2 -12 -18";
        }
      }
      setD(path);
      setSize({ w: hr.width, h: host.scrollHeight });
      builtHeight.current = host.scrollHeight;
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

  // Sample the path once per geometry change, then map scroll to arc length.
  useEffect(() => {
    const path = pathRef.current;
    const host = hostRef.current;
    if (!path || !host || !d) return;
    const length = path.getTotalLength();
    total.current = length;
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
        return;
      }
      // Self-heal: if the document changed height without the observer firing, remeasure.
      if (Math.abs(host.scrollHeight - builtHeight.current) > 2) {
        rebuild.current();
        return;
      }
      const hostTop = host.getBoundingClientRect().top + window.scrollY;
      const target = window.scrollY + window.innerHeight * 0.58 - hostTop;
      let len = 0;
      for (let i = 0; i < samples.current.length; i += 1) {
        if (samples.current[i].y >= target) break;
        len = samples.current[i].len;
      }
      if (target >= samples.current[samples.current.length - 1].y) len = length;
      path.style.strokeDashoffset = `${length - len}`;
      if (tip) {
        const p = path.getPointAtLength(len);
        tip.setAttribute("cx", `${p.x}`);
        tip.setAttribute("cy", `${p.y}`);
        tip.style.opacity = len > 4 && len < length - 4 ? "1" : "0";
      }
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

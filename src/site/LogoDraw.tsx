import { useEffect, useRef, useState } from "react";
import { FAN_BLADE, FAN_BLADE_ROTATIONS, FAN_F } from "../shared/Logo";
import { useReducedMotion } from "../shared/useReducedMotion";
import { PenArt, PenDefs } from "./Pen";

/**
 * The fanworks mark, traced quickly by a small pen when the page loads, then
 * inked solid. Reduced motion shows the finished mark.
 */
export function LogoDraw({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const groupRef = useRef<SVGGElement>(null);
  const penRef = useRef<SVGGElement>(null);
  const [inked, setInked] = useState(false);

  useEffect(() => {
    const group = groupRef.current;
    const pen = penRef.current;
    if (!group || !pen) return;
    if (reduced) {
      setInked(true);
      return;
    }
    const paths = Array.from(group.querySelectorAll<SVGPathElement>("path"));
    const lens = paths.map((el) => el.getTotalLength());
    const total = lens.reduce((a, b) => a + b, 0);
    paths.forEach((el, i) => {
      el.style.strokeDasharray = `${lens[i]}`;
      el.style.strokeDashoffset = `${lens[i]}`;
    });
    const DUR = 720;
    const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const start = performance.now() + 120;
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.max(0, Math.min(1, (now - start) / DUR));
      let remaining = ease(t) * total;
      let px = 0;
      let py = 0;
      paths.forEach((el, i) => {
        const l = lens[i];
        const drawn = Math.max(0, Math.min(l, remaining));
        el.style.strokeDashoffset = `${l - drawn}`;
        if ((remaining > 0 && remaining <= l) || (i === paths.length - 1 && remaining > l)) {
          const pt = el.getPointAtLength(Math.min(l, drawn)).matrixTransform(el.getCTM() ?? new DOMMatrix());
          px = pt.x;
          py = pt.y;
        }
        remaining -= l;
      });
      pen.setAttribute("transform", `translate(${px.toFixed(1)} ${py.toFixed(1)}) rotate(-50) scale(0.42)`);
      pen.style.opacity = t > 0 && t < 1 ? "1" : "0";
      if (t < 1) frame = requestAnimationFrame(tick);
      else setInked(true);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);

  return (
    <svg className={`${className ?? ""} logo-draw${inked ? " is-inked" : ""}`} viewBox="0 0 128 104" aria-hidden="true">
      <defs>
        <PenDefs />
      </defs>
      <g ref={groupRef} className="logo-draw-mark">
        <path d={FAN_F} />
        {FAN_BLADE_ROTATIONS.map((deg) => (
          <path key={deg} d={FAN_BLADE} transform={deg ? `rotate(${deg} 46 100)` : undefined} />
        ))}
      </g>
      <g ref={penRef} className="logo-draw-pen">
        <PenArt />
      </g>
    </svg>
  );
}

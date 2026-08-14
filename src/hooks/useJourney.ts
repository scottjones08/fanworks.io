import { RefObject, useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

const LERP = 0.14;
const SETTLE = 0.0004;

function roomFromProgress(progress: number) {
  if (progress < 0.14) return -1;
  if (progress < 0.32) return 0;
  if (progress < 0.56) return 1;
  if (progress < 0.82) return 2;
  return 3;
}

export function useJourney(ref: RefObject<HTMLElement | null>) {
  const reduced = !!useReducedMotion();
  const [activeRoom, setActiveRoom] = useState(reduced ? 3 : -1);
  const [progress, setProgress] = useState(reduced ? 1 : 0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (reduced) {
      element.style.setProperty("--journey", "1");
      element.style.setProperty("--px", "0px");
      element.style.setProperty("--py", "0px");
      setActiveRoom(3);
      setProgress(1);
      return;
    }

    let current = 0;
    let target = 0;
    let frame = 0;

    const readTarget = () => {
      const rect = element.getBoundingClientRect();
      const distance = Math.max(1, element.offsetHeight - window.innerHeight);
      target = Math.min(1, Math.max(0, -rect.top / distance));
    };

    const tick = () => {
      current += (target - current) * LERP;
      if (Math.abs(target - current) < SETTLE) {
        current = target;
        frame = 0;
      } else {
        frame = requestAnimationFrame(tick);
      }
      element.style.setProperty("--journey", current.toFixed(4));
      setProgress(current);
      setActiveRoom(roomFromProgress(current));
    };

    const kick = () => {
      readTarget();
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      element.style.setProperty("--px", `${(x * 16).toFixed(2)}px`);
      element.style.setProperty("--py", `${(y * 10).toFixed(2)}px`);
    };

    const onPointerLeave = () => {
      element.style.setProperty("--px", "0px");
      element.style.setProperty("--py", "0px");
    };

    kick();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (finePointer) {
      window.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerleave", onPointerLeave);
    }

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [ref, reduced]);

  return { activeRoom, progress, reduced };
}

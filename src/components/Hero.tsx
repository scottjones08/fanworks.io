import { ArrowRight, ArrowsLeftRight, Fingerprint } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { type PointerEvent as ReactPointerEvent, useRef, useState } from "react";
import { scrollToId, stages } from "../content";
import { useReducedMotion } from "../hooks/useReducedMotion";

type HeroProps = {
  selectedStage: number;
  setSelectedStage: (index: number) => void;
};

export function Hero({ selectedStage, setSelectedStage }: HeroProps) {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const stage = stages[selectedStage];

  const moveKnot = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const progress = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    setSelectedStage(Math.round(progress * (stages.length - 1)));
  };

  const startDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    moveKnot(event.clientX);
  };

  const continueDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (dragging) moveKnot(event.clientX);
  };

  const stopDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const keyMove = (key: string) => {
    if (key === "ArrowLeft") setSelectedStage(Math.max(0, selectedStage - 1));
    if (key === "ArrowRight") setSelectedStage(Math.min(stages.length - 1, selectedStage + 1));
  };

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-photo" aria-hidden="true">
        <motion.img
          src="/media/mri/workday-table-hero.webp"
          alt=""
          width={2048}
          height={1152}
          initial={reduced ? false : { scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.2, 0.8, 0.2, 1] }}
        />
      </div>
      <div className="hero-vignette" aria-hidden="true" />

      <div className="hero-copy">
        <motion.p
          className="eyebrow"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.25 }}
        >
          Your operating line · Step 1 of 3
        </motion.p>
        <h1 id="hero-title">
          <motion.span
            initial={reduced ? false : { y: "105%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.75, delay: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
          >
            Where does the
          </motion.span>
          <motion.span
            initial={reduced ? false : { y: "105%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          >
            day <em>double back?</em>
          </motion.span>
        </h1>
        <motion.p
          className="hero-intro"
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.48 }}
        >
          Drag the knot to the handoff that costs your team the most. We&apos;ll start with the work,
          not the software.
        </motion.p>
        <motion.div
          className="hero-actions"
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <button className="primary-action" type="button" onClick={() => scrollToId("diagnostic")}>
            Map my day <ArrowRight size={19} weight="bold" />
          </button>
          <button className="text-action" type="button" onClick={() => scrollToId("engage")}>
            I&apos;d rather talk it through
          </button>
        </motion.div>
      </div>

      <motion.div
        className="hero-operating-line"
        initial={reduced ? false : { opacity: 0, y: 42 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 0.72, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="line-instruction">
          <span>Drag the knot</span>
          <ArrowsLeftRight size={17} weight="bold" />
          <strong>{stage.before}</strong>
        </div>
        <div className="stage-track" ref={trackRef}>
          <span className="stage-rule" aria-hidden="true" />
          {stages.map((item, index) => (
            <button
              type="button"
              key={item.id}
              className={`stage-tab${index === selectedStage ? " is-active" : ""}`}
              onClick={() => setSelectedStage(index)}
              aria-pressed={index === selectedStage}
            >
              {item.label}
            </button>
          ))}
          <motion.button
            type="button"
            className={`friction-knot${dragging ? " is-dragging" : ""}`}
            style={{ left: `${(selectedStage / (stages.length - 1)) * 100}%` }}
            animate={{ scale: dragging ? 1.12 : 1 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            onPointerDown={startDrag}
            onPointerMove={continueDrag}
            onPointerUp={stopDrag}
            onPointerCancel={stopDrag}
            onKeyDown={(event) => keyMove(event.key)}
            aria-label={`Friction at ${stage.label}. Use left and right arrow keys to move.`}
          >
            <Fingerprint size={22} weight="bold" />
            <span>Drag</span>
          </motion.button>
        </div>
        <div className="hero-line-meta">
          <span>Selected handoff</span>
          <strong>{stage.label}</strong>
          <span>{String(selectedStage + 1).padStart(2, "0")} / 07</span>
        </div>
      </motion.div>
    </section>
  );
}

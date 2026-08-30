import { ArrowsLeftRight, CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useState } from "react";
import { stages } from "../content";

type TransformationProps = { selectedStage: number };

export function Transformation({ selectedStage }: TransformationProps) {
  const [mode, setMode] = useState<"before" | "after">("before");
  const stage = stages[selectedStage];

  return (
    <section className={`transformation is-${mode}`} id="transformation" aria-labelledby="transformation-title">
      <div className="section-marker section-marker-light">
        <span>02</span>
        <i />
        <span>The shift</span>
      </div>
      <div className="transformation-head">
        <div>
          <p className="eyebrow">Same people. Better conditions.</p>
          <h2 id="transformation-title">Watch the work stop fighting itself.</h2>
        </div>
        <div className="mode-toggle" role="group" aria-label="Compare before and after">
          <button
            type="button"
            className={mode === "before" ? "is-active" : ""}
            aria-pressed={mode === "before"}
            onClick={() => setMode("before")}
          >
            Before
          </button>
          <button
            type="button"
            className={mode === "after" ? "is-active" : ""}
            aria-pressed={mode === "after"}
            onClick={() => setMode("after")}
          >
            After
          </button>
        </div>
      </div>

      <LayoutGroup>
        <div className="transformation-stage">
          <div className="transformation-line" aria-hidden="true">
            <motion.i
              initial={false}
              animate={{ scaleX: mode === "after" ? 1 : 0.42, opacity: mode === "after" ? 1 : 0.36 }}
              transition={{ duration: 0.75, ease: [0.2, 0.8, 0.2, 1] }}
            />
          </div>
          {stages.map((item, index) => (
            <motion.article
              layout
              key={item.id}
              className={`${index === selectedStage ? "is-focus" : ""} ${mode === "before" ? `chaos-${index % 4}` : ""}`}
              transition={{ type: "spring", stiffness: 160, damping: 22 }}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.label}</strong>
              {mode === "before" ? <WarningCircle size={18} /> : <CheckCircle size={18} weight="fill" />}
            </motion.article>
          ))}
        </div>
      </LayoutGroup>

      <div className="transformation-readout">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
          >
            <span>{mode === "before" ? "What the team compensates for" : "What the operating layer remembers"}</span>
            <p>{mode === "before" ? stage.before : stage.after}</p>
          </motion.div>
        </AnimatePresence>
        <button type="button" onClick={() => setMode(mode === "before" ? "after" : "before")}>
          <ArrowsLeftRight size={18} weight="bold" /> Flip the view
        </button>
      </div>
    </section>
  );
}

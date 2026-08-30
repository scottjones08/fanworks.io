import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  Fingerprint,
  LockSimple,
  Path,
  Stack,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  frictions,
  industries,
  scrollToId,
  stages,
  tools,
  type FrictionId,
  type IndustryId,
  type ToolName,
} from "../content";

type DiagnosticProps = {
  selectedStage: number;
  setSelectedStage: (index: number) => void;
  selectedTools: ToolName[];
  setSelectedTools: (tools: ToolName[]) => void;
  selectedFriction: FrictionId;
  setSelectedFriction: (friction: FrictionId) => void;
  industry: IndustryId;
  onUseBrief: () => void;
};

const stepLabels = ["Handoff", "Systems", "Friction"];

export function Diagnostic({
  selectedStage,
  setSelectedStage,
  selectedTools,
  setSelectedTools,
  selectedFriction,
  setSelectedFriction,
  industry,
  onUseBrief,
}: DiagnosticProps) {
  const [step, setStep] = useState(0);
  const stage = stages[selectedStage];
  const friction = frictions.find((item) => item.id === selectedFriction) ?? frictions[0];
  const sector = industries.find((item) => item.id === industry) ?? industries[0];

  const toggleTool = (tool: ToolName) => {
    setSelectedTools(
      selectedTools.includes(tool)
        ? selectedTools.filter((item) => item !== tool)
        : [...selectedTools, tool],
    );
  };

  const useBrief = () => {
    onUseBrief();
    scrollToId("engage");
  };

  return (
    <section className="diagnostic section-pad" id="diagnostic" aria-labelledby="diagnostic-title">
      <div className="section-marker">
        <span>01</span>
        <i />
        <span>Workday MRI</span>
      </div>

      <div className="diagnostic-heading">
        <div>
          <p className="eyebrow eyebrow-dark">Three choices · no email required</p>
          <h2 id="diagnostic-title">Let&apos;s make the invisible work visible.</h2>
        </div>
        <p>
          This is not a score. It is a fast, qualitative map of where we would start looking with
          your team.
        </p>
      </div>

      <div className="diagnostic-workspace">
        <aside className="diagnostic-spine" aria-label="Diagnostic progress">
          <p>Your map</p>
          <ol>
            {stepLabels.map((label, index) => (
              <li key={label} className={index === step ? "is-current" : index < step ? "is-done" : ""}>
                <button type="button" onClick={() => index <= step && setStep(index)} disabled={index > step}>
                  <span>{index < step ? <Check size={14} weight="bold" /> : `0${index + 1}`}</span>
                  {label}
                </button>
              </li>
            ))}
          </ol>
          <div className="diagnostic-live-readout" aria-live="polite">
            <span>Reading now</span>
            <strong>{step === 0 ? stage.label : step === 1 ? `${selectedTools.length} systems` : friction.label}</strong>
          </div>
          <small>
            <LockSimple size={14} weight="bold" /> Kept in this browser. Nothing is sent.
          </small>
        </aside>

        <div className="diagnostic-sheet">
          <AnimatePresence mode="wait">
            {step === 0 ? (
              <motion.div
                className="diagnostic-step"
                key="handoff"
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.38 }}
              >
                <div className="step-heading">
                  <span>01 / Handoff</span>
                  <h3>Where does the day double back?</h3>
                  <p>Choose the point where the team retypes, waits, chases, or works around the system.</p>
                </div>
                <div className="handoff-selector" role="listbox" aria-label="Choose the handoff to inspect">
                  {stages.map((item, index) => (
                    <motion.button
                      layout
                      type="button"
                      key={item.id}
                      className={index === selectedStage ? "is-selected" : ""}
                      onClick={() => setSelectedStage(index)}
                      aria-selected={index === selectedStage}
                      role="option"
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{item.label}</strong>
                      {index === selectedStage ? <Fingerprint size={22} weight="bold" /> : null}
                    </motion.button>
                  ))}
                </div>
                <blockquote>{stage.before}</blockquote>
              </motion.div>
            ) : null}

            {step === 1 ? (
              <motion.div
                className="diagnostic-step"
                key="systems"
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.38 }}
              >
                <div className="step-heading">
                  <span>02 / Systems</span>
                  <h3>What does the work cross?</h3>
                  <p>Select every workspace that people touch around the {stage.label.toLowerCase()} handoff.</p>
                </div>
                <div className="tool-selector" aria-label="Select systems in the path">
                  {tools.map((tool) => {
                    const selected = selectedTools.includes(tool);
                    return (
                      <motion.button
                        layout
                        type="button"
                        key={tool}
                        className={selected ? "is-selected" : ""}
                        onClick={() => toggleTool(tool)}
                        aria-pressed={selected}
                      >
                        <span>{selected ? <CheckCircle size={20} weight="fill" /> : <Stack size={20} />}</span>
                        {tool}
                      </motion.button>
                    );
                  })}
                </div>
                <p className="selection-count">
                  <strong>{selectedTools.length}</strong> places hold part of the story.
                </p>
              </motion.div>
            ) : null}

            {step === 2 ? (
              <motion.div
                className="diagnostic-step"
                key="friction"
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.38 }}
              >
                <div className="step-heading">
                  <span>03 / Friction</span>
                  <h3>What gets lost in the crossing?</h3>
                  <p>Pick the friction that best describes what the team feels—not what the software says.</p>
                </div>
                <div className="friction-selector" role="radiogroup" aria-label="Choose the primary friction">
                  {frictions.map((item) => (
                    <motion.button
                      layout
                      type="button"
                      role="radio"
                      aria-checked={selectedFriction === item.id}
                      key={item.id}
                      className={selectedFriction === item.id ? "is-selected" : ""}
                      onClick={() => setSelectedFriction(item.id)}
                    >
                      <span>{item.number}</span>
                      <div>
                        <strong>{item.label}</strong>
                        <small>{item.short}</small>
                      </div>
                      {selectedFriction === item.id ? <Check size={20} weight="bold" /> : null}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : null}

            {step === 3 ? (
              <motion.div
                className="diagnostic-result"
                key="result"
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="result-stamp">
                  <Path size={28} weight="bold" />
                  Qualitative readout
                </div>
                <p className="eyebrow eyebrow-dark">Here is what we heard</p>
                <h3>
                  Start at <em>{stage.label}</em>, where {selectedTools.length} systems amplify {friction.label.toLowerCase()}.
                </h3>
                <p>
                  For a {sector.label.toLowerCase()} team, we would first observe this handoff in the real day, trace what
                  people translate between {selectedTools.slice(0, 3).join(", ") || "their tools"}, and learn which human
                  moment the better system needs to protect.
                </p>
                <div className="result-line" aria-label="Selected operating line summary">
                  <span>{sector.label}</span>
                  <i />
                  <strong>{stage.label}</strong>
                  <i />
                  <span>{friction.label}</span>
                </div>
                <div className="result-actions">
                  <button className="primary-action" type="button" onClick={useBrief}>
                    Use this brief <ArrowRight size={19} weight="bold" />
                  </button>
                  <button className="text-action text-action-dark" type="button" onClick={() => setStep(0)}>
                    Start over
                  </button>
                </div>
                <small>No score. No invented ROI. Just a sharper first conversation.</small>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {step < 3 ? (
            <div className="diagnostic-controls">
              <button type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
                <ArrowLeft size={18} weight="bold" /> Back
              </button>
              <button
                className="next-step"
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && selectedTools.length === 0}
              >
                {step === 2 ? "See the readout" : "Next"} <ArrowRight size={18} weight="bold" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

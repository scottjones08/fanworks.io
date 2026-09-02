import "./signal.css";
import { AnimatePresence, motion } from "motion/react";
import { type FormEvent, useEffect, useState } from "react";
import {
  beliefs,
  contactEmail,
  facts,
  frictions,
  industries,
  methods,
  offers,
  stages,
  tools,
} from "../../content";
import { ConceptSwitcher } from "../../shared/ConceptSwitcher";
import { scrollTo } from "../../shared/concepts";
import { FanMark } from "../../shared/Logo";
import { useBrief } from "../../shared/useBrief";
import { useContactForm } from "../../shared/useContactForm";
import { useDocumentTheme } from "../../shared/useDocumentTheme";
import { useReducedMotion } from "../../shared/useReducedMotion";

const nav = [
  { id: "mri", label: "Workday MRI" },
  { id: "layer", label: "The layer" },
  { id: "runbook", label: "Runbook" },
  { id: "industries", label: "Industries" },
  { id: "operators", label: "Operators" },
];

/* ---------- the operating graph ---------- */

const GW = 640;
const GH = 400;
const before = [
  [70, 96],
  [250, 300],
  [340, 118],
  [150, 208],
  [480, 322],
  [420, 62],
  [572, 214],
];
const after = stages.map((_, i) => [56 + (i * (GW - 112)) / (stages.length - 1), 200]);
const toolBefore = [
  [8, 58],
  [62, 12],
  [30, 84],
  [80, 40],
  [16, 30],
  [52, 66],
  [88, 78],
  [40, 8],
  [70, 90],
  [22, 62],
];

function graphPath(points: number[][], tangle: boolean) {
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i += 1) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const bend = tangle ? (i % 2 ? 90 : -90) : 0;
    d += ` C ${x0 + (x1 - x0) * 0.4} ${y0 + bend}, ${x1 - (x1 - x0) * 0.4} ${y1 - bend}, ${x1} ${y1}`;
  }
  return d;
}

function OperatingGraph({ mode, setMode, stageIndex }: { mode: "before" | "after"; setMode: (m: "before" | "after") => void; stageIndex: number }) {
  const reduced = useReducedMotion();
  const points = mode === "before" ? before : after;
  const spring = { type: "spring", stiffness: 90, damping: 18 } as const;
  return (
    <div className={`sg-graph is-${mode}`}>
      <div className="sg-graph-bar">
        <span className="sg-dot" aria-hidden="true" />
        <span>operating-line.live</span>
        <div role="group" aria-label="Before or after" className="sg-graph-toggle">
          <button type="button" aria-pressed={mode === "before"} className={mode === "before" ? "is-on" : ""} onClick={() => setMode("before")}>
            Before
          </button>
          <button type="button" aria-pressed={mode === "after"} className={mode === "after" ? "is-on" : ""} onClick={() => setMode("after")}>
            After
          </button>
        </div>
      </div>
      <div className="sg-graph-stage">
        <svg viewBox={`0 0 ${GW} ${GH}`} aria-hidden="true">
          <defs>
            <pattern id="sg-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M32 0H0V32" fill="none" stroke="rgba(255,255,255,0.05)" />
            </pattern>
          </defs>
          <rect width={GW} height={GH} fill="url(#sg-grid)" />
          <motion.path
            className="sg-graph-edge"
            initial={false}
            animate={{ d: graphPath(points, mode === "before") }}
            transition={reduced ? { duration: 0 } : spring}
          />
          {mode === "after" && !reduced ? (
            <motion.circle
              className="sg-graph-pulse"
              r="5"
              cy={200}
              initial={{ cx: after[0][0] }}
              animate={{ cx: after[after.length - 1][0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
            />
          ) : null}
          {stages.map((s, i) => (
            <motion.g key={s.id} initial={false} animate={{ x: points[i][0], y: points[i][1] }} transition={reduced ? { duration: 0 } : { ...spring, delay: i * 0.03 }}>
              <circle r="14" className={`sg-graph-node${i === stageIndex ? " is-active" : ""}`} />
              <text y="4" textAnchor="middle" className="sg-graph-index">
                {i + 1}
              </text>
              <text y="34" textAnchor="middle" className="sg-graph-label">
                {s.label}
              </text>
            </motion.g>
          ))}
        </svg>
        <div className="sg-graph-tools" aria-hidden="true">
          {tools.map((t, i) => (
            <motion.span
              key={t}
              initial={false}
              animate={
                mode === "before"
                  ? { left: `${toolBefore[i][0]}%`, top: `${toolBefore[i][1]}%`, opacity: 0.9, rotate: (i % 3) * 4 - 4 }
                  : { left: `${6 + i * 8.9}%`, top: "84%", opacity: 0.55, rotate: 0 }
              }
              transition={reduced ? { duration: 0 } : { ...spring, delay: i * 0.02 }}
            >
              {t}
            </motion.span>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={mode}
          className="sg-graph-caption"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
        >
          {mode === "before" ? "Ten tools. Seven handoffs. People carrying the difference." : "One line. Entered once. Owned at every handoff."}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

/* ---------- Workday MRI terminal ---------- */

function Mri({ brief }: { brief: ReturnType<typeof useBrief> }) {
  return (
    <section className="sg-section sg-mri" id="mri" aria-labelledby="sg-mri-title">
      <div className="sg-section-head">
        <p className="sg-kicker">01 · Workday MRI</p>
        <h2 id="sg-mri-title">Run the diagnostic. No email required.</h2>
        <p className="sg-lede">A qualitative readout of where we would start looking with your team. Not a score, not an invented ROI.</p>
      </div>
      <div className="sg-mri-grid">
        <div className="sg-panel sg-mri-inputs">
          <div className="sg-panel-bar">
            <span className="sg-dot" />
            <span>mri.config</span>
          </div>
          <div className="sg-mri-field">
            <span className="sg-mono">01 handoff</span>
            <div role="listbox" aria-label="Handoff to inspect">
              {stages.map((s, i) => (
                <button type="button" role="option" aria-selected={i === brief.selectedStage} key={s.id} className={i === brief.selectedStage ? "is-on" : ""} onClick={() => brief.setSelectedStage(i)}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div className="sg-mri-field">
            <span className="sg-mono">02 systems</span>
            <div aria-label="Systems in the path">
              {tools.map((t) => (
                <button type="button" key={t} aria-pressed={brief.selectedTools.includes(t)} className={brief.selectedTools.includes(t) ? "is-on" : ""} onClick={() => brief.toggleTool(t)}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="sg-mri-field">
            <span className="sg-mono">03 friction</span>
            <div role="radiogroup" aria-label="Primary friction">
              {frictions.map((f) => (
                <button type="button" role="radio" aria-checked={f.id === brief.selectedFriction} key={f.id} className={f.id === brief.selectedFriction ? "is-on" : ""} onClick={() => brief.setSelectedFriction(f.id)}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="sg-panel sg-mri-output">
          <div className="sg-panel-bar">
            <span className="sg-dot" />
            <span>readout</span>
            <span className="sg-panel-bar-end">kept in this browser</span>
          </div>
          <pre className="sg-terminal" aria-live="polite">
            <span className="sg-t-prompt">$</span> fanworks mri --industry {brief.sector.id}{"\n"}
            <span className="sg-t-key">handoff </span> {brief.stage.label}{"\n"}
            <span className="sg-t-key">systems </span> {brief.selectedTools.length ? brief.selectedTools.join(", ") : "none"} <span className="sg-t-dim">({brief.selectedTools.length})</span>{"\n"}
            <span className="sg-t-key">friction</span> {brief.friction.label}{"\n"}
            <span className="sg-t-dim">────────────────────────────</span>{"\n"}
            <span className="sg-t-ok">readout</span>  Start at <b>{brief.stage.label}</b>, where {brief.selectedTools.length} systems amplify {brief.friction.label.toLowerCase()}.{"\n"}
            {"         "}{brief.stage.before}{"\n"}
            <span className="sg-t-ok">first  </span>  Observe the {brief.stage.label.toLowerCase()} handoff in the real day. Trace what people translate between {brief.selectedTools.slice(0, 3).join(", ") || "their tools"}.{"\n"}
            <span className="sg-t-ok">target </span>  {brief.stage.after}
          </pre>
          <div className="sg-mri-actions">
            <button type="button" className="sg-button" onClick={() => (brief.requestBrief(), scrollTo("contact"))}>
              Send to intake →
            </button>
            <span className="sg-mono sg-dim">Nothing is sent until you submit.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- contact ---------- */

function Contact({ brief }: { brief: ReturnType<typeof useBrief> }) {
  const form = useContactForm({ brief: brief.brief, briefVersion: brief.briefVersion, briefStatus: "Readout attached as a draft. Edit anything, then submit." });
  const submit = (event: FormEvent<HTMLFormElement>) => void form.submit(event);
  return (
    <section className="sg-section sg-contact" id="contact" aria-labelledby="sg-contact-title">
      <div className="sg-contact-grid">
        <div>
          <p className="sg-kicker">06 · Intake</p>
          <h2 id="sg-contact-title">Bring us the hard handoff.</h2>
          <p className="sg-lede">Tell us where the work doubles back. If we can help, we will say how. If we cannot, we will say that too.</p>
          <a className="sg-mono sg-mail" href={`mailto:${contactEmail}`}>
            {contactEmail} ↗
          </a>
        </div>
        <form className="sg-panel sg-form" onSubmit={submit}>
          <div className="sg-panel-bar">
            <span className="sg-dot" />
            <span>intake.form</span>
            <span className="sg-panel-bar-end">{form.state}</span>
          </div>
          <div className="sg-form-body">
            <div className="sg-form-row">
              <label>
                <span>Name</span>
                <input name="name" autoComplete="name" required disabled={form.busy} />
              </label>
              <label>
                <span>Email</span>
                <input name="email" type="email" autoComplete="email" required disabled={form.busy} />
              </label>
            </div>
            <label className="honeypot" aria-hidden="true">
              <span>Company</span>
              <input name="company" tabIndex={-1} autoComplete="off" />
            </label>
            <label>
              <span>What should we look at?</span>
              <textarea ref={form.messageRef} name="message" rows={9} required minLength={8} value={form.message} onChange={(e) => form.setMessage(e.target.value)} placeholder="The handoff that is slowing us down is…" disabled={form.busy} />
            </label>
            <div className="sg-form-foot">
              <button className="sg-button" type="submit" disabled={form.busy}>
                {form.state === "sending" ? "Sending…" : form.state === "sent" ? "Sent ✓" : "Submit →"}
              </button>
              <p role="status" aria-live="polite" className={form.state === "error" ? "is-error" : ""}>
                {form.status}
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

/* ---------- page ---------- */

export default function Signal() {
  useDocumentTheme("#0b0c10", "#0b0c10");
  const brief = useBrief();
  const reduced = useReducedMotion();
  const [mode, setMode] = useState<"before" | "after">("before");
  const [touched, setTouched] = useState(false);
  const [menu, setMenu] = useState(false);
  const active = brief.sector;

  useEffect(() => {
    if (touched || reduced) {
      if (reduced) setMode("after");
      return;
    }
    const id = window.setInterval(() => setMode((m) => (m === "before" ? "after" : "before")), 3800);
    return () => window.clearInterval(id);
  }, [touched, reduced]);

  const go = (id: string) => {
    setMenu(false);
    scrollTo(id);
  };

  return (
    <div className="sg">
      <header className="sg-nav">
        <div className="sg-nav-inner">
          <a href="#top" className="sg-brand" onClick={(e) => (e.preventDefault(), go("top"))}>
            <FanMark className="sg-mark" />
            <span>fanworks</span>
          </a>
          <nav className={`sg-links${menu ? " is-open" : ""}`} aria-label="Primary">
            {nav.map((item) => (
              <button type="button" key={item.id} onClick={() => go(item.id)}>
                {item.label}
              </button>
            ))}
          </nav>
          <div className="sg-nav-right">
            <span className="sg-status sg-mono">
              <i /> Taking engagements
            </span>
            <button type="button" className="sg-button sg-button-sm" onClick={() => go("contact")}>
              Talk to an operator
            </button>
            <button type="button" className="sg-menu" aria-expanded={menu} onClick={() => setMenu((v) => !v)}>
              {menu ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="sg-hero" aria-labelledby="sg-hero-title">
          <div className="sg-hero-copy">
            <p className="sg-kicker">
              <span className="sg-tag">AI-native operations consulting</span>
            </p>
            <h1 id="sg-hero-title">
              Your operation, <span>running on one line.</span>
            </h1>
            <p className="sg-lede">
              fanworks connects intake to invoice into a single operating layer, then adds automation and AI only where
              they earn a place. Operator-led. Built beside the people who run the day.
            </p>
            <div className="sg-hero-actions">
              <button type="button" className="sg-button" onClick={() => go("mri")}>
                Run the Workday MRI
              </button>
              <button type="button" className="sg-button sg-button-ghost" onClick={() => go("contact")}>
                Talk to an operator
              </button>
            </div>
            <ul className="sg-hero-proof sg-mono">
              <li>20+ yrs operating</li>
              <li>Founder-led → Fortune 500</li>
              <li>Richmond, VA</li>
            </ul>
          </div>
          <div
            className="sg-hero-graph"
            onPointerDown={() => setTouched(true)}
            onFocusCapture={() => setTouched(true)}
          >
            <OperatingGraph mode={mode} setMode={(m) => (setTouched(true), setMode(m))} stageIndex={brief.selectedStage} />
          </div>
        </section>

        <div className="sg-ticker" aria-hidden="true">
          <div className="sg-ticker-track">
            {[...facts, ...facts].map((f, i) => (
              <span key={`${f.label}-${i}`}>
                <b>{f.value}</b> {f.label}
              </span>
            ))}
          </div>
        </div>

        <section className="sg-section" aria-labelledby="sg-frictions-title">
          <div className="sg-section-head">
            <p className="sg-kicker">00 · What we remove</p>
            <h2 id="sg-frictions-title">Five frictions. Every operation has a mix.</h2>
          </div>
          <div className="sg-bento">
            {frictions.map((f, i) => (
              <article key={f.id} className={`sg-card${i === 0 ? " sg-card-wide" : ""}`}>
                <span className="sg-mono sg-dim">{f.number}</span>
                <FrictionGlyph index={i} />
                <h3>{f.label}</h3>
                <p>{f.short}</p>
              </article>
            ))}
          </div>
        </section>

        <Mri brief={brief} />

        <section className="sg-section" id="layer" aria-labelledby="sg-layer-title">
          <div className="sg-section-head">
            <p className="sg-kicker">02 · The data layer</p>
            <h2 id="sg-layer-title">We do not add a tool. We build the layer the work follows.</h2>
            <p className="sg-lede">CRM, shared drives, whiteboards, inboxes, the spreadsheet only one person understands, even the paper tickets. All of it comes with you.</p>
          </div>
          <div className="sg-layer" role="img" aria-label="Ten disconnected workspaces converging into one searchable, connected, owned operating layer">
            <ul className="sg-layer-sources">
              {tools.map((t) => (
                <li key={t}>
                  <span>{t}</span>
                  <i />
                </li>
              ))}
            </ul>
            <div className="sg-layer-bus" aria-hidden="true">
              <span />
            </div>
            <div className="sg-layer-result">
              <div className="sg-layer-card">
                <span className="sg-mono sg-dim">after</span>
                <strong>One operating layer</strong>
                <ul>
                  <li>Searchable</li>
                  <li>Connected</li>
                  <li>Owned</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="sg-section" id="runbook" aria-labelledby="sg-runbook-title">
          <div className="sg-section-head">
            <p className="sg-kicker">03 · Runbook</p>
            <h2 id="sg-runbook-title">We do not automate a process we have not understood.</h2>
          </div>
          <ol className="sg-runbook">
            {methods.map((m) => (
              <li key={m.number} className="sg-card">
                <span className="sg-mono sg-accent">
                  {m.number} · {m.verb.toUpperCase()}
                </span>
                <h3>{m.title}</h3>
                <p>{m.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="sg-section" id="industries" aria-labelledby="sg-industries-title">
          <div className="sg-section-head">
            <p className="sg-kicker">04 · Industries</p>
            <h2 id="sg-industries-title">Different vocabulary. Same operating problem.</h2>
          </div>
          <div className="sg-panel">
            <div className="sg-panel-bar sg-tabs" role="tablist" aria-label="Choose an industry">
              {industries.map((ind) => (
                <button type="button" role="tab" key={ind.id} aria-selected={ind.id === brief.industry} className={ind.id === brief.industry ? "is-on" : ""} onClick={() => brief.setIndustry(ind.id)}>
                  {ind.label}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={active.id} className="sg-industry" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                <div>
                  <span className="sg-mono sg-dim">{active.eyebrow}</span>
                  <h3>{active.headline}</h3>
                  <p>{active.body}</p>
                </div>
                <ol className="sg-pipeline" aria-label={`${active.label} operating line`}>
                  {active.flow.map((step, i) => (
                    <motion.li key={step} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                      <span className="sg-mono">{String(i + 1).padStart(2, "0")}</span>
                      {step}
                    </motion.li>
                  ))}
                </ol>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        <section className="sg-section" id="operators" aria-labelledby="sg-operators-title">
          <div className="sg-operators">
            <figure className="sg-operators-photo">
              <img src="/media/mri/operator-observation.webp" alt="Operators walking a working shop floor, listening to the person closest to the work" width={1800} height={1200} loading="lazy" />
              <figcaption className="sg-mono">field · observation before design</figcaption>
            </figure>
            <div className="sg-operators-copy">
              <p className="sg-kicker">05 · Operators, not vendors</p>
              <h2 id="sg-operators-title">We have lived with the system after launch.</h2>
              <p className="sg-lede">Industry executives and entrepreneurs who have built teams, run production, owned the numbers, and carried the outcome.</p>
              <ul className="sg-beliefs">
                {beliefs.map((b) => (
                  <li key={b}>“{b}”</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="sg-offers">
            {offers.map((o) => (
              <article key={o.id} className="sg-card">
                <span className="sg-mono sg-accent">{o.kicker}</span>
                <h3>{o.name}</h3>
                <p>{o.summary}</p>
                <ul className="sg-mono">
                  {o.outcomes.map((line) => (
                    <li key={line}>→ {line}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <Contact brief={brief} />
      </main>

      <footer className="sg-footer">
        <div className="sg-footer-inner sg-mono">
          <span>
            <FanMark className="sg-mark" /> fanworks · HCD Business Consulting
          </span>
          <span>Richmond, Virginia · © 2026</span>
          <span>less work between the work</span>
        </div>
      </footer>
      <ConceptSwitcher current="signal" />
    </div>
  );
}

function FrictionGlyph({ index }: { index: number }) {
  const common = { viewBox: "0 0 48 48", fill: "none", stroke: "currentColor", strokeWidth: 1.5, className: "sg-glyph", "aria-hidden": true as const };
  switch (index) {
    case 0:
      return (
        <svg {...common}>
          <rect x="4" y="14" width="14" height="20" rx="2" />
          <rect x="30" y="14" width="14" height="20" rx="2" />
          <path d="M18 24h4M26 24h4" strokeDasharray="2 3" />
        </svg>
      );
    case 1:
      return (
        <svg {...common}>
          <path d="M8 16h26l-5-5M40 32H14l5 5" />
        </svg>
      );
    case 2:
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="16" strokeDasharray="4 5" />
          <path d="M24 16v9l6 4" />
        </svg>
      );
    case 3:
      return (
        <svg {...common}>
          <path d="M6 24h10c6 0 6-10 12-10h14M6 24h10c6 0 6 10 12 10h14" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M6 24c4-7 10-11 18-11s14 4 18 11c-4 7-10 11-18 11S10 31 6 24z" />
          <path d="M10 38 38 10" />
        </svg>
      );
  }
}

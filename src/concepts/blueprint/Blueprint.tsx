import "./blueprint.css";
import { AnimatePresence, motion } from "motion/react";
import { type FormEvent, type ReactNode, useState } from "react";
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

const sheets = [
  { id: "top", no: "A-1", title: "Title sheet" },
  { id: "punch", no: "A-2", title: "Punch list" },
  { id: "sequence", no: "A-3", title: "Sequence of operations" },
  { id: "drawings", no: "A-4", title: "Industry drawings" },
  { id: "spec", no: "A-5", title: "Specification" },
  { id: "crew", no: "A-6", title: "Operators" },
  { id: "rfp", no: "A-7", title: "Request" },
] as const;

function Sheet({ no, title, id, children, className = "" }: { no: string; title: string; id: string; children: ReactNode; className?: string }) {
  return (
    <section className={`bp-sheet ${className}`} id={id} aria-labelledby={`bp-${id}-title`}>
      <div className="bp-sheet-tab" aria-hidden="true">
        <span>{no}</span>
        <span>{title}</span>
      </div>
      {children}
    </section>
  );
}

/* ---------- dimensioned drawing ---------- */

const DW = 1000;
const DH = 260;
const BOX_W = 104;
const BOX_H = 56;
const BASE = 128;
const dx = stages.map((_, i) => 30 + (i * (DW - 60 - BOX_W)) / (stages.length - 1));
const asBuilt = [0, -58, 44, -30, 62, -48, 14];

function Drawing({ selected, setSelected, layer, setLayer }: { selected: number; setSelected: (i: number) => void; layer: "asbuilt" | "design"; setLayer: (l: "asbuilt" | "design") => void }) {
  const reduced = useReducedMotion();
  const stage = stages[selected];
  const builtPath = dx
    .map((x, i) => `${i === 0 ? "M" : "L"} ${x + BOX_W / 2} ${BASE + asBuilt[i]}`)
    .join(" ");
  return (
    <div className="bp-drawing">
      <div className="bp-drawing-tools">
        <span className="bp-mono">DWG · OPERATING LINE · INTAKE → INVOICE</span>
        <div role="group" aria-label="Drawing layer" className="bp-layers">
          <button type="button" aria-pressed={layer === "asbuilt"} className={layer === "asbuilt" ? "is-on" : ""} onClick={() => setLayer("asbuilt")}>
            As-built
          </button>
          <button type="button" aria-pressed={layer === "design"} className={layer === "design" ? "is-on" : ""} onClick={() => setLayer("design")}>
            Design
          </button>
        </div>
      </div>
      <svg viewBox={`0 0 ${DW} ${DH}`} className="bp-svg" role="img" aria-label="Seven stations on one operating line, with the as-built path drawn over it">
        {/* dimension line */}
        <g className="bp-dim">
          <line x1={dx[0]} x2={dx[dx.length - 1] + BOX_W} y1={DH - 26} y2={DH - 26} />
          <line x1={dx[0]} x2={dx[0]} y1={DH - 36} y2={DH - 16} />
          <line x1={dx[dx.length - 1] + BOX_W} x2={dx[dx.length - 1] + BOX_W} y1={DH - 36} y2={DH - 16} />
          <text x={DW / 2} y={DH - 32} textAnchor="middle">
            7 HANDOFFS · 1 LINE · ENTERED ONCE
          </text>
        </g>
        {/* design line */}
        <line className="bp-design-line" x1={dx[0] + BOX_W} x2={dx[dx.length - 1]} y1={BASE + BOX_H / 2} y2={BASE + BOX_H / 2} />
        {/* as-built path */}
        <motion.path
          className="bp-built-path"
          d={builtPath}
          initial={false}
          animate={{ opacity: layer === "asbuilt" ? 1 : 0.12, pathLength: 1 }}
          transition={{ duration: reduced ? 0 : 0.5 }}
        />
        {stages.map((s, i) => {
          const x = dx[i];
          const y = BASE;
          const on = i === selected;
          return (
            <g key={s.id} className={`bp-station${on ? " is-on" : ""}`} onClick={() => setSelected(i)} tabIndex={0} role="button" aria-pressed={on} aria-label={`${s.label} station`} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setSelected(i))}>
              {on ? (
                <path
                  className="bp-cloud"
                  d={`M ${x - 12} ${y - 10} ${Array.from({ length: 9 }, (_, k) => `a 8 8 0 0 1 ${(BOX_W + 24) / 9} 0`).join(" ")} ${Array.from({ length: 5 }, () => `a 8 8 0 0 1 0 ${(BOX_H + 20) / 5}`).join(" ")} ${Array.from({ length: 9 }, () => `a 8 8 0 0 1 ${-(BOX_W + 24) / 9} 0`).join(" ")} ${Array.from({ length: 5 }, () => `a 8 8 0 0 1 0 ${-(BOX_H + 20) / 5}`).join(" ")}`}
                />
              ) : null}
              <rect x={x} y={y} width={BOX_W} height={BOX_H} />
              <text x={x + 10} y={y + 20} className="bp-station-no">
                {String(i + 1).padStart(2, "0")}
              </text>
              <text x={x + 10} y={y + 42} className="bp-station-label">
                {s.label.toUpperCase()}
              </text>
              {layer === "asbuilt" ? <circle cx={x + BOX_W / 2} cy={y + asBuilt[i]} r="4" className="bp-built-node" /> : null}
            </g>
          );
        })}
        {/* leader to callout */}
        <g className="bp-leader">
          <line x1={dx[selected] + BOX_W / 2} y1={BASE - 12} x2={dx[selected] + BOX_W / 2} y2={22} />
          <circle cx={dx[selected] + BOX_W / 2} cy={22} r="3" />
        </g>
        <text x={Math.min(DW - 8, dx[selected] + BOX_W / 2 + 10)} y={18} className="bp-leader-text" textAnchor={selected > 4 ? "end" : "start"}>
          {selected > 4 ? `${stage.label.toUpperCase()} · SEE NOTE ${selected + 1}` : `NOTE ${selected + 1} · ${stage.label.toUpperCase()}`}
        </text>
      </svg>
      <AnimatePresence mode="wait">
        <motion.div key={`${selected}-${layer}`} className="bp-note" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
          <span className="bp-mono">
            NOTE {selected + 1} · {layer === "asbuilt" ? "AS-BUILT (REV A)" : "DESIGN (REV B)"}
          </span>
          <p>{layer === "asbuilt" ? stage.before : stage.after}</p>
          <span className={`bp-stamp ${layer === "asbuilt" ? "is-issue" : "is-ok"}`}>{layer === "asbuilt" ? "ISSUE" : "RESOLVED"}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ---------- contact ---------- */

function Rfp({ brief }: { brief: ReturnType<typeof useBrief> }) {
  const form = useContactForm({ brief: brief.brief, briefVersion: brief.briefVersion, briefStatus: "Your selections were added to the request. Edit anything before you submit." });
  const submit = (event: FormEvent<HTMLFormElement>) => void form.submit(event);
  return (
    <Sheet no="A-7" title="Request" id="rfp" className="bp-rfp">
      <div className="bp-sheet-head">
        <p className="bp-kicker">Sheet A-7 · Request</p>
        <h2 id="bp-rfp-title">Issue a request. We reply with a plan, or a straight no.</h2>
      </div>
      <div className="bp-rfp-grid">
        <div className="bp-picks">
          <div className="bp-pick">
            <span className="bp-mono">01 · STATION TO INSPECT</span>
            <div role="listbox" aria-label="Handoff to inspect">
              {stages.map((s, i) => (
                <button type="button" role="option" aria-selected={i === brief.selectedStage} key={s.id} className={i === brief.selectedStage ? "is-on" : ""} onClick={() => brief.setSelectedStage(i)}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div className="bp-pick">
            <span className="bp-mono">02 · SYSTEMS IN THE PATH</span>
            <div aria-label="Systems in the path">
              {tools.map((t) => (
                <button type="button" key={t} aria-pressed={brief.selectedTools.includes(t)} className={brief.selectedTools.includes(t) ? "is-on" : ""} onClick={() => brief.toggleTool(t)}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="bp-pick">
            <span className="bp-mono">03 · PRIMARY FRICTION</span>
            <div role="radiogroup" aria-label="Primary friction">
              {frictions.map((f) => (
                <button type="button" role="radio" aria-checked={f.id === brief.selectedFriction} key={f.id} className={f.id === brief.selectedFriction ? "is-on" : ""} onClick={() => brief.setSelectedFriction(f.id)}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <button type="button" className="bp-button bp-button-ghost" onClick={brief.requestBrief}>
            Attach to request ↓
          </button>
        </div>
        <form className="bp-form" onSubmit={submit}>
          <div className="bp-form-head bp-mono">
            <span>REQUEST FORM</span>
            <span>{form.state.toUpperCase()}</span>
          </div>
          <div className="bp-form-row">
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
          <div className="bp-form-foot">
            <button className="bp-button" type="submit" disabled={form.busy}>
              {form.state === "sending" ? "Sending…" : form.state === "sent" ? "Submitted" : "Submit request"}
            </button>
            <p role="status" aria-live="polite" className={form.state === "error" ? "is-error" : ""}>
              {form.status}
            </p>
          </div>
          <p className="bp-form-alt">
            Or email <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </p>
        </form>
      </div>
    </Sheet>
  );
}

/* ---------- page ---------- */

export default function Blueprint() {
  useDocumentTheme("#eef2f6", "#eef2f6");
  const brief = useBrief();
  const [layer, setLayer] = useState<"asbuilt" | "design">("asbuilt");
  const [menu, setMenu] = useState(false);
  const active = brief.sector;
  const go = (id: string) => {
    setMenu(false);
    scrollTo(id);
  };

  return (
    <div className="bp">
      <header className="bp-nav">
        <a href="#top" className="bp-brand" onClick={(e) => (e.preventDefault(), go("top"))}>
          <FanMark className="bp-mark" />
          <span>fanworks</span>
          <small className="bp-mono">HCD BUSINESS CONSULTING</small>
        </a>
        <nav className={`bp-links${menu ? " is-open" : ""}`} aria-label="Sheets">
          {sheets.slice(1).map((s) => (
            <button type="button" key={s.id} onClick={() => go(s.id)}>
              <span className="bp-mono">{s.no}</span> {s.title}
            </button>
          ))}
        </nav>
        <button type="button" className="bp-menu bp-mono" aria-expanded={menu} onClick={() => setMenu((v) => !v)}>
          {menu ? "CLOSE" : "SHEETS"}
        </button>
      </header>

      <main>
        <Sheet no="A-1" title="Title sheet" id="top" className="bp-title">
          <div className="bp-title-grid">
            <div className="bp-title-copy">
              <p className="bp-kicker">Sheet A-1 · Title sheet · Issued for review</p>
              <h1 id="bp-top-title">
                One line through the business, <span>drawn to scale.</span>
              </h1>
              <p className="bp-lede">
                fanworks is an operator-led consultancy. We survey the day as it is actually run, draw the line from intake to invoice the way it should run, and build it with the people who own it. Automation and AI go on the drawing only where they earn a place.
              </p>
              <div className="bp-actions">
                <button type="button" className="bp-button" onClick={() => go("rfp")}>
                  Issue a request
                </button>
                <button type="button" className="bp-button bp-button-ghost" onClick={() => go("punch")}>
                  Read the punch list
                </button>
              </div>
            </div>
            <dl className="bp-titleblock" aria-label="Title block">
              <div>
                <dt>Project</dt>
                <dd>Your operating line</dd>
              </div>
              <div>
                <dt>Scope</dt>
                <dd>Intake → Invoice</dd>
              </div>
              <div>
                <dt>Drawn by</dt>
                <dd>Operators, on site</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>Richmond, VA</dd>
              </div>
              <div>
                <dt>Rev</dt>
                <dd>A → B</dd>
              </div>
              <div>
                <dt>Sheet</dt>
                <dd>1 of 7</dd>
              </div>
            </dl>
          </div>
          <Drawing selected={brief.selectedStage} setSelected={brief.setSelectedStage} layer={layer} setLayer={setLayer} />
        </Sheet>

        <Sheet no="A-2" title="Punch list" id="punch">
          <div className="bp-sheet-head">
            <p className="bp-kicker">Sheet A-2 · Punch list</p>
            <h2 id="bp-punch-title">Five items show up on every walk-through.</h2>
            <p className="bp-lede">The software is different in every building. The punch list is not. We find yours, rank each item by what it costs, and close them one handoff at a time.</p>
          </div>
          <table className="bp-table">
            <thead>
              <tr>
                <th scope="col">Item</th>
                <th scope="col">Finding</th>
                <th scope="col">Observed as</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {frictions.map((f) => (
                <tr key={f.id}>
                  <td className="bp-mono">{f.number}</td>
                  <td>
                    <strong>{f.label}</strong>
                  </td>
                  <td>{f.short}</td>
                  <td>
                    <span className="bp-stamp is-issue">OPEN</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Sheet>

        <Sheet no="A-3" title="Sequence of operations" id="sequence">
          <div className="bp-sheet-head">
            <p className="bp-kicker">Sheet A-3 · Sequence of operations</p>
            <h2 id="bp-sequence-title">We do not automate a process we have not surveyed.</h2>
          </div>
          <ol className="bp-sequence">
            {methods.map((m, i) => (
              <li key={m.number}>
                <span className="bp-seq-no">{m.number}</span>
                <div>
                  <span className="bp-mono">{m.verb.toUpperCase()}</span>
                  <h3>{m.title}</h3>
                  <p>{m.body}</p>
                </div>
                {i < methods.length - 1 ? <i className="bp-seq-arrow" aria-hidden="true" /> : null}
              </li>
            ))}
          </ol>
          <figure className="bp-photo">
            <img src="/media/mri/operator-observation.webp" alt="Two operators walking a working shop floor with the person who runs it" width={1800} height={1200} loading="lazy" />
            <figcaption className="bp-mono">FIG. 3.1 · SURVEY · OBSERVE THE DAY BEFORE DESIGNING THE SYSTEM</figcaption>
          </figure>
        </Sheet>

        <Sheet no="A-4" title="Industry drawings" id="drawings">
          <div className="bp-sheet-head">
            <p className="bp-kicker">Sheet A-4 · Industry drawings</p>
            <h2 id="bp-drawings-title">Different building. Same line.</h2>
          </div>
          <div className="bp-tabs" role="tablist" aria-label="Choose an industry drawing">
            {industries.map((ind) => (
              <button type="button" role="tab" key={ind.id} aria-selected={ind.id === brief.industry} className={ind.id === brief.industry ? "is-on" : ""} onClick={() => brief.setIndustry(ind.id)}>
                {ind.label}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={active.id} className="bp-industry" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <div className="bp-industry-copy">
                <span className="bp-mono">{active.eyebrow.toUpperCase()}</span>
                <h3>{active.headline}</h3>
                <p>{active.body}</p>
              </div>
              <ol className="bp-flow" aria-label={`${active.label} operating line`}>
                {active.flow.map((step, i) => (
                  <li key={step}>
                    <span className="bp-mono">{String(i + 1).padStart(2, "0")}</span>
                    <strong>{step}</strong>
                  </li>
                ))}
              </ol>
            </motion.div>
          </AnimatePresence>
        </Sheet>

        <Sheet no="A-5" title="Specification" id="spec">
          <div className="bp-sheet-head">
            <p className="bp-kicker">Sheet A-5 · Specification</p>
            <h2 id="bp-spec-title">Three ways to engage.</h2>
          </div>
          <div className="bp-spec">
            {offers.map((o, i) => (
              <article key={o.id}>
                <span className="bp-mono">SECTION {i + 1} · {o.kicker.toUpperCase()}</span>
                <h3>{o.name}</h3>
                <p>{o.summary}</p>
                <ul>
                  {o.outcomes.map((line, k) => (
                    <li key={line}>
                      <span className="bp-mono">
                        {i + 1}.{k + 1}
                      </span>
                      {line}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Sheet>

        <Sheet no="A-6" title="Operators" id="crew">
          <div className="bp-crew">
            <figure className="bp-photo bp-photo-crew">
              <img src="/media/mri/team-handoff.webp" alt="A team making a real handoff at an operating counter" width={1800} height={1200} loading="lazy" />
              <figcaption className="bp-mono">FIG. 6.1 · HANDOFF · THE MOMENT THE BETTER SYSTEM HAS TO PROTECT</figcaption>
            </figure>
            <div>
              <p className="bp-kicker">Sheet A-6 · Operators</p>
              <h2 id="bp-crew-title">Drawn by people who have run the building.</h2>
              <p className="bp-lede">Industry executives and entrepreneurs, from founder-led companies to the Fortune 500, who have built teams, run production, owned the numbers, and lived with the system after launch.</p>
              <dl className="bp-facts">
                {facts.map((f) => (
                  <div key={f.label}>
                    <dt>{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
              </dl>
              <ul className="bp-notes">
                {beliefs.map((b, i) => (
                  <li key={b}>
                    <span className="bp-mono">GENERAL NOTE {i + 1}</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Sheet>

        <Rfp brief={brief} />
      </main>

      <footer className="bp-footer bp-mono">
        <span>
          <FanMark className="bp-mark" /> FANWORKS · HCD BUSINESS CONSULTING
        </span>
        <span>RICHMOND, VIRGINIA · © 2026</span>
        <span>LESS WORK BETWEEN THE WORK</span>
      </footer>
      <ConceptSwitcher current="blueprint" />
    </div>
  );
}

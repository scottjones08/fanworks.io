import "./grid.css";
import { motion, useScroll, useSpring } from "motion/react";
import { type FormEvent, type PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react";
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

const rail = [
  { id: "top", label: "Intro" },
  { id: "frictions", label: "Frictions" },
  { id: "split", label: "Before / After" },
  { id: "method", label: "Method" },
  { id: "industries", label: "Industries" },
  { id: "offers", label: "Engagements" },
  { id: "operators", label: "Operators" },
  { id: "contact", label: "Contact" },
];

/* ---------- rail ---------- */

function Rail({ active, go }: { active: string; go: (id: string) => void }) {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return (
    <aside className="gd-rail" aria-label="Page sections">
      <div className="gd-rail-track" aria-hidden="true">
        <motion.i style={{ scaleY }} />
      </div>
      <ol>
        {rail.map((r, i) => (
          <li key={r.id} className={r.id === active ? "is-on" : ""}>
            <button type="button" onClick={() => go(r.id)}>
              <span>{String(i).padStart(2, "0")}</span>
              {r.label}
            </button>
          </li>
        ))}
      </ol>
    </aside>
  );
}

/* ---------- split before / after ---------- */

function Split({ selected, setSelected }: { selected: number; setSelected: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(38);
  const [dragging, setDragging] = useState(false);

  const move = (clientX: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(Math.min(96, Math.max(4, ((clientX - rect.left) / rect.width) * 100)));
  };
  const start = (e: ReactPointerEvent<HTMLButtonElement>) => {
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const stop = (e: ReactPointerEvent<HTMLButtonElement>) => {
    setDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };
  const key = (k: string) => {
    if (k === "ArrowLeft") setPos((p) => Math.max(4, p - 4));
    if (k === "ArrowRight") setPos((p) => Math.min(96, p + 4));
  };
  const stage = stages[selected];

  return (
    <div className="gd-split-wrap">
      <div className={`gd-split${dragging ? " is-dragging" : ""}`} ref={ref} onPointerMove={(e) => dragging && move(e.clientX)}>
        <div className="gd-split-pane gd-split-before" aria-hidden={pos < 8}>
          <span className="gd-split-tag">Before</span>
          <ol className="gd-split-list">
            {stages.map((s, i) => (
              <li key={s.id} className={i === selected ? "is-on" : ""} style={{ ["--tilt" as string]: `${(i % 2 ? 1 : -1) * (1 + (i % 3))}deg`, ["--shift" as string]: `${(i % 3) * 22 - 10}px` }}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <s>{s.label}</s>
              </li>
            ))}
          </ol>
        </div>
        <div className="gd-split-pane gd-split-after" style={{ clipPath: `inset(0 0 0 ${pos}%)` }} aria-hidden={pos > 92}>
          <span className="gd-split-tag">After</span>
          <ol className="gd-split-list">
            {stages.map((s, i) => (
              <li key={s.id} className={i === selected ? "is-on" : ""}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <b>{s.label}</b>
              </li>
            ))}
          </ol>
          <i className="gd-split-line" aria-hidden="true" />
        </div>
        <button
          type="button"
          className="gd-split-handle"
          style={{ left: `${pos}%` }}
          onPointerDown={start}
          onPointerUp={stop}
          onPointerCancel={stop}
          onKeyDown={(e) => key(e.key)}
          role="slider"
          aria-label="Reveal the after-state"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
        >
          <span aria-hidden="true">⟷</span>
        </button>
      </div>
      <div className="gd-split-controls">
        <div role="listbox" aria-label="Choose a handoff" className="gd-chipset">
          {stages.map((s, i) => (
            <button type="button" role="option" key={s.id} aria-selected={i === selected} className={i === selected ? "is-on" : ""} onClick={() => setSelected(i)}>
              {s.label}
            </button>
          ))}
        </div>
        <div className="gd-split-readout">
          <p>
            <span className="gd-mono">Before</span>
            {stage.before}
          </p>
          <p>
            <span className="gd-mono">After</span>
            {stage.after}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- contact ---------- */

function Contact({ brief }: { brief: ReturnType<typeof useBrief> }) {
  const form = useContactForm({ brief: brief.brief, briefVersion: brief.briefVersion, briefStatus: "Added to the message. Edit anything, then send." });
  const submit = (event: FormEvent<HTMLFormElement>) => void form.submit(event);
  return (
    <section className="gd-section gd-contact" id="contact" aria-labelledby="gd-contact-title">
      <div className="gd-head">
        <span className="gd-mono">07</span>
        <h2 id="gd-contact-title">Bring us the hard handoff.</h2>
      </div>
      <div className="gd-contact-grid">
        <div className="gd-picks">
          <p className="gd-lede">Three choices sharpen the first conversation. Nothing is sent until you send it.</p>
          <div className="gd-pick">
            <span className="gd-mono">Handoff</span>
            <div className="gd-chipset" role="listbox" aria-label="Handoff to inspect">
              {stages.map((s, i) => (
                <button type="button" role="option" aria-selected={i === brief.selectedStage} key={s.id} className={i === brief.selectedStage ? "is-on" : ""} onClick={() => brief.setSelectedStage(i)}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div className="gd-pick">
            <span className="gd-mono">Systems</span>
            <div className="gd-chipset" aria-label="Systems in the path">
              {tools.map((t) => (
                <button type="button" key={t} aria-pressed={brief.selectedTools.includes(t)} className={brief.selectedTools.includes(t) ? "is-on" : ""} onClick={() => brief.toggleTool(t)}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="gd-pick">
            <span className="gd-mono">Friction</span>
            <div className="gd-chipset" role="radiogroup" aria-label="Primary friction">
              {frictions.map((f) => (
                <button type="button" role="radio" aria-checked={f.id === brief.selectedFriction} key={f.id} className={f.id === brief.selectedFriction ? "is-on" : ""} onClick={() => brief.setSelectedFriction(f.id)}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <button type="button" className="gd-button gd-button-ghost" onClick={brief.requestBrief}>
            Add to message
          </button>
        </div>
        <form className="gd-form" onSubmit={submit}>
          <label>
            <span>Name</span>
            <input name="name" autoComplete="name" required disabled={form.busy} />
          </label>
          <label>
            <span>Email</span>
            <input name="email" type="email" autoComplete="email" required disabled={form.busy} />
          </label>
          <label className="honeypot" aria-hidden="true">
            <span>Company</span>
            <input name="company" tabIndex={-1} autoComplete="off" />
          </label>
          <label className="gd-form-message">
            <span>What should we look at?</span>
            <textarea ref={form.messageRef} name="message" rows={9} required minLength={8} value={form.message} onChange={(e) => form.setMessage(e.target.value)} placeholder="The handoff that is slowing us down is…" disabled={form.busy} />
          </label>
          <div className="gd-form-foot">
            <button className="gd-button" type="submit" disabled={form.busy}>
              {form.state === "sending" ? "Sending…" : form.state === "sent" ? "Sent" : "Send"}
            </button>
            <p role="status" aria-live="polite" className={form.state === "error" ? "is-error" : ""}>
              {form.status}
            </p>
          </div>
          <p className="gd-form-alt">
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </p>
        </form>
      </div>
    </section>
  );
}

/* ---------- page ---------- */

export default function Grid() {
  useDocumentTheme("#ffffff", "#ffffff");
  const brief = useBrief();
  const [active, setActive] = useState("top");
  const [menu, setMenu] = useState(false);
  const sector = brief.sector;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id));
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    rail.forEach((r) => {
      const node = document.getElementById(r.id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);

  const go = (id: string) => {
    setMenu(false);
    scrollTo(id);
  };

  return (
    <div className="gd">
      <header className="gd-nav">
        <a href="#top" className="gd-brand" onClick={(e) => (e.preventDefault(), go("top"))}>
          <FanMark className="gd-mark" />
          fanworks
        </a>
        <span className="gd-mono gd-nav-mid">HCD Business Consulting · Richmond, VA</span>
        <nav className={`gd-links${menu ? " is-open" : ""}`} aria-label="Primary">
          {rail.slice(1).map((r) => (
            <button type="button" key={r.id} onClick={() => go(r.id)}>
              {r.label}
            </button>
          ))}
        </nav>
        <button type="button" className="gd-menu gd-mono" aria-expanded={menu} onClick={() => setMenu((v) => !v)}>
          {menu ? "Close" : "Menu"}
        </button>
      </header>

      <Rail active={active} go={go} />

      <main className="gd-main">
        <section className="gd-section gd-hero" id="top" aria-labelledby="gd-hero-title">
          <h1 id="gd-hero-title">
            Less work
            <br />
            between
            <br />
            the work.
          </h1>
          <div className="gd-hero-side">
            <p className="gd-lede">
              fanworks is an operator-led consultancy. We sit beside the people who run the day, find where it doubles back, and rebuild one clear operating line from intake to invoice. Automation and AI only where they earn a place.
            </p>
            <div className="gd-actions">
              <button type="button" className="gd-button" onClick={() => go("contact")}>
                Start a conversation
              </button>
              <button type="button" className="gd-button gd-button-ghost" onClick={() => go("split")}>
                Drag the line
              </button>
            </div>
          </div>
          <figure className="gd-hero-photo">
            <img src="/media/mri/workday-table-hero.webp" alt="Hands sorting paper job sheets on a dark worktable" width={2048} height={1152} fetchPriority="high" />
            <figcaption className="gd-mono">The day, as it is actually run.</figcaption>
          </figure>
          <ul className="gd-facts">
            {facts.map((f) => (
              <li key={f.label}>
                <strong>{f.value}</strong>
                <span>{f.label}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="gd-section" id="frictions" aria-labelledby="gd-frictions-title">
          <div className="gd-head">
            <span className="gd-mono">01</span>
            <h2 id="gd-frictions-title">Every operation fights the same five.</h2>
          </div>
          <ol className="gd-frictions">
            {frictions.map((f) => (
              <li key={f.id}>
                <span className="gd-frictions-no">{f.number}</span>
                <h3>{f.label}</h3>
                <p>{f.short}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="gd-section" id="split" aria-labelledby="gd-split-title">
          <div className="gd-head">
            <span className="gd-mono">02</span>
            <h2 id="gd-split-title">Drag to see the day straighten out.</h2>
          </div>
          <Split selected={brief.selectedStage} setSelected={brief.setSelectedStage} />
        </section>

        <section className="gd-section" id="method" aria-labelledby="gd-method-title">
          <div className="gd-head">
            <span className="gd-mono">03</span>
            <h2 id="gd-method-title">We do not automate a process we have not understood.</h2>
          </div>
          <div className="gd-method">
            <ol className="gd-steps">
              {methods.map((m) => (
                <li key={m.number}>
                  <span className="gd-mono">{m.number}</span>
                  <h3>{m.verb}</h3>
                  <p>
                    <b>{m.title}</b> {m.body}
                  </p>
                </li>
              ))}
            </ol>
            <figure className="gd-photo">
              <img src="/media/mri/operator-observation.webp" alt="Two operators walking a shop floor with the person who runs it" width={1800} height={1200} loading="lazy" />
            </figure>
          </div>
        </section>

        <section className="gd-section" id="industries" aria-labelledby="gd-industries-title">
          <div className="gd-head">
            <span className="gd-mono">04</span>
            <h2 id="gd-industries-title">Different work. Familiar friction.</h2>
          </div>
          <div className="gd-industries">
            <div className="gd-tabs" role="tablist" aria-label="Choose an industry">
              {industries.map((ind) => (
                <button type="button" role="tab" key={ind.id} aria-selected={ind.id === brief.industry} className={ind.id === brief.industry ? "is-on" : ""} onClick={() => brief.setIndustry(ind.id)}>
                  {ind.label}
                </button>
              ))}
            </div>
            <div className="gd-industry">
              <span className="gd-mono">{sector.eyebrow}</span>
              <h3>{sector.headline}</h3>
              <p>{sector.body}</p>
              <ol className="gd-flow" aria-label={`${sector.label} operating line`}>
                {sector.flow.map((step, i) => (
                  <li key={step}>
                    <span className="gd-mono">{String(i + 1).padStart(2, "0")}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="gd-section" id="offers" aria-labelledby="gd-offers-title">
          <div className="gd-head">
            <span className="gd-mono">05</span>
            <h2 id="gd-offers-title">Three ways in.</h2>
          </div>
          <div className="gd-offers">
            {offers.map((o) => (
              <article key={o.id}>
                <span className="gd-mono">{o.kicker}</span>
                <h3>{o.name}</h3>
                <p>{o.summary}</p>
                <ul>
                  {o.outcomes.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="gd-section" id="operators" aria-labelledby="gd-operators-title">
          <div className="gd-head">
            <span className="gd-mono">06</span>
            <h2 id="gd-operators-title">Operators, working with operators.</h2>
          </div>
          <div className="gd-operators">
            <figure className="gd-photo">
              <img src="/media/mri/team-handoff.webp" alt="A team making a real handoff at an operating counter" width={1800} height={1200} loading="lazy" />
            </figure>
            <div>
              <p className="gd-lede">Industry executives and entrepreneurs, from founder-led companies to the Fortune 500, who have built teams, run production, owned the numbers, and lived with the system after launch.</p>
              <ul className="gd-beliefs">
                {beliefs.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <Contact brief={brief} />

        <footer className="gd-footer gd-mono">
          <span>fanworks · HCD Business Consulting</span>
          <span>Richmond, Virginia · © 2026</span>
          <span>Less work between the work.</span>
        </footer>
      </main>
      <ConceptSwitcher current="grid" />
    </div>
  );
}

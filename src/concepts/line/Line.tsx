import "./line.css";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { type FormEvent, useEffect, useRef, useState } from "react";
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
  { id: "approach", label: "Approach" },
  { id: "shift", label: "The line" },
  { id: "industries", label: "Industries" },
  { id: "why", label: "Why fanworks" },
];

/* ---------- the untangling line ---------- */

const W = 1000;
const H = 320;
const MID = 168;
const xs = stages.map((_, i) => 40 + (i * (W - 80)) / (stages.length - 1));
const knots = [0, -96, 74, -52, 108, -84, 26];
const bends = [0, 120, -90, 110, -130, 96, -70];

function smooth(p: number) {
  return p * p * (3 - 2 * p);
}

function linePath(progress: number) {
  const t = 1 - smooth(Math.min(1, Math.max(0, progress)));
  let d = `M ${xs[0]} ${MID + knots[0] * t}`;
  for (let i = 1; i < xs.length; i += 1) {
    const x0 = xs[i - 1];
    const x1 = xs[i];
    const y0 = MID + knots[i - 1] * t;
    const y1 = MID + knots[i] * t;
    const bend = bends[i] * t;
    const span = x1 - x0;
    d += ` C ${x0 + span * 0.72} ${y0 + bend}, ${x1 - span * 0.72} ${y1 - bend}, ${x1} ${y1}`;
  }
  return d;
}

function Shift() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setIndex(Math.min(stages.length - 1, Math.floor(p * stages.length)));
    setProgress(p);
  });
  const d = useTransform(scrollYProgress, (p) => linePath(reduced ? 1 : p));
  const dotX = useTransform(scrollYProgress, (p) => xs[0] + (xs[xs.length - 1] - xs[0]) * p);
  const stage = stages[index];
  const after = reduced || progress >= 0.5;

  return (
    <section className="ln-shift" id="shift" ref={ref} aria-labelledby="ln-shift-title">
      <div className="ln-shift-sticky">
        <div className="ln-shift-head">
          <p className="ln-kicker">02 · The shift</p>
          <h2 id="ln-shift-title">
            Keep scrolling. <em>Watch the day straighten out.</em>
          </h2>
        </div>

        <svg className="ln-line" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
          <line x1={xs[0]} x2={xs[xs.length - 1]} y1={MID} y2={MID} className="ln-line-ghost" />
          <motion.path d={d} className="ln-line-path" />
          {xs.map((x, i) => (
            <g key={stages[i].id}>
              <circle cx={x} cy={MID} r="5" className={i === index ? "ln-node is-active" : "ln-node"} />
            </g>
          ))}
          <motion.circle cx={dotX} cy={MID} r="9" className="ln-line-dot" />
        </svg>

        <ol className="ln-stations" aria-label="Stages of the operating line">
          {stages.map((item, i) => (
            <li key={item.id} className={i === index ? "is-active" : ""}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {item.label}
            </li>
          ))}
        </ol>

        <div className="ln-shift-readout" aria-live="polite">
          <p className="ln-kicker">
            {String(index + 1).padStart(2, "0")} · {stage.label} · {after ? "After" : "Before"}
          </p>
          <p className={after ? "is-after" : ""}>{after ? stage.after : stage.before}</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- brief builder + contact ---------- */

function Contact({ brief }: { brief: ReturnType<typeof useBrief> }) {
  const form = useContactForm({
    brief: brief.brief,
    briefVersion: brief.briefVersion,
    briefStatus: "Your brief is in the note. Edit anything before you send.",
  });
  const submit = (event: FormEvent<HTMLFormElement>) => void form.submit(event);

  return (
    <section className="ln-contact" id="contact" aria-labelledby="ln-contact-title">
      <div className="ln-contact-brief">
        <p className="ln-kicker">06 · Start here</p>
        <h2 id="ln-contact-title">
          Tell us where <em>to look first.</em>
        </h2>
        <p className="ln-lede">
          Three quick choices sharpen the first conversation. Nothing is sent until you decide to send it.
        </p>

        <div className="ln-choice">
          <span>Handoff</span>
          <div role="listbox" aria-label="Handoff to inspect">
            {stages.map((s, i) => (
              <button
                type="button"
                role="option"
                aria-selected={i === brief.selectedStage}
                key={s.id}
                className={i === brief.selectedStage ? "is-on" : ""}
                onClick={() => brief.setSelectedStage(i)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <div className="ln-choice">
          <span>Systems in the path</span>
          <div aria-label="Systems in the path">
            {tools.map((t) => (
              <button
                type="button"
                key={t}
                aria-pressed={brief.selectedTools.includes(t)}
                className={brief.selectedTools.includes(t) ? "is-on" : ""}
                onClick={() => brief.toggleTool(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="ln-choice">
          <span>What it feels like</span>
          <div role="radiogroup" aria-label="Primary friction">
            {frictions.map((f) => (
              <button
                type="button"
                role="radio"
                aria-checked={f.id === brief.selectedFriction}
                key={f.id}
                className={f.id === brief.selectedFriction ? "is-on" : ""}
                onClick={() => brief.setSelectedFriction(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <button type="button" className="ln-button ln-button-ghost" onClick={brief.requestBrief}>
          Put this in the note ↓
        </button>
      </div>

      <form className="ln-form" onSubmit={submit}>
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
        <label className="ln-form-message">
          <span>What is making the day heavier?</span>
          <textarea
            ref={form.messageRef}
            name="message"
            rows={9}
            required
            minLength={8}
            value={form.message}
            onChange={(e) => form.setMessage(e.target.value)}
            placeholder="The handoff that is slowing us down is…"
            disabled={form.busy}
          />
        </label>
        <div className="ln-form-foot">
          <button className="ln-button" type="submit" disabled={form.busy}>
            {form.state === "sending" ? "Sending…" : form.state === "sent" ? "Sent" : "Send the note"}
          </button>
          <p role="status" aria-live="polite" className={form.state === "error" ? "is-error" : ""}>
            {form.status}
          </p>
        </div>
        <p className="ln-form-alt">
          Or write to <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </p>
      </form>
    </section>
  );
}

/* ---------- page ---------- */

export default function Line() {
  useDocumentTheme("#f4f1ea", "#f4f1ea");
  const brief = useBrief();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const active = brief.sector;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    setMenu(false);
    scrollTo(id);
  };

  return (
    <div className="ln">
      <header className={`ln-nav${scrolled ? " is-scrolled" : ""}`}>
        <a href="#top" className="ln-brand" onClick={(e) => (e.preventDefault(), go("top"))}>
          <FanMark className="ln-mark" />
          <span>fanworks</span>
        </a>
        <nav className={`ln-links${menu ? " is-open" : ""}`} aria-label="Primary">
          {nav.map((item) => (
            <button type="button" key={item.id} onClick={() => go(item.id)}>
              {item.label}
            </button>
          ))}
          <button type="button" className="ln-nav-cta" onClick={() => go("contact")}>
            Start a conversation <span aria-hidden="true">→</span>
          </button>
        </nav>
        <button type="button" className="ln-menu" aria-expanded={menu} onClick={() => setMenu((v) => !v)}>
          {menu ? "Close" : "Menu"}
        </button>
      </header>

      <main id="top">
        <section className="ln-hero" aria-labelledby="ln-hero-title">
          <div className="ln-hero-grid">
            <h1 id="ln-hero-title">
              <motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}>
                Less work
              </motion.span>
              <motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.08, ease: [0.2, 0.8, 0.2, 1] }}>
                between
              </motion.span>
              <motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.16, ease: [0.2, 0.8, 0.2, 1] }}>
                <em>the work.</em>
              </motion.span>
            </h1>
            <motion.div
              className="ln-hero-side"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <p className="ln-lede">
                fanworks is an operator-led consultancy. We sit beside the people who run the day, find where it doubles
                back, and rebuild one clear operating line from intake to invoice.
              </p>
              <div className="ln-hero-actions">
                <button type="button" className="ln-button" onClick={() => go("contact")}>
                  Bring us the hard handoff
                </button>
                <button type="button" className="ln-textlink" onClick={() => go("shift")}>
                  See the line move ↓
                </button>
              </div>
              <ol className="ln-index" aria-label="The operating line">
                {stages.map((s, i) => (
                  <li key={s.id}>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    {s.label}
                  </li>
                ))}
              </ol>
            </motion.div>
          </div>
          <div className="ln-hero-foot">
            <span>HCD Business Consulting</span>
            <span>Richmond, Virginia</span>
            <span>Est. 2025</span>
          </div>
        </section>

        <section className="ln-frictions" id="approach" aria-labelledby="ln-frictions-title">
          <div className="ln-section-head">
            <p className="ln-kicker">01 · What we remove</p>
            <h2 id="ln-frictions-title">
              Every operation fights <em>the same five.</em>
            </h2>
            <p className="ln-lede">
              The software is different. The friction is not. We find yours, rank it by what it costs, and take it out
              one handoff at a time.
            </p>
          </div>
          <ol className="ln-ledger">
            {frictions.map((f) => (
              <li key={f.id}>
                <span className="ln-ledger-num">{f.number}</span>
                <span className="ln-ledger-label">{f.label}</span>
                <span className="ln-ledger-body">{f.short}</span>
              </li>
            ))}
          </ol>
        </section>

        <Shift />

        <section className="ln-offers" aria-labelledby="ln-offers-title">
          <div className="ln-section-head">
            <p className="ln-kicker">03 · How we engage</p>
            <h2 id="ln-offers-title">
              Three ways in. <em>One line out.</em>
            </h2>
          </div>
          <div className="ln-offer-grid">
            {offers.map((o, i) => (
              <article key={o.id}>
                <span className="ln-offer-num">{String(i + 1).padStart(2, "0")}</span>
                <p className="ln-kicker">{o.kicker}</p>
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

        <section className="ln-method" aria-labelledby="ln-method-title">
          <figure className="ln-method-photo">
            <img
              src="/media/mri/operator-observation.webp"
              alt="Two operators walking a working shop floor and listening to the person closest to the work"
              width={1800}
              height={1200}
              loading="lazy"
            />
            <figcaption>Field note · We do not automate a process we have not understood.</figcaption>
          </figure>
          <div className="ln-method-copy">
            <p className="ln-kicker">04 · How we work</p>
            <h2 id="ln-method-title">
              At the work. <em>Not around it.</em>
            </h2>
            <ol className="ln-steps">
              {methods.map((m) => (
                <li key={m.number}>
                  <span>{m.number}</span>
                  <div>
                    <h3>
                      {m.verb} <em>· {m.title}</em>
                    </h3>
                    <p>{m.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="ln-industries" id="industries" aria-labelledby="ln-industries-title">
          <div className="ln-section-head">
            <p className="ln-kicker">05 · Industries</p>
            <h2 id="ln-industries-title">
              Different work. <em>Familiar friction.</em>
            </h2>
          </div>
          <div className="ln-lens">
            <div className="ln-lens-tabs" role="tablist" aria-label="Choose an industry">
              {industries.map((ind) => (
                <button
                  type="button"
                  role="tab"
                  key={ind.id}
                  aria-selected={ind.id === brief.industry}
                  className={ind.id === brief.industry ? "is-on" : ""}
                  onClick={() => brief.setIndustry(ind.id)}
                >
                  <span>{ind.label}</span>
                  <small>{ind.eyebrow}</small>
                </button>
              ))}
            </div>
            <motion.article
              key={active.id}
              className="ln-lens-story"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h3>{active.headline}</h3>
              <p>{active.body}</p>
              <ol className="ln-flow" aria-label={`${active.label} operating line`}>
                {active.flow.map((step, i) => (
                  <li key={step}>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </motion.article>
          </div>
        </section>

        <section className="ln-why" id="why" aria-labelledby="ln-why-title">
          <div className="ln-why-grid">
            <div className="ln-why-copy">
              <p className="ln-kicker">Why fanworks</p>
              <h2 id="ln-why-title">
                Operators, <em>working with operators.</em>
              </h2>
              <p className="ln-lede">
                Our team is made of industry executives and entrepreneurs, from founder-led companies to the Fortune 500,
                who have built teams, run production, owned the numbers, and lived with the system after launch.
              </p>
              <ul className="ln-facts">
                {facts.map((f) => (
                  <li key={f.label}>
                    <strong>{f.value}</strong>
                    <span>{f.label}</span>
                  </li>
                ))}
              </ul>
            </div>
            <figure className="ln-why-photo">
              <img
                src="/media/mri/team-handoff.webp"
                alt="A team making a real handoff at an operating counter"
                width={1800}
                height={1200}
                loading="lazy"
              />
            </figure>
          </div>
          <ul className="ln-beliefs">
            {beliefs.map((b) => (
              <li key={b}>
                <em>“{b}”</em>
              </li>
            ))}
          </ul>
        </section>

        <Contact brief={brief} />
      </main>

      <footer className="ln-footer">
        <div>
          <FanMark className="ln-mark" />
          <strong>fanworks</strong>
          <span>HCD Business Consulting</span>
        </div>
        <div>
          <span>Richmond, Virginia</span>
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </div>
        <div>
          <span>© 2026 fanworks</span>
          <span>Less work between the work.</span>
        </div>
      </footer>
      <ConceptSwitcher current="line" />
    </div>
  );
}

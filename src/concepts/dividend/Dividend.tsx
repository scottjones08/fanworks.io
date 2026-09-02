import "./dividend.css";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform, type Variants } from "motion/react";
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  beliefs,
  calculatorDefaults,
  contactEmail,
  executiveOutcomes,
  facts,
  frictions,
  hcdPillars,
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
  { id: "cost", label: "The cost" },
  { id: "hcd", label: "Human-centered" },
  { id: "returns", label: "What you get back" },
  { id: "method", label: "How it works" },
  { id: "industries", label: "Industries" },
];

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const integer = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const oneDecimal = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

const rise: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] as const } }),
};

/* ---------- animated number ---------- */

function Counter({ value, format, className }: { value: number; format: (n: number) => string; className?: string }) {
  const reduced = useReducedMotion();
  const mv = useMotionValue(reduced ? value : 0);
  const spring = useSpring(mv, { stiffness: 60, damping: 20, mass: 0.8 });
  const text = useTransform(spring, (v) => format(v));
  useEffect(() => {
    mv.set(value);
  }, [mv, value]);
  return <motion.span className={className}>{reduced ? format(value) : text}</motion.span>;
}

/* ---------- calculator ---------- */

type Calc = { team: number; rate: number; hours: number };

function useCalc(calc: Calc) {
  return useMemo(() => {
    const hoursYear = calc.team * calc.hours * calculatorDefaults.weeks;
    const costYear = hoursYear * calc.rate;
    const ftes = hoursYear / calculatorDefaults.hoursPerFte;
    return { hoursYear, costYear, ftes };
  }, [calc]);
}

function Calculator({ calc, setCalc, onSend }: { calc: Calc; setCalc: (c: Calc) => void; onSend: () => void }) {
  const r = useCalc(calc);
  const fields: { key: keyof Calc; label: string; min: number; max: number; step: number; format: (n: number) => string }[] = [
    { key: "team", label: "People touching the line", min: 5, max: 500, step: 5, format: (n) => `${integer.format(n)} people` },
    { key: "rate", label: "Loaded cost per hour", min: 25, max: 250, step: 5, format: (n) => `${money.format(n)} / hr` },
    { key: "hours", label: "Hours per person, per week, lost to handoffs", min: 0.5, max: 12, step: 0.5, format: (n) => `${oneDecimal.format(n)} hrs / wk` },
  ];
  return (
    <div className="dv-calc">
      <div className="dv-calc-inputs">
        {fields.map((f) => (
          <label key={f.key} className="dv-slider">
            <span className="dv-slider-head">
              <span>{f.label}</span>
              <strong>{f.format(calc[f.key])}</strong>
            </span>
            <input
              type="range"
              min={f.min}
              max={f.max}
              step={f.step}
              value={calc[f.key]}
              onChange={(e) => setCalc({ ...calc, [f.key]: Number(e.target.value) })}
              aria-valuetext={f.format(calc[f.key])}
              style={{ ["--fill" as string]: `${((calc[f.key] - f.min) / (f.max - f.min)) * 100}%` }}
            />
          </label>
        ))}
        <p className="dv-calc-note">
          Example figures. Move the sliders to your own. Retyping, chasing, and reconciling between systems is the work we measure, over {calculatorDefaults.weeks} working weeks.
        </p>
      </div>
      <div className="dv-calc-outputs" aria-live="polite">
        <div className="dv-out dv-out-lead">
          <span>Cost of the handoff, per year</span>
          <Counter value={r.costYear} format={(n) => money.format(n)} className="dv-out-num" />
        </div>
        <div className="dv-out">
          <span>Hours lost, per year</span>
          <Counter value={r.hoursYear} format={(n) => integer.format(n)} className="dv-out-num dv-out-num-sm" />
        </div>
        <div className="dv-out">
          <span>Full-time equivalents carrying friction</span>
          <Counter value={r.ftes} format={(n) => oneDecimal.format(n)} className="dv-out-num dv-out-num-sm" />
        </div>
        <button type="button" className="dv-button" onClick={onSend}>
          Send these numbers to fanworks
        </button>
        <small>Nothing is sent until you submit the note at the bottom of the page.</small>
      </div>
    </div>
  );
}

/* ---------- drawn ring ---------- */

function Ring({ index }: { index: number }) {
  const reduced = useReducedMotion();
  return (
    <svg className="dv-ring" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="44" className="dv-ring-track" />
      <motion.circle
        cx="50"
        cy="50"
        r="44"
        className="dv-ring-arc"
        initial={{ pathLength: reduced ? 1 : 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.2, delay: index * 0.15, ease: [0.2, 0.8, 0.2, 1] }}
      />
      <text x="50" y="57" textAnchor="middle" className="dv-ring-num">
        {index + 1}
      </text>
    </svg>
  );
}

/* ---------- method with drawn line ---------- */

function Method() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });
  return (
    <ol className="dv-method" ref={ref}>
      <motion.i className="dv-method-line" style={{ scaleY }} aria-hidden="true" />
      {methods.map((m, i) => (
        <motion.li key={m.number} variants={rise} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} custom={i}>
          <span className="dv-method-dot" aria-hidden="true" />
          <span className="dv-eyebrow">
            {m.number} · {m.verb}
          </span>
          <h3>{m.title}</h3>
          <p>{m.body}</p>
        </motion.li>
      ))}
    </ol>
  );
}

/* ---------- parallax photo ---------- */

function Parallax({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-8%", "8%"]);
  return (
    <figure className="dv-parallax" ref={ref}>
      <motion.img src={src} alt={alt} width={1800} height={1200} loading="lazy" style={{ y }} />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

/* ---------- contact ---------- */

function Contact({ brief, calc }: { brief: ReturnType<typeof useBrief>; calc: Calc }) {
  const r = useCalc(calc);
  const composed = `${brief.brief}\n\nOur numbers: ${calc.team} people, ${money.format(calc.rate)}/hr loaded, ${oneDecimal.format(calc.hours)} hrs/week lost to handoffs → ${integer.format(r.hoursYear)} hours and ${money.format(r.costYear)} per year.`;
  const form = useContactForm({ brief: composed, briefVersion: brief.briefVersion, briefStatus: "Your numbers and picks are in the note. Edit anything before you send." });
  const submit = (event: FormEvent<HTMLFormElement>) => void form.submit(event);
  return (
    <section className="dv-section dv-contact" id="contact" aria-labelledby="dv-contact-title">
      <div className="dv-contact-grid">
        <div>
          <p className="dv-eyebrow">Start the conversation</p>
          <h2 id="dv-contact-title">
            Thirty minutes. <em>Your hardest handoff.</em>
          </h2>
          <p className="dv-lede dv-lede-light">Bring the handoff that costs the most. We will tell you where we would start, what it would take, and what you would get back. If we cannot help, we will say so.</p>
          <div className="dv-picks">
            <div className="dv-pick">
              <span className="dv-eyebrow">Handoff</span>
              <div role="listbox" aria-label="Handoff to inspect">
                {stages.map((s, i) => (
                  <button type="button" role="option" aria-selected={i === brief.selectedStage} key={s.id} className={i === brief.selectedStage ? "is-on" : ""} onClick={() => brief.setSelectedStage(i)}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="dv-pick">
              <span className="dv-eyebrow">Systems in the path</span>
              <div aria-label="Systems in the path">
                {tools.map((t) => (
                  <button type="button" key={t} aria-pressed={brief.selectedTools.includes(t)} className={brief.selectedTools.includes(t) ? "is-on" : ""} onClick={() => brief.toggleTool(t)}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="dv-pick">
              <span className="dv-eyebrow">What it feels like</span>
              <div role="radiogroup" aria-label="Primary friction">
                {frictions.map((f) => (
                  <button type="button" role="radio" aria-checked={f.id === brief.selectedFriction} key={f.id} className={f.id === brief.selectedFriction ? "is-on" : ""} onClick={() => brief.setSelectedFriction(f.id)}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <button type="button" className="dv-button dv-button-gold" onClick={brief.requestBrief}>
              Put this in the note
            </button>
          </div>
        </div>
        <form className="dv-form" onSubmit={submit}>
          <div className="dv-form-row">
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
            <span>What is making the day heavier?</span>
            <textarea ref={form.messageRef} name="message" rows={9} required minLength={8} value={form.message} onChange={(e) => form.setMessage(e.target.value)} placeholder="The handoff that is costing us the most is…" disabled={form.busy} />
          </label>
          <div className="dv-form-foot">
            <button className="dv-button" type="submit" disabled={form.busy}>
              {form.state === "sending" ? "Sending…" : form.state === "sent" ? "Sent" : "Send the note"}
            </button>
            <p role="status" aria-live="polite" className={form.state === "error" ? "is-error" : ""}>
              {form.status}
            </p>
          </div>
          <p className="dv-form-alt">
            Or email <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </p>
        </form>
      </div>
    </section>
  );
}

/* ---------- page ---------- */

export default function Dividend() {
  useDocumentTheme("#f7f3ea", "#5c1020");
  const brief = useBrief();
  const reduced = useReducedMotion();
  const [calc, setCalc] = useState<Calc>({ team: calculatorDefaults.team, rate: calculatorDefaults.rate, hours: calculatorDefaults.hours });
  const r = useCalc(calc);
  const [menu, setMenu] = useState(false);
  const active = brief.sector;
  const heroWords = ["Give", "your", "people", "the", "day", "back."];

  const go = (id: string) => {
    setMenu(false);
    scrollTo(id);
  };
  const sendNumbers = () => {
    brief.requestBrief();
    scrollTo("contact");
  };

  return (
    <div className="dv">
      <div className="dv-ambient" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>

      <header className="dv-nav">
        <a href="#top" className="dv-brand" onClick={(e) => (e.preventDefault(), go("top"))}>
          <FanMark className="dv-mark" />
          <span>fanworks</span>
        </a>
        <nav className={`dv-links${menu ? " is-open" : ""}`} aria-label="Primary">
          {nav.map((item) => (
            <button type="button" key={item.id} onClick={() => go(item.id)}>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="dv-nav-right">
          <button type="button" className="dv-button dv-button-sm" onClick={() => go("contact")}>
            Book thirty minutes
          </button>
          <button type="button" className="dv-menu" aria-expanded={menu} onClick={() => setMenu((v) => !v)}>
            {menu ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      <main id="top">
        <section className="dv-hero" aria-labelledby="dv-hero-title">
          <div className="dv-hero-copy">
            <motion.p className="dv-eyebrow" variants={rise} initial="hidden" animate="show" custom={0}>
              Human-centered design · for the executive who owns the number
            </motion.p>
            <h1 id="dv-hero-title">
              {heroWords.map((w, i) => (
                <span key={w} className="dv-word">
                  <motion.span initial={reduced ? false : { y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.15 + i * 0.07, ease: [0.2, 0.8, 0.2, 1] }}>
                    {w}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p className="dv-lede" variants={rise} initial="hidden" animate="show" custom={6}>
              Every handoff in your operation is paid for in hours: retyping, chasing, reconciling. fanworks is an operator-led consultancy that designs around your people first, rebuilds the line from intake to invoice, and gives the hours back. The return shows up on the P&amp;L. The relief shows up on the floor.
            </motion.p>
            <motion.div className="dv-actions" variants={rise} initial="hidden" animate="show" custom={7}>
              <button type="button" className="dv-button" onClick={() => go("cost")}>
                See what the handoff costs
              </button>
              <button type="button" className="dv-button dv-button-ghost" onClick={() => go("hcd")}>
                Why human-centered
              </button>
            </motion.div>
          </div>
          <motion.aside className="dv-hero-card" initial={reduced ? false : { opacity: 0, y: 30, rotate: 2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 0.9, delay: 0.5, ease: [0.2, 0.8, 0.2, 1] }} aria-label="Example cost of the handoff">
            <span className="dv-eyebrow">Example · {calc.team} people · {money.format(calc.rate)}/hr · {oneDecimal.format(calc.hours)} hrs/wk</span>
            <span className="dv-hero-card-label">Cost of the handoff, per year</span>
            <Counter value={r.costYear} format={(n) => money.format(n)} className="dv-hero-num" />
            <span className="dv-hero-card-sub">
              <Counter value={r.hoursYear} format={(n) => integer.format(n)} /> hours a year, carried by people instead of the system.
            </span>
            <button type="button" className="dv-textlink" onClick={() => go("cost")}>
              Use your numbers ↓
            </button>
          </motion.aside>
        </section>

        <ul className="dv-facts" aria-label="Facts">
          {facts.map((f, i) => (
            <motion.li key={f.label} variants={rise} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}>
              <strong>{f.value}</strong>
              <span>{f.label}</span>
            </motion.li>
          ))}
        </ul>

        <section className="dv-section dv-cost" id="cost" aria-labelledby="dv-cost-title">
          <div className="dv-section-head">
            <p className="dv-eyebrow">The cost of the handoff</p>
            <h2 id="dv-cost-title">
              Friction has a price. <em>Put your numbers on it.</em>
            </h2>
            <p className="dv-lede">Three sliders. Your team, your loaded rate, and the hours each person spends every week carrying work between systems. The result is the budget line you have been paying without a name.</p>
          </div>
          <Calculator calc={calc} setCalc={setCalc} onSend={sendNumbers} />
        </section>

        <section className="dv-section dv-hcd" id="hcd" aria-labelledby="dv-hcd-title">
          <div className="dv-section-head">
            <p className="dv-eyebrow dv-eyebrow-gold">Human-centered design</p>
            <h2 id="dv-hcd-title">
              Design around the people. <em>The return follows.</em>
            </h2>
            <p className="dv-lede dv-lede-light">Most technology programs fail on adoption, not on software. Human-centered design starts with the people who run the day, which is why the hours actually come back.</p>
          </div>
          <ol className="dv-pillars">
            {hcdPillars.map((p, i) => (
              <motion.li key={p.id} variants={rise} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} custom={i}>
                <Ring index={i} />
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </motion.li>
            ))}
          </ol>
          <Parallax src="/media/mri/team-handoff.webp" alt="A team making a real handoff at an operating counter" caption="The moment the better system has to protect." />
        </section>

        <section className="dv-section" id="returns" aria-labelledby="dv-returns-title">
          <div className="dv-section-head">
            <p className="dv-eyebrow">What you get back</p>
            <h2 id="dv-returns-title">
              Six returns. <em>Measured in your hours.</em>
            </h2>
          </div>
          <ul className="dv-returns">
            {executiveOutcomes.map((o, i) => (
              <motion.li key={o.id} variants={rise} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} custom={i % 3} whileHover={reduced ? undefined : { y: -6 }}>
                <span className="dv-return-no">{String(i + 1).padStart(2, "0")}</span>
                <h3>{o.title}</h3>
                <p>{o.body}</p>
              </motion.li>
            ))}
          </ul>
          <div className="dv-frictions">
            <p className="dv-eyebrow">What we remove to get there</p>
            <ul>
              {frictions.map((f) => (
                <li key={f.id}>
                  <strong>{f.label}</strong>
                  <span>{f.short}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="dv-section dv-how" id="method" aria-labelledby="dv-method-title">
          <div className="dv-how-grid">
            <div>
              <p className="dv-eyebrow">How it works</p>
              <h2 id="dv-method-title">
                Four moves. <em>No process automated before it is understood.</em>
              </h2>
              <Parallax src="/media/mri/operator-observation.webp" alt="Two operators walking a shop floor with the person who runs it" caption="Observe the day before designing the system." />
            </div>
            <Method />
          </div>
        </section>

        <section className="dv-section" id="industries" aria-labelledby="dv-industries-title">
          <div className="dv-section-head">
            <p className="dv-eyebrow">Industries</p>
            <h2 id="dv-industries-title">
              Different work. <em>The same line.</em>
            </h2>
          </div>
          <div className="dv-tabs" role="tablist" aria-label="Choose an industry">
            {industries.map((ind) => (
              <button type="button" role="tab" key={ind.id} aria-selected={ind.id === brief.industry} className={ind.id === brief.industry ? "is-on" : ""} onClick={() => brief.setIndustry(ind.id)}>
                {ind.label}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={active.id} className="dv-industry" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
              <div>
                <span className="dv-eyebrow">{active.eyebrow}</span>
                <h3>{active.headline}</h3>
                <p>{active.body}</p>
              </div>
              <ol className="dv-flow" aria-label={`${active.label} operating line`}>
                {active.flow.map((step, i) => (
                  <motion.li key={step} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07, duration: 0.3 }}>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    {step}
                  </motion.li>
                ))}
              </ol>
            </motion.div>
          </AnimatePresence>
        </section>

        <section className="dv-section dv-offers" aria-labelledby="dv-offers-title">
          <div className="dv-section-head">
            <p className="dv-eyebrow dv-eyebrow-gold">Three ways in</p>
            <h2 id="dv-offers-title">
              Start where the cost is highest. <em>Leave it owned.</em>
            </h2>
          </div>
          <div className="dv-offer-grid">
            {offers.map((o, i) => (
              <motion.article key={o.id} variants={rise} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} custom={i} whileHover={reduced ? undefined : { y: -6 }}>
                <span className="dv-eyebrow dv-eyebrow-gold">{o.kicker}</span>
                <h3>{o.name}</h3>
                <p>{o.summary}</p>
                <ul>
                  {o.outcomes.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="dv-section dv-proof" aria-labelledby="dv-proof-title">
          <blockquote>
            <p id="dv-proof-title">“{beliefs[0]}”</p>
          </blockquote>
          <div className="dv-proof-grid">
            <div>
              <p className="dv-eyebrow">Operators, working with executives</p>
              <p className="dv-lede">Industry executives and entrepreneurs, from founder-led companies to the Fortune 500, who have built teams, run production, owned the numbers, and lived with the system after launch.</p>
            </div>
            <ul className="dv-beliefs">
              {beliefs.slice(1).map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        </section>

        <Contact brief={brief} calc={calc} />
      </main>

      <footer className="dv-footer">
        <span>
          <FanMark className="dv-mark" /> fanworks · Human-centered business consulting
        </span>
        <span>Richmond, Virginia · © 2026</span>
        <span>Less work between the work.</span>
      </footer>
      <ConceptSwitcher current="dividend" />
    </div>
  );
}

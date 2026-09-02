import "./studio.css";
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
  { id: "familiar", label: "Sound familiar?" },
  { id: "how", label: "How we work" },
  { id: "line", label: "One line" },
  { id: "why", label: "Why us" },
];

const rotating = ["then the process.", "then the handoff.", "then the software.", "then the AI."];
const tints = ["st-tint-sun", "st-tint-sage", "st-tint-clay", "st-tint-pine", "st-tint-cream"];

function Badge() {
  return (
    <svg className="st-badge" viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <path id="st-badge-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
      </defs>
      <circle cx="60" cy="60" r="58" className="st-badge-bg" />
      <text className="st-badge-text">
        <textPath href="#st-badge-circle">less work between the work · operators not vendors ·</textPath>
      </text>
      <path d="M52 44l18 16-18 16z" className="st-badge-arrow" />
    </svg>
  );
}

function Rotator() {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % rotating.length), 2400);
    return () => window.clearInterval(id);
  }, [reduced]);
  return (
    <span className="st-rotator" aria-live="off">
      <AnimatePresence mode="wait" initial={false}>
        <motion.em
          key={rotating[i]}
          initial={{ y: "60%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-60%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {rotating[i]}
        </motion.em>
      </AnimatePresence>
    </span>
  );
}

function Contact({ brief }: { brief: ReturnType<typeof useBrief> }) {
  const form = useContactForm({ brief: brief.brief, briefVersion: brief.briefVersion, briefStatus: "Added to your note. Edit anything, then send when you are ready." });
  const submit = (event: FormEvent<HTMLFormElement>) => void form.submit(event);
  return (
    <section className="st-contact" id="contact" aria-labelledby="st-contact-title">
      <div className="st-contact-inner">
        <div className="st-contact-copy">
          <p className="st-kicker st-kicker-light">Say hello</p>
          <h2 id="st-contact-title">
            What is making <em>the day heavier?</em>
          </h2>
          <p className="st-lede st-lede-light">
            Tell us where the work doubles back. If we can help, we will say how. If we cannot, we will say that too.
          </p>
          <div className="st-quickpick">
            <p>Quick picks, if it helps:</p>
            <div className="st-pills" role="listbox" aria-label="Handoff to inspect">
              {stages.map((s, i) => (
                <button type="button" role="option" aria-selected={i === brief.selectedStage} key={s.id} className={i === brief.selectedStage ? "is-on" : ""} onClick={() => brief.setSelectedStage(i)}>
                  {s.label}
                </button>
              ))}
            </div>
            <div className="st-pills" role="radiogroup" aria-label="What it feels like">
              {frictions.map((f) => (
                <button type="button" role="radio" aria-checked={f.id === brief.selectedFriction} key={f.id} className={f.id === brief.selectedFriction ? "is-on" : ""} onClick={() => brief.setSelectedFriction(f.id)}>
                  {f.label}
                </button>
              ))}
            </div>
            <div className="st-pills" aria-label="Tools in the path">
              {tools.map((t) => (
                <button type="button" key={t} aria-pressed={brief.selectedTools.includes(t)} className={brief.selectedTools.includes(t) ? "is-on" : ""} onClick={() => brief.toggleTool(t)}>
                  {t}
                </button>
              ))}
            </div>
            <button type="button" className="st-button st-button-sun" onClick={brief.requestBrief}>
              Add these to my note
            </button>
          </div>
        </div>
        <form className="st-form" onSubmit={submit}>
          <label>
            <span>Your name</span>
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
          <label className="st-form-message">
            <span>What should we look at?</span>
            <textarea ref={form.messageRef} name="message" rows={8} required minLength={8} value={form.message} onChange={(e) => form.setMessage(e.target.value)} placeholder="The handoff that is slowing us down is…" disabled={form.busy} />
          </label>
          <div className="st-form-foot">
            <button className="st-button st-button-clay" type="submit" disabled={form.busy}>
              {form.state === "sending" ? "Sending…" : form.state === "sent" ? "Sent, thank you" : "Send it over"}
            </button>
            <p role="status" aria-live="polite" className={form.state === "error" ? "is-error" : ""}>
              {form.status}
            </p>
          </div>
          <p className="st-form-alt">
            Prefer email? <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </p>
        </form>
      </div>
    </section>
  );
}

export default function Studio() {
  useDocumentTheme("#f3ede3", "#f3ede3");
  const brief = useBrief();
  const [menu, setMenu] = useState(false);
  const [mode, setMode] = useState<"before" | "after">("after");
  const active = brief.sector;

  const go = (id: string) => {
    setMenu(false);
    scrollTo(id);
  };

  return (
    <div className="st">
      <header className="st-nav-wrap">
        <div className="st-nav">
          <a href="#top" className="st-brand" onClick={(e) => (e.preventDefault(), go("top"))}>
            <FanMark className="st-mark" />
            <span>fanworks</span>
          </a>
          <nav className={`st-links${menu ? " is-open" : ""}`} aria-label="Primary">
            {nav.map((item) => (
              <button type="button" key={item.id} onClick={() => go(item.id)}>
                {item.label}
              </button>
            ))}
          </nav>
          <button type="button" className="st-button st-button-clay st-nav-cta" onClick={() => go("contact")}>
            Say hello
          </button>
          <button type="button" className="st-menu" aria-expanded={menu} onClick={() => setMenu((v) => !v)}>
            {menu ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      <main id="top">
        <section className="st-hero" aria-labelledby="st-hero-title">
          <div className="st-hero-copy">
            <p className="st-kicker">Human-centered business consulting · Richmond, VA</p>
            <h1 id="st-hero-title">
              <span>Start with the person.</span>
              <Rotator />
            </h1>
            <p className="st-lede">
              We are operators who sit beside your team, find where the day doubles back, and rebuild one clear line of
              work from intake to invoice. Technology comes last, and only where it earns a place.
            </p>
            <div className="st-hero-actions">
              <button type="button" className="st-button st-button-clay" onClick={() => go("contact")}>
                Tell us about your day
              </button>
              <button type="button" className="st-button st-button-ghost" onClick={() => go("how")}>
                How we work
              </button>
            </div>
          </div>
          <div className="st-hero-art">
            <motion.figure initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}>
              <img src="/media/mri/team-handoff.webp" alt="A team making a real handoff at a wooden counter" width={1800} height={1200} fetchPriority="high" />
            </motion.figure>
            <motion.span className="st-sticker st-sticker-1" initial={{ rotate: -14, scale: 0 }} animate={{ rotate: -8, scale: 1 }} transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 14 }}>
              Operators, not vendors
            </motion.span>
            <motion.span className="st-sticker st-sticker-2" initial={{ rotate: 12, scale: 0 }} animate={{ rotate: 6, scale: 1 }} transition={{ delay: 0.65, type: "spring", stiffness: 200, damping: 14 }}>
              Intake → Invoice
            </motion.span>
            <Badge />
          </div>
        </section>

        <div className="st-marquee" aria-hidden="true">
          <div className="st-marquee-track">
            {[...industries, ...industries, ...industries].map((ind, i) => (
              <span key={`${ind.id}-${i}`}>
                {ind.label} <i>✦</i>
              </span>
            ))}
          </div>
        </div>

        <section className="st-section" id="familiar" aria-labelledby="st-familiar-title">
          <div className="st-section-head">
            <p className="st-kicker">Sound familiar?</p>
            <h2 id="st-familiar-title">
              Every operation fights <em>some mix of the same five.</em>
            </h2>
          </div>
          <ul className="st-tiles">
            {frictions.map((f, i) => (
              <motion.li key={f.id} className={`st-tile ${tints[i]}`} whileHover={{ rotate: i % 2 ? 1.2 : -1.2, y: -4 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
                <em>{f.number}</em>
                <h3>{f.label}</h3>
                <p>{f.short}</p>
              </motion.li>
            ))}
          </ul>
        </section>

        <section className="st-section st-how" id="how" aria-labelledby="st-how-title">
          <div className="st-section-head">
            <p className="st-kicker">How we work with you</p>
            <h2 id="st-how-title">
              At the work. <em>Not around it.</em>
            </h2>
            <p className="st-lede">The people closest to the work already know where it bends. We make that knowledge visible, then rebuild around it with them.</p>
          </div>
          <ol className="st-steps">
            <li className="st-step st-step-photo">
              <img src="/media/mri/operator-observation.webp" alt="Two operators walking a shop floor with the person who runs it" width={1800} height={1200} loading="lazy" />
            </li>
            {methods.map((m) => (
              <li key={m.number} className="st-step">
                <em>{m.number}</em>
                <span className="st-step-verb">{m.verb}</span>
                <h3>{m.title}</h3>
                <p>{m.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="st-section st-line" id="line" aria-labelledby="st-line-title">
          <div className="st-section-head">
            <p className="st-kicker">One line through the business</p>
            <h2 id="st-line-title">
              Pick the line <em>that looks like yours.</em>
            </h2>
          </div>
          <div className="st-pills st-pills-lg" role="tablist" aria-label="Choose an industry">
            {industries.map((ind) => (
              <button type="button" role="tab" key={ind.id} aria-selected={ind.id === brief.industry} className={ind.id === brief.industry ? "is-on" : ""} onClick={() => brief.setIndustry(ind.id)}>
                {ind.label}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={active.id} className="st-line-story" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
              <div>
                <span className="st-kicker">{active.eyebrow}</span>
                <h3>{active.headline}</h3>
                <p>{active.body}</p>
              </div>
              <div className="st-rooms-wrap">
                <div className="st-mode" role="group" aria-label="Before or after">
                  <button type="button" aria-pressed={mode === "before"} className={mode === "before" ? "is-on" : ""} onClick={() => setMode("before")}>
                    Before
                  </button>
                  <button type="button" aria-pressed={mode === "after"} className={mode === "after" ? "is-on" : ""} onClick={() => setMode("after")}>
                    After
                  </button>
                </div>
                <ol className={`st-rooms is-${mode}`} aria-label={`${active.label} operating line`}>
                  {active.flow.map((step, i) => (
                    <motion.li
                      key={step}
                      layout
                      animate={mode === "before" ? { rotate: (i % 2 ? 1 : -1) * (4 + (i % 3) * 3), y: (i % 3) * 14 - 10, x: (i % 2 ? -1 : 1) * 6 } : { rotate: 0, y: 0, x: 0 }}
                      transition={{ type: "spring", stiffness: 180, damping: 16 }}
                    >
                      <em>{String(i + 1).padStart(2, "0")}</em>
                      <strong>{step}</strong>
                    </motion.li>
                  ))}
                </ol>
                <p className="st-rooms-caption">
                  {mode === "before" ? "Every room keeps its own version of the truth." : "One line. The job arrives with the decisions, materials, and owner attached."}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
          <figure className="st-panorama">
            <div className="st-panorama-scroll">
              <img src="/one-line-through.webp" alt="Six rooms of a business, front office to close-out, joined by a single line" width={5259} height={966} loading="lazy" />
            </div>
            <figcaption>Six handoffs. One operating picture. Scroll sideways.</figcaption>
          </figure>
        </section>

        <section className="st-section st-offers" aria-labelledby="st-offers-title">
          <div className="st-section-head">
            <p className="st-kicker st-kicker-light">Three ways in</p>
            <h2 id="st-offers-title">
              Start small. <em>Leave it owned.</em>
            </h2>
          </div>
          <div className="st-offer-grid">
            {offers.map((o, i) => (
              <article key={o.id} className="st-offer">
                <em>0{i + 1}</em>
                <span className="st-kicker st-kicker-light">{o.kicker}</span>
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

        <section className="st-section st-why" id="why" aria-labelledby="st-why-title">
          <blockquote className="st-quote">
            <p id="st-why-title">“{beliefs[0]}”</p>
          </blockquote>
          <div className="st-why-grid">
            <div>
              <p className="st-kicker">Why fanworks</p>
              <h2>
                Operators, <em>working with operators.</em>
              </h2>
              <p className="st-lede">Industry executives and entrepreneurs, from founder-led companies to the Fortune 500, who have built teams, run production, owned the numbers, and lived with the system after launch.</p>
            </div>
            <ul className="st-stamps">
              {facts.map((f, i) => (
                <li key={f.label} className={tints[(i + 1) % tints.length]} style={{ rotate: `${(i % 2 ? 1 : -1) * (2 + i)}deg` }}>
                  <strong>{f.value}</strong>
                  <span>{f.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <Contact brief={brief} />
      </main>

      <footer className="st-footer">
        <div>
          <FanMark className="st-mark" />
          <strong>fanworks</strong>
        </div>
        <span>HCD Business Consulting · Richmond, Virginia</span>
        <span>© 2026 · Less work between the work.</span>
      </footer>
      <ConceptSwitcher current="studio" />
    </div>
  );
}

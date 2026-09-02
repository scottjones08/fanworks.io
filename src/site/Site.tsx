import "./site.css";
import { motion } from "motion/react";
import { type FormEvent, useMemo, useRef, useState } from "react";
import { contactEmail, frictions, industries, methods, offers, stages, tools, type FrictionId, type ToolName } from "../content";
import { FanMark } from "../shared/Logo";
import { useContactForm } from "../shared/useContactForm";
import { useDocumentTheme } from "../shared/useDocumentTheme";
import { useReducedMotion } from "../shared/useReducedMotion";
import { Thread } from "./Thread";

const ease = [0.2, 0.8, 0.2, 1] as const;

function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

function scrollTo(id: string) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
}

export default function Site() {
  useDocumentTheme("#f1f0ec", "#f1f0ec");
  const reduced = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);

  const [stage, setStage] = useState(2);
  const [friction, setFriction] = useState<FrictionId>("manual");
  const [picked, setPicked] = useState<ToolName[]>(["Email", "Sheets", "Paper"]);
  const [pickingTools, setPickingTools] = useState(false);
  const [version, setVersion] = useState(0);

  const frictionItem = frictions.find((f) => f.id === friction) ?? frictions[0];
  const toolPhrase = picked.length === 0 ? "nothing yet" : picked.length === 1 ? picked[0] : `${picked.slice(0, -1).join(", ")} and ${picked[picked.length - 1]}`;
  const sentence = useMemo(
    () => `Our day doubles back at ${stages[stage].label.toLowerCase()}. The work crosses ${toolPhrase}. It feels like ${frictionItem.label.toLowerCase()}.`,
    [stage, toolPhrase, frictionItem.label],
  );
  const form = useContactForm({
    brief: `${sentence}\n\nWhat we should look at: `,
    briefVersion: version,
    idleStatus: "",
    briefStatus: "The sentence is in your note. Add what we should know.",
  });
  const submit = (event: FormEvent<HTMLFormElement>) => void form.submit(event);

  const cycleStage = () => setStage((s) => (s + 1) % stages.length);
  const cycleFriction = () => setFriction((f) => frictions[(frictions.findIndex((x) => x.id === f) + 1) % frictions.length].id);
  const toggleTool = (t: ToolName) => setPicked((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  const heroLines = ["Less work", "between", "the work."];

  return (
    <div className="one" ref={hostRef}>
      <Thread hostRef={hostRef} />

      <header className="one-nav">
        <a href="/" className="one-brand" aria-label="fanworks home">
          <FanMark className="one-mark" />
          <span data-thread="start">fanworks</span>
        </a>
        <button type="button" className="one-link" onClick={() => scrollTo("talk")}>
          Talk to us
        </button>
      </header>

      <main>
        <section className="one-hero" aria-labelledby="one-title">
          <h1 id="one-title">
            {heroLines.map((line, i) => (
              <span className="one-mask" key={line}>
                <motion.span
                  initial={reduced ? false : { y: "108%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, delay: 0.1 + i * 0.12, ease }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            className="one-hero-text"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease }}
          >
            fanworks is an operator-led consultancy in Richmond, Virginia. We find where the day doubles back and rebuild
            one line through the business, with the people who run it.
            <span data-thread="hero" className="one-anchor" />
          </motion.p>
        </section>

        <section className="one-tangle" aria-labelledby="one-tangle-title">
          <Reveal>
            <h2 id="one-tangle-title">
              Your people carry the work <em>between systems that never meet.</em>
            </h2>
          </Reveal>
          <ol className="one-frictions">
            {frictions.map((f, i) => (
              <Reveal key={f.id} delay={i * 0.05}>
                <li>
                  <span data-thread="knot" className="one-anchor" />
                  <strong>{f.label}</strong>
                  <span>{f.short}</span>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        <section className="one-line" aria-labelledby="one-line-title">
          <Reveal>
            <h2 id="one-line-title">One line through the business.</h2>
          </Reveal>
          <div className="one-rule">
            <span data-thread="line-start" className="one-anchor one-anchor-left" />
            <span data-thread="line-end" className="one-anchor one-anchor-right" />
            <ol className="one-stations" aria-label="Seven handoffs, intake to invoice">
              {stages.map((s, i) => (
                <li key={s.id}>
                  <button type="button" className={i === stage ? "is-on" : ""} aria-pressed={i === stage} onClick={() => setStage(i)} onMouseEnter={() => setStage(i)} onFocus={() => setStage(i)}>
                    {s.label}
                  </button>
                </li>
              ))}
            </ol>
          </div>
          <div className="one-shift" aria-live="polite">
            <p className="one-before">{stages[stage].before}</p>
            <p className="one-after">{stages[stage].after}</p>
          </div>
        </section>

        <section className="one-method" aria-labelledby="one-method-title">
          <figure className="one-photo">
            <img src="/media/mri/operator-observation.webp" alt="Two operators walking a working shop floor, listening to the person who runs it" width={1800} height={1200} loading="lazy" />
          </figure>
          <div className="one-steps">
            <Reveal>
              <h2 id="one-method-title">We sit beside the people who run the day.</h2>
            </Reveal>
            <ol>
              {methods.map((m, i) => (
                <Reveal key={m.number} delay={i * 0.06}>
                  <li>
                    <span data-thread="dot" className="one-dot" />
                    <h3>{m.verb}</h3>
                    <p>{m.body}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        <section className="one-where" aria-label="Industries and engagements">
          <Reveal>
            <p className="one-industries">
              {industries.map((ind, i) => (
                <span key={ind.id}>
                  <b>{ind.label}.</b> {ind.eyebrow.replace(" · ", " and ").replace(/ and (\w)/, (m, c: string) => ` and ${c.toLowerCase()}`)}.
                  {i < industries.length - 1 ? " " : ""}
                </span>
              ))}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ol className="one-offers">
              {offers.map((o) => (
                <li key={o.id}>
                  <strong>{o.name}</strong>
                  <span>{o.summary}</span>
                </li>
              ))}
              <span data-thread="offers" className="one-anchor" />
            </ol>
          </Reveal>
        </section>

        <section className="one-quote" aria-label="What we believe">
          <figure className="one-photo one-photo-wide">
            <img src="/media/mri/team-handoff.webp" alt="A team making a real handoff at an operating counter" width={1800} height={1200} loading="lazy" />
          </figure>
          <Reveal>
            <blockquote>
              <p>
                The goal is not more technology. <em>It is less work between the work.</em>
              </p>
              <cite>
                Operators, not vendors. Twenty years improving operations, founder-led companies to the Fortune 500.
                <span data-thread="quote" className="one-anchor" />
              </cite>
            </blockquote>
          </Reveal>
        </section>

        <section className="one-talk" id="talk" aria-labelledby="one-talk-title">
          <Reveal>
            <h2 id="one-talk-title">Bring us the hard handoff.</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="one-sentence">
              Our day doubles back at{" "}
              <button type="button" className="one-blank" onClick={cycleStage} aria-label={`Handoff: ${stages[stage].label}. Click to change.`}>
                {stages[stage].label.toLowerCase()}
              </button>
              . The work crosses{" "}
              <button type="button" className="one-blank" onClick={() => setPickingTools((v) => !v)} aria-expanded={pickingTools} aria-label={`Systems: ${toolPhrase}. Click to change.`}>
                {toolPhrase}
              </button>
              . It feels like{" "}
              <button type="button" className="one-blank" onClick={cycleFriction} aria-label={`Friction: ${frictionItem.label}. Click to change.`}>
                {frictionItem.label.toLowerCase()}
              </button>
              .
            </p>
            {pickingTools ? (
              <div className="one-tools" role="group" aria-label="Systems the work crosses">
                {tools.map((t) => (
                  <button type="button" key={t} aria-pressed={picked.includes(t)} className={picked.includes(t) ? "is-on" : ""} onClick={() => toggleTool(t)}>
                    {t}
                  </button>
                ))}
              </div>
            ) : null}
            <button type="button" className="one-link one-link-quiet" onClick={() => setVersion((v) => v + 1)}>
              Put this sentence in the note
            </button>
          </Reveal>

          <form className="one-form" onSubmit={submit}>
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
            <label className="one-form-message">
              <span>What should we look at?</span>
              <textarea ref={form.messageRef} name="message" rows={6} required minLength={8} value={form.message} onChange={(e) => form.setMessage(e.target.value)} placeholder="The handoff that costs us the most is…" disabled={form.busy} />
            </label>
            <div className="one-form-foot">
              <button className="one-send" type="submit" disabled={form.busy}>
                <span data-thread="end" className="one-send-dot" aria-hidden="true" />
                {form.state === "sending" ? "Sending" : form.state === "sent" ? "Sent" : "Send"}
              </button>
              <p role="status" aria-live="polite" className={form.state === "error" ? "is-error" : ""}>
                {form.status}
              </p>
            </div>
          </form>
        </section>
      </main>

      <footer className="one-foot">
        <span>fanworks · Human-centered business consulting</span>
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        <span>Richmond, Virginia</span>
      </footer>
    </div>
  );
}

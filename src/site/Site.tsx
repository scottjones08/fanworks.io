import "./site.css";
import { motion } from "motion/react";
import { type FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { contactEmail, frictions, industries, methods, offers, stages, tools, type FrictionId, type ToolName } from "../content";
import { useContactForm } from "../shared/useContactForm";
import { useDocumentTheme } from "../shared/useDocumentTheme";
import { useReducedMotion } from "../shared/useReducedMotion";
import { Flowchart } from "./Flowchart";
import { LogoDraw } from "./LogoDraw";
import { InkBurst } from "./InkBurst";
import { Sketched } from "./Thread";

const ease = [0.2, 0.8, 0.2, 1] as const;

function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
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
  const today = useMemo(() => new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), []);
  const [narrow, setNarrow] = useState(() => window.innerWidth <= 900);
  useEffect(() => {
    const sync = () => setNarrow(window.innerWidth <= 900);
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const [stage, setStage] = useState(2);
  const [friction, setFriction] = useState<FrictionId>("manual");
  const [picked, setPicked] = useState<ToolName[]>(["Email", "Sheets", "Paper"]);
  const [pickingTools, setPickingTools] = useState(false);

  const frictionItem = frictions.find((f) => f.id === friction) ?? frictions[0];
  const toolPhrase = picked.length === 0 ? "nothing yet" : picked.length === 1 ? picked[0] : `${picked.slice(0, -1).join(", ")} and ${picked[picked.length - 1]}`;
  const sentence = useMemo(
    () => `Our day doubles back at ${stages[stage].label.toLowerCase()}. The work crosses ${toolPhrase}. It feels like ${frictionItem.label.toLowerCase()}.`,
    [stage, toolPhrase, frictionItem.label],
  );
  const form = useContactForm({ idleStatus: "", prefix: sentence });
  const submit = (event: FormEvent<HTMLFormElement>) => void form.submit(event);

  // Pressing Send releases the parked pen; the confetti waits for it to arrive.
  const released = form.state === "sending" || form.state === "sent";
  const sendDotRef = useRef<HTMLSpanElement>(null);
  const [burst, setBurst] = useState<{ x: number; y: number; key: number } | null>(null);
  useEffect(() => {
    if (form.state !== "sent") return;
    const id = window.setTimeout(() => {
      const r = sendDotRef.current?.getBoundingClientRect();
      if (r) setBurst({ x: r.left + r.width / 2, y: r.top + r.height / 2, key: Date.now() });
    }, reduced ? 0 : 1100);
    return () => window.clearTimeout(id);
  }, [form.state, reduced]);
  const endBurst = useCallback(() => setBurst(null), []);

  const cycleStage = () => setStage((s) => (s + 1) % stages.length);
  const cycleFriction = () => setFriction((f) => frictions[(frictions.findIndex((x) => x.id === f) + 1) % frictions.length].id);
  const toggleTool = (t: ToolName) => setPicked((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  const heroLines = ["Less work", "between", "the work."];

  return (
    <div className={`one${burst ? " is-signing" : ""}`} ref={hostRef}>


      <main>
        <Sketched className="one-hero" aria-labelledby="one-title" delay={900}>
          <header className="one-nav">
            <a href="/" className="one-brand" aria-label="fanworks home">
              <LogoDraw className="one-mark" />
              <span>
                fanworks
                <i className="one-brand-period" aria-hidden="true" />
              </span>
            </a>
            <button type="button" className="one-link" onClick={() => scrollTo("talk")}>
              Talk to us
            </button>
          </header>
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
          </motion.p>
          <motion.div
            className="one-hero-follow"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 1.1, ease }}
          >
            <ul className="one-checks" aria-label="What we do">
              {["Find where the day doubles back", "Rebuild one line through the business", "Leave it owned by the people who run it"].map((item, i) => (
                <li key={item}>
                  <span className="one-check-box" data-thread={`${i === 0 ? "" : "lift "}${["check", "check2", "check3"][i]}`} aria-hidden="true" />
                  <span className="one-check-label" data-thread-note>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <button type="button" className="one-link one-link-quiet" onClick={() => scrollTo("tangle")}>
              Follow the line
            </button>
          </motion.div>
        </Sketched>

        <Sketched className="one-tangle" id="tangle" aria-labelledby="one-tangle-title">
          <Reveal>
            <h2 id="one-tangle-title">
              Your people carry the work <em>between systems that never meet.</em>
            </h2>
          </Reveal>
          <ol className="one-frictions">
            <span data-thread="start" className="one-anchor one-anchor-above" />
            {frictions.map((f, i) => (
              <Reveal key={f.id} delay={i * 0.05}>
                <li>
                  <span data-thread={i === 1 || i === 3 ? "back knot" : "knot"} className="one-anchor" />
                  {i === 1 ? (
                    <small className="one-note" data-thread-note>
                      it doubles back here
                    </small>
                  ) : null}
                  {i === 3 ? (
                    <small className="one-note" data-thread-note>
                      and here
                    </small>
                  ) : null}
                  <strong>{f.label}</strong>
                  <span>{f.short}</span>
                </li>
              </Reveal>
            ))}
            <span data-thread="tail" className="one-anchor one-anchor-below" />
          </ol>
        </Sketched>

        <Sketched className="one-line" aria-labelledby="one-line-title">
          <Reveal>
            <h2 id="one-line-title">One line through the business.</h2>
          </Reveal>
          <div className="one-rule">
            <span data-thread="line-start" className="one-anchor one-anchor-left" />
            <span data-thread="line-end" className="one-anchor one-anchor-right" />
            <small className="one-note one-note-rule-left" data-thread-note>
              then it straightens
            </small>
            <small className="one-note one-note-rule-right" data-thread-note>
              one line, entered once
            </small>
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
        </Sketched>

        <Sketched className="one-method" aria-labelledby="one-method-title">
          <figure className="one-photo">
            <img src="/media/mri/operator-observation.webp" alt="Two operators walking a working shop floor, listening to the person who runs it" width={1800} height={1200} loading="lazy" />
          </figure>
          <div className="one-steps">
            <Reveal>
              <h2 id="one-method-title">We sit beside the people who run the day.</h2>
            </Reveal>
            <ol className="one-steps-list">
              <span data-thread="start" className="one-anchor one-anchor-above" />
              <small className="one-note one-note-steps" data-thread-note>
                this is where we sit
              </small>
              {methods.map((m, i) => (
                <Reveal key={m.number} delay={i * 0.06}>
                  <li>
                    <span data-thread="dot" className="one-dot" />
                    <h3>{m.verb}</h3>
                    <p>{m.body}</p>
                  </li>
                </Reveal>
              ))}
              <span data-thread="tail" className="one-anchor one-anchor-below" />
            </ol>
          </div>
        </Sketched>

        <Sketched className="one-how" aria-labelledby="one-how-title">
          <Reveal>
            <h2 id="one-how-title">How it goes.</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="one-how-lede">From your note to a line your people own, drawn in one stroke. Two questions along the way, and an honest no at either.</p>
          </Reveal>
          <Flowchart />
        </Sketched>

        <Sketched className="one-where" aria-label="Industries and engagements">
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
              {offers.map((o, i) => (
                <li key={o.id}>
                  <span data-thread={`${i === 0 ? "start" : "line-end"} ${narrow ? "dash" : "tick"}`} className="one-anchor one-anchor-corner" />
                  <strong>{o.name}</strong>
                  <span>{o.summary}</span>
                </li>
              ))}
              <span data-thread="line-end" className="one-anchor one-anchor-corner-end" />
            </ol>
          </Reveal>
        </Sketched>

        <Sketched className="one-quote" aria-label="What we believe">
          <figure className="one-photo one-photo-wide">
            <img src="/media/mri/team-handoff.webp" alt="A team making a real handoff at an operating counter" width={1800} height={1200} loading="lazy" />
          </figure>
          <Reveal>
            <blockquote>
              <p>
                The goal is not more technology. <span data-thread="start" className="one-anchor" />
                <em data-thread="circle">It is less work between the work.</em>
              </p>
              <cite>Operators, not vendors. Twenty years improving operations, founder-led companies to the Fortune 500.</cite>
            </blockquote>
          </Reveal>
        </Sketched>

        <Sketched className="one-talk" id="talk" aria-labelledby="one-talk-title" released={released}>
          <div className="one-talk-copy">
            <Reveal>
              <h2 id="one-talk-title">Bring us the hard handoff.</h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="one-talk-lede">
                Write us a note. Fill in the three blanks, add anything we should know, and send it. If we can help, we
                will say how. If we cannot, we will say that too.
              </p>
              <a className="one-talk-mail" href={`mailto:${contactEmail}`}>
                {contactEmail}
              </a>
              <span data-thread="start" className="one-anchor one-anchor-talk" />
            </Reveal>
          </div>

          <form className="one-form" onSubmit={submit}>
            <span data-thread="park" className="one-anchor one-park" />
            <div className="one-form-head">
              <span>A note to fanworks</span>
              <span>{today}</span>
            </div>

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
            <p className="one-form-hint">Click a blank to change it. The sentence goes in with your note.</p>

            <div className="one-form-fields">
              <label>
                <span>Your name</span>
                <input name="name" autoComplete="name" required minLength={2} disabled={form.busy} />
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
            <label className="one-form-message">
              <span>Anything we should know <em>(optional)</em></span>
              <textarea ref={form.messageRef} name="message" rows={5} value={form.message} onChange={(e) => form.setMessage(e.target.value)} placeholder="Who runs it, what it costs, what you have tried…" disabled={form.busy} />
            </label>
            <div className="one-form-foot">
              <p role="status" aria-live="polite" className={form.state === "error" ? "is-error" : ""}>
                {form.status || "Nothing is sent until you press Send."}
              </p>
              <button className="one-send" type="submit" disabled={form.busy}>
                {form.state === "sending" ? "Sending" : form.state === "sent" ? "Sent" : "Send"}
                <span ref={sendDotRef} data-thread="end" className={`one-send-dot${form.state === "sent" ? " is-sent" : ""}`} aria-hidden="true" />
              </button>
              <small className="one-note one-note-send" data-thread-note>
                the line ends with you
              </small>
            </div>
          </form>
        </Sketched>
      </main>

      {burst ? <InkBurst key={burst.key} origin={burst} reduced={reduced} onDone={endBurst} /> : null}

      <footer className="one-foot">
        <span>fanworks · Human-centered business consulting</span>
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        <span>Richmond, Virginia</span>
      </footer>
    </div>
  );
}

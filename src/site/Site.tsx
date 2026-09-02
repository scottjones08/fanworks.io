import "./site.css";
import { motion } from "motion/react";
import { type CSSProperties, type FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { contactEmail, frictions, industries, methods, offers, stages, tools, type FrictionId, type ToolName } from "../content";
import { FanMark } from "../shared/Logo";
import { useContactForm } from "../shared/useContactForm";
import { useDocumentTheme } from "../shared/useDocumentTheme";
import { useReducedMotion } from "../shared/useReducedMotion";
import { Handwriting } from "./Handwriting";
import { InkBurst } from "./InkBurst";

const ease = [0.2, 0.8, 0.2, 1] as const;

function Reveal({ children, delay = 0, className, y = 18, as = "div" }: { children: React.ReactNode; delay?: number; className?: string; y?: number; as?: "div" | "li" }) {
  const reduced = useReducedMotion();
  const Tag = as === "li" ? motion.li : motion.div;
  return (
    <Tag
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </Tag>
  );
}

function scrollTo(id: string) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
}

/** The hero's moving picture: an aerial of Richmond when the clip is present, a slow photograph otherwise. */
const HERO_VIDEO = "/media/richmond-aerial.mp4";
const HERO_STILL = "/media/mri/workday-table-hero.webp";

const CARD_PHOTOS = ["/media/mri/operator-observation.webp", "/media/mri/team-handoff.webp", "/media/mri/workday-table-hero.webp", "/fan-works-hero.webp", "/media/mri/operator-observation.webp"];
const CARD_TINTS = ["#1f3fd6", "#6b4a2b", "#1d4d3e", "#3d2f66", "#7a3b26"];

const facts = [
  { big: "Days, not months", small: "to a map of where the day doubles back" },
  { big: "Seven handoffs", small: "traced end to end, intake to invoice" },
  { big: "AI where it earns a place", small: "and nowhere it does not" },
  { big: "Owned by your people", small: "not by us" },
] as const;

export default function Site() {
  useDocumentTheme("#0b0b0c", "#0b0b0c");
  const reduced = useReducedMotion();
  const today = useMemo(() => new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), []);
  const year = new Date().getFullYear();

  // The bar over the hero goes solid once the hero has scrolled away.
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const sync = () => setSolid(window.scrollY > window.innerHeight * 0.8);
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, []);
  const [menu, setMenu] = useState(false);
  const go = (id: string) => {
    setMenu(false);
    scrollTo(id);
  };
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);
  const [videoOk, setVideoOk] = useState(true);

  // The note.
  const [stage, setStage] = useState(2);
  const [friction, setFriction] = useState<FrictionId>("manual");
  const [picked, setPicked] = useState<ToolName[]>(["Email", "Sheets"]);
  const [pickingTools, setPickingTools] = useState(false);
  const frictionItem = frictions.find((f) => f.id === friction) ?? frictions[0];
  const toolPhrase = picked.length === 0 ? "nothing yet" : picked.length === 1 ? picked[0] : `${picked.slice(0, -1).join(", ")} and ${picked[picked.length - 1]}`;
  const sentence = useMemo(
    () => `Our day doubles back at ${stages[stage].label.toLowerCase()}. The work crosses ${toolPhrase}. It feels like ${frictionItem.label.toLowerCase()}.`,
    [stage, toolPhrase, frictionItem.label],
  );
  const form = useContactForm({ idleStatus: "", prefix: sentence });
  const submit = (event: FormEvent<HTMLFormElement>) => {
    (document.activeElement as HTMLElement | null)?.blur?.();
    void form.submit(event);
  };
  const cycleStage = () => setStage((s) => (s + 1) % stages.length);
  const cycleFriction = () => setFriction((f) => frictions[(frictions.findIndex((x) => x.id === f) + 1) % frictions.length].id);
  const toggleTool = (t: ToolName) => setPicked((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  // The send-off: ballpoint confetti from the Send dot, then the mark and a thank-you.
  const sendDotRef = useRef<HTMLSpanElement>(null);
  const [burst, setBurst] = useState<{ x: number; y: number; key: number } | null>(null);
  useEffect(() => {
    if (form.state !== "sent") return;
    const dot = sendDotRef.current;
    const first = dot?.getBoundingClientRect();
    const off = Boolean(first && (first.top < 72 || first.bottom > window.innerHeight - 72));
    if (off) dot?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    const id = window.setTimeout(
      () => {
        const r = sendDotRef.current?.getBoundingClientRect();
        if (r) setBurst({ x: r.left + r.width / 2, y: r.top + r.height / 2, key: Date.now() });
      },
      reduced ? 0 : off ? 750 : 400,
    );
    return () => window.clearTimeout(id);
  }, [form.state, reduced]);
  const endBurst = useCallback(() => setBurst(null), []);

  const heroWords = ["Applied AI", "for the operator."];

  return (
    <div className={`w${burst ? " is-signing" : ""}`}>
      <button type="button" className="w-ribbon" onClick={() => go("talk")}>
        <span>
          Now booking fall engagements<span className="w-ribbon-long"> in Richmond, Virginia</span>
        </span>
        <span className="w-ribbon-link">Talk to us →</span>
      </button>

      <header className={`w-nav${solid ? " is-solid" : ""}${menu ? " is-open" : ""}`}>
        <a href="/" className="w-brand" aria-label="fanworks home">
          <FanMark className="w-mark" />
          <span>fanworks</span>
        </a>
        <nav className="w-links" aria-label="Sections">
          <button type="button" onClick={() => go("work")}>
            Work
          </button>
          <button type="button" onClick={() => go("method")}>
            Method
          </button>
          <button type="button" onClick={() => go("engagements")}>
            Engagements
          </button>
        </nav>
        <div className="w-nav-right">
          <button type="button" className="w-pill w-pill-light w-nav-cta" onClick={() => go("talk")}>
            Get in touch
          </button>
          <button type="button" className="w-burger" aria-label={menu ? "Close menu" : "Open menu"} aria-expanded={menu} onClick={() => setMenu((v) => !v)}>
            <span />
            <span />
          </button>
        </div>
      </header>
      {menu ? (
        <div className="w-menu" role="dialog" aria-label="Menu">
          <button type="button" onClick={() => go("work")}>
            Work
          </button>
          <button type="button" onClick={() => go("method")}>
            Method
          </button>
          <button type="button" onClick={() => go("engagements")}>
            Engagements
          </button>
          <button type="button" onClick={() => go("talk")}>
            Get in touch
          </button>
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </div>
      ) : null}

      <main>
        <section className="w-hero" aria-labelledby="w-title">
          <div className="w-hero-media" aria-hidden="true">
            {videoOk && !reduced ? (
              <video className="w-hero-video" src={HERO_VIDEO} poster={HERO_STILL} autoPlay muted loop playsInline onError={() => setVideoOk(false)} />
            ) : (
              <img className="w-hero-still" src={HERO_STILL} alt="" width={2000} height={1125} />
            )}
            <div className="w-hero-shade" />
          </div>
          <div className="w-hero-copy">
            <h1 id="w-title">
              {heroWords.map((line, i) => (
                <span className="w-mask" key={line}>
                  <motion.span initial={reduced ? false : { y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1.1, delay: 0.15 + i * 0.1, ease }}>
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p initial={reduced ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.55, ease }}>
              fanworks helps the businesses that run on people put AI to work inside the day, with the people who run it.
            </motion.p>
            <motion.div className="w-hero-actions" initial={reduced ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.7, ease }}>
              <button type="button" className="w-pill w-pill-light" onClick={() => go("talk")}>
                Get in touch
              </button>
              <button type="button" className="w-pill w-pill-ghost" onClick={() => go("method")}>
                See how it works
              </button>
            </motion.div>
          </div>
          <p className="w-hero-place">
            <span>Richmond, Virginia</span>
            <span>Operator-led since day one</span>
          </p>
        </section>

        <section className="w-trust" aria-labelledby="w-trust-title">
          <Reveal>
            <h2 id="w-trust-title" className="w-trust-title">
              Built for the businesses that keep a city running
            </h2>
          </Reveal>
          <ul className="w-trust-grid">
            {industries.map((ind, i) => (
              <Reveal as="li" key={ind.id} delay={i * 0.05} className="w-trust-cell">
                <span className="w-trust-label">{ind.label}</span>
                <span className="w-trust-sub">{ind.eyebrow}</span>
              </Reveal>
            ))}
            <Reveal as="li" delay={0.25} className="w-trust-cell w-trust-more">
              <button type="button" onClick={() => go("talk")}>
                Your industry <span aria-hidden="true">↗</span>
              </button>
            </Reveal>
          </ul>
        </section>

        <section className="w-work" id="work" aria-labelledby="w-work-title">
          <Reveal>
            <h2 id="w-work-title">Solving the problems that move the business.</h2>
          </Reveal>
          <div className="w-cards" role="list">
            {industries.map((ind, i) => (
              <article className="w-card" role="listitem" key={ind.id} style={{ "--tint": CARD_TINTS[i] } as CSSProperties}>
                <img src={CARD_PHOTOS[i]} alt="" loading="lazy" width={1800} height={1200} />
                <div className="w-card-top">
                  <h3>{ind.headline}</h3>
                  <span className="w-arrow" aria-hidden="true">
                    ↗
                  </span>
                </div>
                <p className="w-card-body">{ind.body}</p>
                <div className="w-card-foot">
                  <span>{ind.label}</span>
                  <span>{ind.eyebrow}</span>
                </div>
                <button type="button" className="w-card-hit" aria-label={`Talk to us about ${ind.label.toLowerCase()}`} onClick={() => go("talk")} />
              </article>
            ))}
          </div>
        </section>

        <section className="w-os" aria-labelledby="w-os-title">
          <div className="w-os-grain" aria-hidden="true" />
          <Reveal>
            <p className="w-os-brand">
              <FanMark className="w-mark" />
              <span>fanworks</span> <em>Operating Line</em>
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 id="w-os-title">One line through the business, from intake to invoice.</h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="w-os-sub">The operating layer under the day. Entered once, seen everywhere, owned by the people who run it.</p>
            <button type="button" className="w-pill w-pill-light" onClick={() => go("method")}>
              See the method
            </button>
          </Reveal>
          <ol className="w-stages" aria-label="Seven handoffs">
            {stages.map((s) => (
              <li key={s.id}>{s.label}</li>
            ))}
          </ol>
        </section>

        <section className="w-hear" aria-labelledby="w-hear-title">
          <div className="w-hear-head">
            <Reveal>
              <p className="w-eyebrow">What we hear every week</p>
              <h2 id="w-hear-title">The same story, in a different building.</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="w-lede">Seven handoffs, intake to invoice. Every one of them is a place the day doubles back. Written down the way we hear it, then the way it reads after the rebuild.</p>
            </Reveal>
          </div>
          <Handwriting items={stages.map((s) => ({ label: s.label, before: s.before, after: s.after }))} />
          <ul className="w-frictions" aria-label="Five kinds of friction">
            {frictions.map((f) => (
              <li key={f.id}>
                <span>{f.number}</span>
                {f.label}
              </li>
            ))}
          </ul>
        </section>

        <section className="w-method" id="method" aria-labelledby="w-method-title">
          <Reveal className="w-photo-wrap" y={0}>
            <article className="w-photo-card">
              <img src="/media/mri/operator-observation.webp" alt="Two operators walking a working shop floor with the person who runs it" loading="lazy" width={1800} height={1200} />
              <div className="w-photo-copy">
                <h2 id="w-method-title">Operators on the ground.</h2>
                <p>We sit beside the people who run the day, build it with them, then hand it over and get out of the way.</p>
                <button type="button" className="w-pill w-pill-light" onClick={() => go("engagements")}>
                  See the model
                </button>
              </div>
            </article>
          </Reveal>
          <ol className="w-steps">
            {methods.map((m, i) => (
              <Reveal as="li" key={m.number} delay={i * 0.06} className="w-step">
                <span className="w-step-n">{m.number}</span>
                <h3>{m.verb}</h3>
                <p className="w-step-t">{m.title}</p>
                <p>{m.body}</p>
              </Reveal>
            ))}
          </ol>
          <ul className="w-facts" aria-label="How we work">
            {facts.map((f) => (
              <li key={f.big}>
                <strong>{f.big}</strong>
                <span>{f.small}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="w-offers" id="engagements" aria-labelledby="w-offers-title">
          <Reveal>
            <p className="w-eyebrow">Engagements</p>
            <h2 id="w-offers-title">Three ways in.</h2>
          </Reveal>
          <ol className="w-offer-grid">
            {offers.map((o, i) => (
              <Reveal as="li" key={o.id} delay={i * 0.07} className="w-offer">
                <span className="w-kicker">{o.kicker}</span>
                <h3>{o.name}</h3>
                <p>{o.summary}</p>
                <ul>
                  {o.outcomes.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ol>
        </section>

        <section className="w-talk" id="talk" aria-labelledby="w-talk-title">
          <div className="w-talk-copy">
            <Reveal>
              <p className="w-eyebrow">Contact</p>
              <h2 id="w-talk-title">Bring us the hard handoff.</h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="w-lede">Write us a note. Fill in the three blanks, add anything we should know, and send it. If we can help, we will say how. If we cannot, we will say that too.</p>
              <a className="w-mail" href={`mailto:${contactEmail}`}>
                {contactEmail}
              </a>
            </Reveal>
          </div>

          <form className="w-form" onSubmit={submit}>
            <div className="w-form-head">
              <span>A note to fanworks</span>
              <span>{today}</span>
            </div>
            <p className="w-sentence">
              Our day doubles back at{" "}
              <button type="button" className="w-blank" onClick={cycleStage} aria-label={`Handoff: ${stages[stage].label}. Click to change.`}>
                {stages[stage].label.toLowerCase()}
              </button>
              . The work crosses{" "}
              <button type="button" className="w-blank" onClick={() => setPickingTools((v) => !v)} aria-expanded={pickingTools} aria-label={`Systems: ${toolPhrase}. Click to change.`}>
                {toolPhrase}
              </button>
              . It feels like{" "}
              <button type="button" className="w-blank" onClick={cycleFriction} aria-label={`Friction: ${frictionItem.label}. Click to change.`}>
                {frictionItem.label.toLowerCase()}
              </button>
              .
            </p>
            {pickingTools ? (
              <div className="w-tools" role="group" aria-label="Systems the work crosses">
                {tools.map((t) => (
                  <button type="button" key={t} aria-pressed={picked.includes(t)} className={picked.includes(t) ? "is-on" : ""} onClick={() => toggleTool(t)}>
                    {t}
                  </button>
                ))}
              </div>
            ) : null}
            <p className="w-form-hint">Tap a blank to change it. The sentence goes in with your note.</p>

            <div className="w-fields">
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
            <label className="w-message">
              <span>
                Anything we should know <em>(optional)</em>
              </span>
              <textarea ref={form.messageRef} name="message" rows={4} value={form.message} onChange={(e) => form.setMessage(e.target.value)} placeholder="Who runs it, what it costs, what you have tried…" disabled={form.busy} />
            </label>
            <div className="w-form-foot">
              <p role="status" aria-live="polite" className={form.state === "error" ? "is-error" : ""}>
                {form.status || "Nothing is sent until you press Send."}
              </p>
              <button className="w-pill w-pill-dark w-send" type="submit" disabled={form.busy}>
                {form.state === "sending" ? "Sending" : form.state === "sent" ? "Sent" : "Send"}
                <span ref={sendDotRef} className={`w-send-dot${form.state === "sent" ? " is-sent" : ""}`} aria-hidden="true" />
              </button>
            </div>
          </form>
        </section>
      </main>

      {burst ? <InkBurst key={burst.key} origin={burst} reduced={reduced} onDone={endBurst} /> : null}

      <footer className="w-foot">
        <p className="w-foot-word" aria-hidden="true">
          fanworks<i />
        </p>
        <div className="w-foot-grid">
          <div>
            <span className="w-foot-k">Company</span>
            <button type="button" onClick={() => go("work")}>
              Work
            </button>
            <button type="button" onClick={() => go("method")}>
              Method
            </button>
            <button type="button" onClick={() => go("engagements")}>
              Engagements
            </button>
          </div>
          <div>
            <span className="w-foot-k">Contact</span>
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            <span>Richmond, Virginia</span>
          </div>
          <div className="w-foot-legal">
            <span>fanworks · Human-centered business consulting</span>
            <span>© {year} fanworks. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

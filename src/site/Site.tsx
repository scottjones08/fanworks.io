import "./site.css";
import { motion } from "motion/react";
import { type CSSProperties, type FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { contactEmail, experience, fieldNotes, frictions, industries, methods, offers, stages, tools, trust, work, type FrictionId, type ToolName } from "../content";
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
const HERO_VIDEO = "/media/hero-flythrough.mp4";
const HERO_VIDEO_SMALL = "/media/hero-flythrough-480.mp4";
const HERO_STILL = "/media/hero-poster.jpg";

const CARD_PHOTOS = ["/media/mri/operator-observation.webp", "/media/mri/team-handoff.webp", "/media/mri/workday-table-hero.webp", "/fan-works-hero.webp", "/media/mri/operator-observation.webp", "/media/mri/team-handoff.webp", "/media/mri/workday-table-hero.webp"];
const CARD_TINTS = ["#1f3fd6", "#6b4a2b", "#1d4d3e", "#3d2f66", "#7a3b26", "#24466b", "#4a3a1e"];

type SheetRef = { kind: "work" | "sector" | "note"; id: string };

function readHash(): SheetRef | null {
  const m = /^#(work|sector|note)\/([\w-]+)$/.exec(window.location.hash);
  return m ? { kind: m[1] as SheetRef["kind"], id: m[2] } : null;
}

/** A side panel for a story, a sector, or a field note. Deep-linkable by hash. */
function Sheet({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  useEffect(() => {
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onClose]);
  return (
    <div className="w-sheet-root">
      <div className="w-sheet-back" onClick={onClose} />
      <aside className="w-sheet" role="dialog" aria-modal="true">
        <button type="button" className="w-sheet-close" onClick={onClose}>
          Close <span aria-hidden="true">×</span>
        </button>
        <div className="w-sheet-body">{children}</div>
      </aside>
    </div>
  );
}

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
  // Stories, sectors, and notes open in a side panel; the hash keeps them linkable.
  const [sheet, setSheet] = useState<SheetRef | null>(() => readHash());
  const open = (kind: SheetRef["kind"], id: string) => setSheet({ kind, id });
  const closeSheet = useCallback(() => setSheet(null), []);
  useEffect(() => {
    const want = sheet ? `#${sheet.kind}/${sheet.id}` : "";
    if (window.location.hash !== want) window.history.replaceState(null, "", want || window.location.pathname);
    const onHash = () => setSheet(readHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [sheet]);
  const [menu, setMenu] = useState(false);
  const go = (id: string) => {
    setMenu(false);
    setSheet(null);
    window.setTimeout(() => scrollTo(id), 30);
  };
  useEffect(() => {
    document.body.style.overflow = menu || sheet ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu, sheet]);
  const [videoOk, setVideoOk] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    // With several sources, a failed load reports on the last <source>, not the video.
    const v = videoRef.current;
    if (!v) return;
    const last = v.querySelector("source:last-of-type");
    const fail = () => setVideoOk(false);
    last?.addEventListener("error", fail);
    v.addEventListener("error", fail);
    return () => {
      last?.removeEventListener("error", fail);
      v.removeEventListener("error", fail);
    };
  }, [videoOk, reduced]);


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
          <button type="button" onClick={() => go("sectors")}>
            Sectors
          </button>
          <button type="button" onClick={() => go("method")}>
            Method
          </button>
          <button type="button" onClick={() => go("notes")}>
            Notes
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
          <button type="button" onClick={() => go("sectors")}>
            Sectors
          </button>
          <button type="button" onClick={() => go("method")}>
            Method
          </button>
          <button type="button" onClick={() => go("notes")}>
            Notes
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
              <video ref={videoRef} className="w-hero-video" poster={HERO_STILL} autoPlay muted loop playsInline>
                <source src={HERO_VIDEO_SMALL} type="video/mp4" media="(max-width: 640px)" />
                <source src={HERO_VIDEO} type="video/mp4" />
              </video>
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
              <Reveal as="li" key={ind.id} delay={i * 0.04} className="w-trust-cell">
                <button type="button" onClick={() => open("sector", ind.id)}>
                  <span className="w-trust-label">{ind.label}</span>
                  <span className="w-trust-sub">{ind.eyebrow}</span>
                </button>
              </Reveal>
            ))}
            <Reveal as="li" delay={0.25} className="w-trust-cell w-trust-more">
              <button type="button" onClick={() => go("talk")}>
                Your industry <span aria-hidden="true">↗</span>
              </button>
            </Reveal>
          </ul>
        </section>

        <section className="w-selected" id="work" aria-labelledby="w-selected-title">
          <div className="w-selected-head">
            <Reveal>
              <p className="w-eyebrow">Selected work</p>
              <h2 id="w-selected-title">Encountered, changed, and learned.</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="w-lede">Seven engagements, anonymized on purpose. No client names, and no number that has not been measured and approved.</p>
            </Reveal>
          </div>
          <ol className="w-stories">
            {work.map((st, i) => (
              <Reveal as="li" key={st.id} delay={(i % 3) * 0.06} className="w-story-card">
                <button type="button" onClick={() => open("work", st.id)}>
                  <span className="w-kicker">{st.sector}</span>
                  <h3>{st.title}</h3>
                  <p>{st.deck}</p>
                  <span className="w-more">
                    Read the story <span aria-hidden="true">↗</span>
                  </span>
                </button>
              </Reveal>
            ))}
          </ol>
        </section>

        <section className="w-work" id="sectors" aria-labelledby="w-work-title">
          <Reveal>
            <p className="w-eyebrow w-eyebrow-pad">Sectors</p>
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
                <button type="button" className="w-card-hit" aria-label={`${ind.label}: where work breaks and what we connect`} onClick={() => open("sector", ind.id)} />
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

        <section className="w-exp" aria-labelledby="w-exp-title">
          <div className="w-exp-head">
            <Reveal>
              <p className="w-eyebrow">Who does the work</p>
              <h2 id="w-exp-title">{experience.title}</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="w-lede">{experience.lede}</p>
            </Reveal>
          </div>
          <ul className="w-exp-grid">
            {experience.themes.map((t, i) => (
              <Reveal as="li" key={t} delay={(i % 4) * 0.05}>
                <span className="w-exp-n">{String(i + 1).padStart(2, "0")}</span>
                {t}
              </Reveal>
            ))}
          </ul>
        </section>

        <section className="w-notes" id="notes" aria-labelledby="w-notes-title">
          <div className="w-notes-head">
            <Reveal>
              <p className="w-eyebrow">Field notes</p>
              <h2 id="w-notes-title">Short pieces from the floor.</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="w-lede">Written by the people who sat in the room. A few paragraphs each, about the things that actually slow a business down.</p>
            </Reveal>
          </div>
          <ol className="w-note-list">
            {fieldNotes.map((n, i) => (
              <li key={n.id}>
                <button type="button" onClick={() => open("note", n.id)}>
                  <span className="w-note-n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="w-note-t">
                    <strong>{n.title}</strong>
                    <span>{n.deck}</span>
                  </span>
                  <span className="w-note-arrow" aria-hidden="true">
                    ↗
                  </span>
                </button>
              </li>
            ))}
          </ol>
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

        <section className="w-own" aria-labelledby="w-own-title">
          <div className="w-os-grain" aria-hidden="true" />
          <Reveal>
            <p className="w-eyebrow w-eyebrow-light">Ownership</p>
            <h2 id="w-own-title">{trust.title}</h2>
          </Reveal>
          <Reveal delay={0.1} className="w-own-body">
            {trust.body.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </Reveal>
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

      {sheet ? (
        <Sheet onClose={closeSheet}>
          {sheet.kind === "work"
            ? (() => {
                const st = work.find((x) => x.id === sheet.id);
                if (!st) return null;
                return (
                  <>
                    <p className="w-kicker">Selected work · {st.sector}</p>
                    <h2>{st.title}</h2>
                    <p className="w-lede">{st.deck}</p>
                    <dl className="w-story">
                      <div>
                        <dt>The situation</dt>
                        <dd>{st.situation}</dd>
                      </div>
                      <div>
                        <dt>What we found</dt>
                        <dd>{st.found}</dd>
                      </div>
                      <div>
                        <dt>What we changed</dt>
                        <dd>{st.changed}</dd>
                      </div>
                      <div>
                        <dt>What became possible</dt>
                        <dd>{st.possible}</dd>
                      </div>
                      <div className="w-story-pair">
                        <div>
                          <dt>For the team</dt>
                          <dd>{st.human}</dd>
                        </div>
                        <div>
                          <dt>For leadership</dt>
                          <dd>{st.management}</dd>
                        </div>
                      </div>
                      <div className="w-story-evidence">
                        <dt>Evidence</dt>
                        <dd>{st.evidence}</dd>
                      </div>
                    </dl>
                    <button type="button" className="w-pill w-pill-dark" onClick={() => go("talk")}>
                      Bring us something like this
                    </button>
                  </>
                );
              })()
            : sheet.kind === "sector"
              ? (() => {
                  const ind = industries.find((x) => x.id === sheet.id);
                  if (!ind) return null;
                  return (
                    <>
                      <p className="w-kicker">{ind.label} · {ind.eyebrow}</p>
                      <h2>{ind.headline}</h2>
                      <p className="w-lede">{ind.body}</p>
                      <ul className="w-chips" aria-label="Recognizable moments">
                        {ind.moments.map((m) => (
                          <li key={m}>{m}</li>
                        ))}
                      </ul>
                      <dl className="w-story">
                        <div>
                          <dt>Where work breaks</dt>
                          <dd>{ind.breaks}</dd>
                        </div>
                        <div>
                          <dt>What fanworks connects</dt>
                          <dd>{ind.connects}</dd>
                        </div>
                        <div>
                          <dt>What changes for employees</dt>
                          <dd>{ind.employees}</dd>
                        </div>
                        <div>
                          <dt>What changes for leadership</dt>
                          <dd>{ind.leadership}</dd>
                        </div>
                        <div className="w-story-evidence">
                          <dt>A first engagement</dt>
                          <dd>{ind.first}</dd>
                        </div>
                      </dl>
                      <button type="button" className="w-pill w-pill-dark" onClick={() => go("talk")}>
                        Talk to us about {ind.label.toLowerCase()}
                      </button>
                    </>
                  );
                })()
              : (() => {
                  const n = fieldNotes.find((x) => x.id === sheet.id);
                  if (!n) return null;
                  return (
                    <>
                      <p className="w-kicker">Field note</p>
                      <h2>{n.title}</h2>
                      <p className="w-lede">{n.deck}</p>
                      <div className="w-note-body">
                        {n.body.map((para) => (
                          <p key={para}>{para}</p>
                        ))}
                      </div>
                      <button type="button" className="w-pill w-pill-dark" onClick={() => go("talk")}>
                        Talk to us
                      </button>
                    </>
                  );
                })()}
        </Sheet>
      ) : null}

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
            <button type="button" onClick={() => go("sectors")}>
              Sectors
            </button>
            <button type="button" onClick={() => go("method")}>
              Method
            </button>
            <button type="button" onClick={() => go("notes")}>
              Field notes
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

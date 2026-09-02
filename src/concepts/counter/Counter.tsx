import "./counter.css";
import { AnimatePresence, motion } from "motion/react";
import { type FormEvent, useState } from "react";
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

const nav = [
  { id: "board", label: "The board" },
  { id: "order", label: "How an order moves" },
  { id: "aisles", label: "Aisles" },
  { id: "crew", label: "The crew" },
  { id: "ticket", label: "Work ticket" },
];

function Awning() {
  return <div className="ct-awning" aria-hidden="true" />;
}

/* ---------- the work ticket ---------- */

function Ticket({ brief, onPin }: { brief: ReturnType<typeof useBrief>; onPin: () => void }) {
  const stamp = new Date();
  const date = stamp.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  return (
    <div className="ct-ticket" aria-live="polite">
      <div className="ct-ticket-paper">
        <div className="ct-ticket-head">
          <FanMark className="ct-ticket-mark" />
          <strong>FANWORKS</strong>
          <span>WORK TICKET · NO. {String(brief.selectedStage + 1).padStart(2, "0")}{brief.selectedTools.length}{brief.friction.number}</span>
          <span>{date.toUpperCase()}</span>
        </div>
        <dl className="ct-ticket-lines">
          <div>
            <dt>AISLE</dt>
            <dd>{brief.sector.label.toUpperCase()}</dd>
          </div>
          <div>
            <dt>HANDOFF</dt>
            <dd>{brief.stage.label.toUpperCase()}</dd>
          </div>
          <div>
            <dt>SYSTEMS</dt>
            <dd>{brief.selectedTools.length ? brief.selectedTools.map((t) => t.toUpperCase()).join(", ") : "NONE"}</dd>
          </div>
          <div>
            <dt>QTY</dt>
            <dd>{brief.selectedTools.length}</dd>
          </div>
          <div>
            <dt>FRICTION</dt>
            <dd>{brief.friction.label.toUpperCase()}</dd>
          </div>
        </dl>
        <p className="ct-ticket-note">
          FIRST MOVE: OBSERVE THE {brief.stage.label.toUpperCase()} HANDOFF IN THE REAL DAY. TRACE WHAT PEOPLE TRANSLATE BETWEEN {(brief.selectedTools.slice(0, 3).join(", ") || "THEIR TOOLS").toUpperCase()}.
        </p>
        <p className="ct-ticket-foot">
          NO SCORE · NO INVENTED ROI · A SHARPER FIRST CONVERSATION
          <br />
          THANK YOU · HELLO@FANWORKS.IO
        </p>
      </div>
      <button type="button" className="ct-button ct-button-green" onClick={onPin}>
        Pin ticket to my note
      </button>
    </div>
  );
}

function TicketSection({ brief }: { brief: ReturnType<typeof useBrief> }) {
  const form = useContactForm({ brief: brief.brief, briefVersion: brief.briefVersion, briefStatus: "Ticket pinned to your note. Edit anything, then send." });
  const submit = (event: FormEvent<HTMLFormElement>) => void form.submit(event);
  return (
    <section className="ct-section ct-ticket-section" id="ticket" aria-labelledby="ct-ticket-title">
      <div className="ct-section-head">
        <p className="ct-kicker">Work ticket</p>
        <h2 id="ct-ticket-title">
          Write up the job. <em>We&rsquo;ll tell you straight.</em>
        </h2>
        <p className="ct-lede">Three picks print a ticket. Pin it to your note, add what we should know, and send it. If we can help, we say how. If we cannot, we say that too.</p>
      </div>
      <div className="ct-ticket-grid">
        <div className="ct-picks">
          <div className="ct-pick">
            <span className="ct-label">Handoff</span>
            <div role="listbox" aria-label="Handoff to inspect">
              {stages.map((s, i) => (
                <button type="button" role="option" aria-selected={i === brief.selectedStage} key={s.id} className={i === brief.selectedStage ? "is-on" : ""} onClick={() => brief.setSelectedStage(i)}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div className="ct-pick">
            <span className="ct-label">Systems in the path</span>
            <div aria-label="Systems in the path">
              {tools.map((t) => (
                <button type="button" key={t} aria-pressed={brief.selectedTools.includes(t)} className={brief.selectedTools.includes(t) ? "is-on" : ""} onClick={() => brief.toggleTool(t)}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="ct-pick">
            <span className="ct-label">What it feels like</span>
            <div role="radiogroup" aria-label="Primary friction">
              {frictions.map((f) => (
                <button type="button" role="radio" aria-checked={f.id === brief.selectedFriction} key={f.id} className={f.id === brief.selectedFriction ? "is-on" : ""} onClick={() => brief.setSelectedFriction(f.id)}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <Ticket brief={brief} onPin={brief.requestBrief} />
        <form className="ct-form" onSubmit={submit}>
          <div className="ct-form-row">
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
            <span>Your note</span>
            <textarea ref={form.messageRef} name="message" rows={9} required minLength={8} value={form.message} onChange={(e) => form.setMessage(e.target.value)} placeholder="The handoff that is slowing us down is…" disabled={form.busy} />
          </label>
          <div className="ct-form-foot">
            <button className="ct-button" type="submit" disabled={form.busy}>
              {form.state === "sending" ? "Sending…" : form.state === "sent" ? "Sent" : "Send the note"}
            </button>
            <p role="status" aria-live="polite" className={form.state === "error" ? "is-error" : ""}>
              {form.status}
            </p>
          </div>
          <p className="ct-form-alt">
            Or email <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </p>
        </form>
      </div>
    </section>
  );
}

/* ---------- page ---------- */

export default function Counter() {
  useDocumentTheme("#faf6ee", "#17233d");
  const brief = useBrief();
  const [menu, setMenu] = useState(false);
  const [view, setView] = useState<"before" | "after">("before");
  const active = brief.sector;
  const go = (id: string) => {
    setMenu(false);
    scrollTo(id);
  };

  return (
    <div className="ct">
      <Awning />
      <header className="ct-nav">
        <a href="#top" className="ct-brand" onClick={(e) => (e.preventDefault(), go("top"))}>
          <FanMark className="ct-mark" />
          <span>fanworks</span>
        </a>
        <nav className={`ct-links${menu ? " is-open" : ""}`} aria-label="Primary">
          {nav.map((item) => (
            <button type="button" key={item.id} onClick={() => go(item.id)}>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="ct-nav-right">
          <span className="ct-hours">Richmond, VA · Operators on site</span>
          <button type="button" className="ct-button ct-button-sm" onClick={() => go("ticket")}>
            Write a ticket
          </button>
          <button type="button" className="ct-menu" aria-expanded={menu} onClick={() => setMenu((v) => !v)}>
            {menu ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      <main id="top">
        <section className="ct-hero" aria-labelledby="ct-hero-title">
          <div className="ct-hero-copy">
            <p className="ct-kicker">HCD Business Consulting · Est. 2025</p>
            <h1 id="ct-hero-title">
              We keep the line moving, <em>intake to invoice.</em>
            </h1>
            <p className="ct-lede">
              fanworks is run by operators. We stand at your counter, watch where the day doubles back, and rebuild one line of work with the people who run it. Software and AI go in only where they pull their weight.
            </p>
            <div className="ct-actions">
              <button type="button" className="ct-button" onClick={() => go("ticket")}>
                Write up the job
              </button>
              <button type="button" className="ct-button ct-button-ghost" onClick={() => go("order")}>
                See how an order moves
              </button>
            </div>
            <ul className="ct-badges" aria-label="Facts">
              {facts.map((f) => (
                <li key={f.label}>
                  <strong>{f.value}</strong>
                  <span>{f.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <figure className="ct-hero-photo">
            <img src="/media/mri/team-handoff.webp" alt="A team making a real handoff at a wooden counter" width={1800} height={1200} fetchPriority="high" />
            <figcaption>The counter is where the day either holds or doubles back.</figcaption>
          </figure>
        </section>

        <section className="ct-section ct-board" id="board" aria-labelledby="ct-board-title">
          <div className="ct-board-inner">
            <div className="ct-board-head">
              <p className="ct-kicker ct-kicker-light">The board</p>
              <h2 id="ct-board-title">
                Five things we take <em>off your hands.</em>
              </h2>
            </div>
            <ol className="ct-board-list">
              {frictions.map((f) => (
                <li key={f.id}>
                  <span className="ct-board-no">{f.number}</span>
                  <span className="ct-board-name">{f.label}</span>
                  <span className="ct-board-dots" aria-hidden="true" />
                  <span className="ct-board-desc">{f.short}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="ct-section" id="order" aria-labelledby="ct-order-title">
          <div className="ct-section-head">
            <p className="ct-kicker">How an order moves</p>
            <h2 id="ct-order-title">
              Seven handoffs. <em>One ticket rail.</em>
            </h2>
            <div className="ct-toggle" role="group" aria-label="Before or after">
              <button type="button" aria-pressed={view === "before"} className={view === "before" ? "is-on" : ""} onClick={() => setView("before")}>
                Before
              </button>
              <button type="button" aria-pressed={view === "after"} className={view === "after" ? "is-on" : ""} onClick={() => setView("after")}>
                After
              </button>
            </div>
          </div>
          <div className={`ct-rail is-${view}`}>
            <i className="ct-rail-wire" aria-hidden="true" />
            <ol className="ct-rail-tickets">
              {stages.map((s, i) => (
                <li key={s.id}>
                  <button type="button" className={i === brief.selectedStage ? "is-on" : ""} aria-pressed={i === brief.selectedStage} onClick={() => brief.setSelectedStage(i)}>
                    <span className="ct-clip" aria-hidden="true" />
                    <span className="ct-rail-no">{String(i + 1).padStart(2, "0")}</span>
                    <strong>{s.label}</strong>
                  </button>
                </li>
              ))}
            </ol>
            <AnimatePresence mode="wait">
              <motion.div key={`${view}-${brief.selectedStage}`} className="ct-rail-readout" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
                <span className="ct-label">
                  {String(brief.selectedStage + 1).padStart(2, "0")} · {brief.stage.label} · {view === "before" ? "How it runs today" : "How it should run"}
                </span>
                <p>{view === "before" ? brief.stage.before : brief.stage.after}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        <section className="ct-section ct-how" aria-labelledby="ct-how-title">
          <div className="ct-section-head">
            <p className="ct-kicker">How we work</p>
            <h2 id="ct-how-title">
              At the work. <em>Not around it.</em>
            </h2>
          </div>
          <ol className="ct-steps">
            {methods.map((m) => (
              <li key={m.number}>
                <span className="ct-step-no">{m.number}</span>
                <span className="ct-label">{m.verb}</span>
                <h3>{m.title}</h3>
                <p>{m.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="ct-section" id="aisles" aria-labelledby="ct-aisles-title">
          <div className="ct-section-head">
            <p className="ct-kicker">Aisles</p>
            <h2 id="ct-aisles-title">
              Find your aisle. <em>The friction is familiar.</em>
            </h2>
          </div>
          <div className="ct-aisles" role="tablist" aria-label="Choose an industry">
            {industries.map((ind, i) => (
              <button type="button" role="tab" key={ind.id} aria-selected={ind.id === brief.industry} className={`ct-aisle${ind.id === brief.industry ? " is-on" : ""}`} onClick={() => brief.setIndustry(ind.id)}>
                <span className="ct-aisle-no">{i + 1}</span>
                <span className="ct-aisle-name">{ind.label}</span>
                <span className="ct-aisle-sub">{ind.eyebrow}</span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={active.id} className="ct-aisle-story" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}>
              <div>
                <h3>{active.headline}</h3>
                <p>{active.body}</p>
              </div>
              <ol className="ct-flow" aria-label={`${active.label} operating line`}>
                {active.flow.map((step, i) => (
                  <li key={step}>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </motion.div>
          </AnimatePresence>
        </section>

        <section className="ct-section ct-offers" aria-labelledby="ct-offers-title">
          <div className="ct-section-head">
            <p className="ct-kicker ct-kicker-light">Three ways in</p>
            <h2 id="ct-offers-title">
              Start where it hurts. <em>Leave it owned.</em>
            </h2>
          </div>
          <div className="ct-offer-grid">
            {offers.map((o) => (
              <article key={o.id}>
                <span className="ct-label">{o.kicker}</span>
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

        <section className="ct-section" id="crew" aria-labelledby="ct-crew-title">
          <div className="ct-crew">
            <figure className="ct-crew-photo">
              <img src="/media/mri/operator-observation.webp" alt="Two operators walking a shop floor with the person who runs it" width={1800} height={1200} loading="lazy" />
            </figure>
            <div>
              <p className="ct-kicker">The crew</p>
              <h2 id="ct-crew-title">
                Operators, <em>not vendors.</em>
              </h2>
              <p className="ct-lede">Industry executives and entrepreneurs, from founder-led companies to the Fortune 500, who have built teams, run production, owned the numbers, and lived with the system after launch.</p>
              <ul className="ct-beliefs">
                {beliefs.map((b) => (
                  <li key={b}>“{b}”</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <TicketSection brief={brief} />
      </main>

      <footer className="ct-footer">
        <Awning />
        <div className="ct-footer-inner">
          <span>
            <FanMark className="ct-mark" /> fanworks · HCD Business Consulting
          </span>
          <span>Richmond, Virginia · © 2026</span>
          <span>Less work between the work.</span>
        </div>
      </footer>
      <ConceptSwitcher current="counter" />
    </div>
  );
}

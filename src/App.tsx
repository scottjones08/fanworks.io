import { CSSProperties, FormEvent, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Cable,
  Compass,
  EyeOff,
  Factory,
  Menu,
  SearchCheck,
  Shuffle,
  TrendingUp,
  Workflow,
  X,
} from "lucide-react";

const services = [
  {
    number: "01",
    name: "Disconnected systems",
    line: "Your tools do not talk to each other.",
    icon: Cable,
  },
  {
    number: "02",
    name: "Manual work",
    line: "People spend too much time copying, chasing, and checking.",
    icon: Workflow,
  },
  {
    number: "03",
    name: "Unclear ownership",
    line: "Good work gets stuck between people and teams.",
    icon: Compass,
  },
  {
    number: "04",
    name: "Inconsistent processes",
    line: "The same job gets done five different ways.",
    icon: Shuffle,
  },
  {
    number: "05",
    name: "Lack of visibility",
    line: "You find out too late what is slowing things down.",
    icon: EyeOff,
  },
];

const principles = [
  ["See the real work", "Sit with the team and watch how the day actually runs."],
  ["Fix what matters", "Start with the problem creating the most drag."],
  ["Leave it simpler", "Build a better way your team can understand and own."],
];

const layers = [
  {
    number: "01",
    name: "Memory",
    line: "Your documents, email, meetings, and decisions in one place your team can actually ask.",
  },
  {
    number: "02",
    name: "Judgment",
    line: "Answers come with their sources, their date, and what is still unknown.",
  },
  {
    number: "03",
    name: "Approval",
    line: "Routine work runs on its own. Anything that leaves the building waits for a person.",
  },
  {
    number: "04",
    name: "Boundary",
    line: "Separate storage, separate memory, separate records. Your business is never pooled with anyone else's.",
  },
];

const layerPromises = [
  "Private by default",
  "A person approves anything that leaves",
  "You can take it with you",
];

const rooms = [
  {
    number: "01",
    name: "Listen",
    title: "See the work as it is.",
    body: "We sit with your team, listen, and watch where the day gets harder than it should.",
    fixes: "Lack of visibility",
  },
  {
    number: "02",
    name: "Assess",
    title: "Find what is getting stuck.",
    body: "Together, we map the handoffs, delays, and decisions that slow people down.",
    fixes: "Unclear ownership · Inconsistent processes",
  },
  {
    number: "03",
    name: "Integrate",
    title: "Bring the pieces together.",
    body: "We connect the tools and information your team already uses, so everyone can work from the same picture.",
    fixes: "Disconnected systems",
  },
  {
    number: "04",
    name: "Automate",
    title: "Make every interaction easier.",
    body: "Routine work runs quietly in the background, so your team can give every customer their full attention.",
    fixes: "Manual work",
  },
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeRoom, setActiveRoom] = useState(0);
  const journeyRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const updateJourney = () => {
      const element = journeyRef.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const distance = Math.max(1, element.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / distance));
      element.style.setProperty("--journey", progress.toFixed(3));
      setActiveRoom(
        progress < 0.14 ? -1 : progress < 0.32 ? 0 : progress < 0.56 ? 1 : progress < 0.82 ? 2 : 3,
      );
    };
    updateJourney();
    window.addEventListener("scroll", updateJourney, { passive: true });
    window.addEventListener("resize", updateJourney);
    return () => {
      window.removeEventListener("scroll", updateJourney);
      window.removeEventListener("resize", updateJourney);
    };
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "");
    const message = String(form.get("message") || "");
    const subject = encodeURIComponent(`FanWorks conversation: ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${form.get("email") || ""}`);
    setSubmitted(true);
    window.location.href = `mailto:hello@fanworks.io?subject=${subject}&body=${body}`;
  };

  return (
    <main>
      <section
        className="journey cutaway-journey"
        id="top"
        ref={journeyRef}
        style={{ "--journey": 0 } as CSSProperties}
        aria-label="Explore how FanWorks moves through an operation"
      >
        <div className="journey-stage cutaway-stage">
          <header className="site-header floating-header">
            <button className="brand-lockup" type="button" onClick={() => scrollTo("top")} aria-label="FanWorks home">
              <span className="wordmark">FANWORKS</span>
              <span className="brand-subtitle">Business systems consulting</span>
            </button>
            <nav className="desktop-nav" aria-label="Primary navigation">
              <button type="button" onClick={() => scrollTo("work")}>Work</button>
              <button type="button" onClick={() => scrollTo("ethos")}>Approach</button>
              <button type="button" onClick={() => scrollTo("story")}>Story</button>
              <button className="nav-cta" type="button" onClick={() => scrollTo("engage")}>Contact</button>
            </nav>
            <button type="button" className="menu-toggle" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
              {menuOpen ? <X /> : <Menu />}
            </button>
          </header>
          {menuOpen ? (
            <nav className="mobile-nav cutaway-mobile-nav" aria-label="Mobile navigation">
              <button type="button" onClick={() => scrollTo("work")}>Work</button>
              <button type="button" onClick={() => scrollTo("ethos")}>Approach</button>
              <button type="button" onClick={() => scrollTo("story")}>Story</button>
              <button type="button" onClick={() => scrollTo("engage")}>Contact</button>
            </nav>
          ) : null}
          <div className="cutaway-world" aria-hidden="true">
            <img src="/fanworks-cutaway-panorama-v7.webp" alt="" />
            {rooms.map((room, index) => (
              <span
                className={`room-pin room-pin-${index + 1}${activeRoom === index ? " is-active" : ""}`}
                key={room.name}
              >
                <b>{room.number}</b>{room.name}
              </span>
            ))}
          </div>
          <div className="cutaway-vignette" aria-hidden="true" />
          <div className="cutaway-grade" aria-hidden="true" />
          <div className="cutaway-grain" aria-hidden="true" />
          <div className="cutaway-spotlight" aria-hidden="true" />
          <header className="cutaway-header">
            <span>Richmond, Virginia · Inside the operation</span>
            <span>{activeRoom < 0 ? "— —" : String(activeRoom + 1).padStart(2, "0")} / 04</span>
          </header>
          <div className="room-narrative" aria-live="polite">
            <article className={`intro-card ${activeRoom === -1 ? "is-active" : ""}`} aria-hidden={activeRoom !== -1}>
              <span>Business systems consulting</span>
              <h1>We fix disconnected systems.</h1>
              <p>
                Tools that do not talk. Manual work in between. Follow the line through
                the operation and watch the pieces connect.
              </p>
              <button className="hero-cta" type="button" onClick={() => scrollTo("engage")}>
                Start a conversation <ArrowRight aria-hidden="true" />
              </button>
            </article>
            {rooms.map((room, index) => (
              <article className={activeRoom === index ? "is-active" : ""} key={room.name} aria-hidden={activeRoom !== index}>
                <span>{room.number} · {room.name}</span>
                <h2>{room.title}</h2>
                <p>{room.body}</p>
                <em className="room-fixes">Fixes · {room.fixes}</em>
              </article>
            ))}
          </div>
          <div className="journey-progress cutaway-progress" aria-hidden="true"><i /></div>
          <p className="cutaway-hint">Scroll to move through the business</p>
        </div>
      </section>

      <section className="work-section" id="work" aria-labelledby="work-title">
        <div className="section-mark">
          <span>01</span>
          <span>What we do</span>
        </div>
        <h2 id="work-title">Where we help.</h2>
        <div className="work-intro">
          <p>For growing service businesses and founder-led manufacturers that have outgrown the way work gets done today.</p>
          <span>We make the day-to-day clearer, calmer, and easier to run.</span>
        </div>

        <div className="service-list">
          {services.map(({ number, name, line, icon: Icon }) => (
            <article className="service-row" key={name}>
              <span>{number}</span>
              <Icon aria-hidden="true" />
              <h3>{name}</h3>
              <p>{line}</p>
              <ArrowRight aria-hidden="true" />
            </article>
          ))}
        </div>
      </section>

      <section className="ethos-section" id="ethos" aria-labelledby="ethos-title">
        <div className="section-mark section-mark-light">
          <span>02</span>
          <span>How we work</span>
        </div>
        <h2 id="ethos-title">Start with the work.</h2>
        <div className="principle-list">
          {principles.map(([title, line], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{line}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="layer-section" id="layer" aria-labelledby="layer-title">
        <div className="section-mark section-mark-light">
          <span>03</span>
          <span>What runs underneath</span>
        </div>
        <h2 id="layer-title">The layer underneath.</h2>
        <p className="layer-lede">
          The systems we build run on our own private intelligence layer. It remembers how your
          business works, so the answer is already there when someone needs it.
        </p>
        <div className="layer-list">
          {layers.map(({ number, name, line }) => (
            <article key={name}>
              <span>{number}</span>
              <h3>{name}</h3>
              <p>{line}</p>
            </article>
          ))}
        </div>
        <ul className="layer-promises">
          {layerPromises.map((promise) => (
            <li key={promise}>{promise}</li>
          ))}
        </ul>
      </section>

      <section className="story-section" id="story" aria-labelledby="story-title">
        <div className="story-art">
          <img
            src="/fanworks-operator-proof-v2.webp"
            alt="Experienced operators reviewing performance and walking a connected service and manufacturing operation"
            decoding="async"
          />
        </div>
        <div className="story-copy">
          <div className="section-mark">
            <span>04</span>
            <span>Why FanWorks</span>
          </div>
          <h2 id="story-title">We have run the work.</h2>
          <p>We have built teams, run production, owned the numbers, and lived with the systems after launch. We know what it takes to make the work actually work.</p>
          <div className="proof-stats">
            <article><strong>20+</strong><span>Years improving operations</span></article>
            <article><Factory aria-hidden="true" /><span>Manufacturing expertise</span></article>
            <article><SearchCheck aria-hidden="true" /><span>We have run businesses—not just advised them</span></article>
          </div>
          <div className="kpi-band">
            <div><TrendingUp aria-hidden="true" /><span>What gets better</span></div>
            <ul>
              <li>Cycle time</li>
              <li>Throughput</li>
              <li>Gross margin</li>
              <li>On-time delivery</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="engage-section" id="engage" aria-labelledby="engage-title">
        <div className="engage-copy">
          <div className="section-mark section-mark-light">
            <span>05</span>
            <span>Contact</span>
          </div>
          <h2 id="engage-title">What is slowing you down?</h2>
          <a href="mailto:hello@fanworks.io">hello@fanworks.io</a>
        </div>

        <form className="contact-form" onSubmit={submitContact}>
          <div className="form-row">
            <label>
              <span>Name</span>
              <input name="name" autoComplete="name" required />
            </label>
            <label>
              <span>Email</span>
              <input name="email" type="email" autoComplete="email" required />
            </label>
          </div>
          <label>
            <span>What should we look at?</span>
            <textarea name="message" rows={4} required />
          </label>
          <div className="form-footer">
            <button type="submit">
              Send it <ArrowRight aria-hidden="true" />
            </button>
            <p role="status">{submitted ? "Your email app is ready." : "A few honest lines are enough."}</p>
          </div>
        </form>
      </section>

      <footer className="site-footer">
        <div className="brand-lockup footer-brand">
          <span className="wordmark">FANWORKS</span>
          <span className="brand-subtitle">Business systems consulting</span>
        </div>
        <span>Richmond, Virginia</span>
        <span>Est. 2025</span>
      </footer>
    </main>
  );
}

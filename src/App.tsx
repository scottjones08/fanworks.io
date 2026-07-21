import { CSSProperties, FormEvent, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Cable,
  Compass,
  Menu,
  SearchCheck,
  Workflow,
  X,
} from "lucide-react";

const services = [
  {
    number: "01",
    name: "Assess",
    line: "See the operation clearly.",
    icon: SearchCheck,
  },
  {
    number: "02",
    name: "Guide",
    line: "Turn questions into decisions.",
    icon: Compass,
  },
  {
    number: "03",
    name: "Integrate",
    line: "Make the tools work together.",
    icon: Cable,
  },
  {
    number: "04",
    name: "Automate",
    line: "Remove repetitive work.",
    icon: Workflow,
  },
];

const principles = [
  ["Map reality", "Follow the work as it runs today."],
  ["Choose the move", "Fix the constraint that matters."],
  ["Make it stick", "Leave clear ownership behind."],
];

const rooms = [
  {
    number: "01",
    name: "Listen",
    title: "Start where the work enters.",
    body: "Customer requests, team questions, and daily exceptions are the first signals. We learn how demand actually reaches the business.",
  },
  {
    number: "02",
    name: "Assess",
    title: "Make the operation visible.",
    body: "We map handoffs, decisions, costs, and constraints—then separate the real bottleneck from the background noise.",
  },
  {
    number: "03",
    name: "Integrate",
    title: "Connect the working system.",
    body: "The right tools, data, and responsibilities begin sharing one clear path instead of creating parallel versions of the truth.",
  },
  {
    number: "04",
    name: "Automate",
    title: "Give the team room to move.",
    body: "Repeatable work becomes dependable infrastructure. People keep the judgment; the system carries the repetition.",
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
      setActiveRoom(Math.min(3, Math.floor(progress * 4)));
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
            <img src="/fanworks-cutaway-panorama.webp" alt="" />
            {rooms.map((room, index) => (
              <span className={`room-pin room-pin-${index + 1}`} key={room.name}>
                <b>{room.number}</b>{room.name}
              </span>
            ))}
          </div>
          <div className="cutaway-vignette" aria-hidden="true" />
          <header className="cutaway-header">
            <span>Richmond, Virginia · Inside the operation</span>
            <span>{String(activeRoom + 1).padStart(2, "0")} / 04</span>
          </header>
          <div className="room-narrative" aria-live="polite">
            {rooms.map((room, index) => (
              <article className={activeRoom === index ? "is-active" : ""} key={room.name} aria-hidden={activeRoom !== index}>
                <span>{room.number} · {room.name}</span>
                <h2>{room.title}</h2>
                <p>{room.body}</p>
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

      <section className="story-section" id="story" aria-labelledby="story-title">
        <div className="story-art">
          <img
            src="/fan-works-hero.webp"
            alt="Operators reviewing financial, process, technology, and customer evidence around a working table"
            decoding="async"
          />
        </div>
        <div className="story-copy">
          <div className="section-mark">
            <span>03</span>
            <span>Why FanWorks</span>
          </div>
          <h2 id="story-title">From Richmond. Built for operators.</h2>
          <p>FanWorks brings business, process, and technology experience to the same table.</p>
          <blockquote>Clear work. Useful systems.</blockquote>
        </div>
      </section>

      <section className="engage-section" id="engage" aria-labelledby="engage-title">
        <div className="engage-copy">
          <div className="section-mark section-mark-light">
            <span>04</span>
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

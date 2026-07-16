import { FormEvent, useState } from "react";
import {
  ArrowDownRight,
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
    line: "Find the friction. Name the next move.",
    icon: SearchCheck,
  },
  {
    number: "02",
    name: "Guide",
    line: "Turn open questions into decisions.",
    icon: Compass,
  },
  {
    number: "03",
    name: "Connect",
    line: "Make the tools work together.",
    icon: Cable,
  },
  {
    number: "04",
    name: "Automate",
    line: "Remove repetition. Keep judgment.",
    icon: Workflow,
  },
];

const principles = [
  ["People first", "Start with the people doing the work."],
  ["Right-size the tools", "Build only what earns its place."],
  ["Leave proof", "Create a system the team can own."],
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
      <section className="hero" id="top" aria-labelledby="hero-title">
        <img
          className="hero-image"
          src="/fan-works-hero.webp"
          alt="A brick alley in The Fan neighborhood of Richmond, Virginia"
          fetchPriority="high"
          decoding="async"
        />
        <div className="hero-ink" aria-hidden="true" />

        <header className="site-header">
          <button className="brand-lockup" type="button" onClick={() => scrollTo("top")} aria-label="FanWorks home">
            <span className="wordmark">FANWORKS</span>
            <span className="brand-subtitle">Human-centered consulting</span>
          </button>

          <nav className="desktop-nav" aria-label="Primary navigation">
            <button type="button" onClick={() => scrollTo("work")}>Work</button>
            <button type="button" onClick={() => scrollTo("ethos")}>Ethos</button>
            <button type="button" onClick={() => scrollTo("story")}>Story</button>
            <button className="nav-cta" type="button" onClick={() => scrollTo("engage")}>Engage</button>
          </nav>

          <button
            type="button"
            className="menu-toggle"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </header>

        {menuOpen ? (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            <button type="button" onClick={() => scrollTo("work")}>Work</button>
            <button type="button" onClick={() => scrollTo("ethos")}>Ethos</button>
            <button type="button" onClick={() => scrollTo("story")}>Story</button>
            <button type="button" onClick={() => scrollTo("engage")}>Engage</button>
          </nav>
        ) : null}

        <div className="hero-copy">
          <p className="location">Richmond, Virginia / The Fan</p>
          <h1 id="hero-title">
            Clear the mess.
            <span>Keep the human.</span>
          </h1>
          <p>Business, technology, and automation shaped around people.</p>
          <button className="hero-cta" type="button" onClick={() => scrollTo("engage")}>
            Start here <ArrowDownRight aria-hidden="true" />
          </button>
        </div>

        <div className="hero-tags" aria-label="FanWorks services">
          <span>Assess</span>
          <span>Guide</span>
          <span>Connect</span>
          <span>Automate</span>
        </div>
      </section>

      <section className="work-section" id="work" aria-labelledby="work-title">
        <div className="section-mark">
          <span>01</span>
          <span>What we do</span>
        </div>
        <h2 id="work-title">Useful work.<br />No theater.</h2>

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
        <h2 id="ethos-title">Human judgment.<br />Useful systems.</h2>
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
            src="/fanworks-workflow-sketch.webp"
            alt="Hand-drawn people mapping work, connecting systems, and moving toward a Richmond neighborhood"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="story-copy">
          <div className="section-mark">
            <span>03</span>
            <span>Why FanWorks</span>
          </div>
          <h2 id="story-title">Built on the block.</h2>
          <p>The Fan taught us the value of craft, connection, and work that holds up.</p>
          <blockquote>Surface clarity. Keep people at the center.</blockquote>
        </div>
      </section>

      <section className="engage-section" id="engage" aria-labelledby="engage-title">
        <div className="engage-copy">
          <div className="section-mark section-mark-light">
            <span>04</span>
            <span>Engage</span>
          </div>
          <h2 id="engage-title">Bring us the stuck part.</h2>
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
            <span>What feels stuck?</span>
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
          <span className="brand-subtitle">Human-centered consulting</span>
        </div>
        <span>Richmond, Virginia</span>
        <span>Est. 2025</span>
      </footer>
    </main>
  );
}

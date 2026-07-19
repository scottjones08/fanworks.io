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
          alt="Four collaborators connecting business operations, finance, technology, and customer research"
          decoding="async"
        />
        <div className="hero-ink" aria-hidden="true" />

        <header className="site-header">
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
            <button type="button" onClick={() => scrollTo("ethos")}>Approach</button>
            <button type="button" onClick={() => scrollTo("story")}>Story</button>
            <button type="button" onClick={() => scrollTo("engage")}>Contact</button>
          </nav>
        ) : null}

        <div className="hero-copy">
          <p className="location">Richmond, Virginia</p>
          <h1 id="hero-title">
            Make the work
            <span>make sense.</span>
          </h1>
          <p>We assess operations, connect technology, and automate what slows the business down.</p>
          <button className="hero-cta" type="button" onClick={() => scrollTo("engage")}>
            Start a conversation <ArrowDownRight aria-hidden="true" />
          </button>
        </div>

        <div className="hero-tags" aria-label="FanWorks services">
          <span><b>01</b>Assess</span>
          <span><b>02</b>Decide</span>
          <span><b>03</b>Integrate</span>
          <span><b>04</b>Automate</span>
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
            src="/fanworks-workflow-sketch.webp"
            alt="Hand-drawn people mapping work, connecting systems, and moving toward a Richmond neighborhood"
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

import { CSSProperties, FormEvent, useEffect, useState } from "react";
import { ArrowDownRight, ArrowRight, Menu, X } from "lucide-react";

const services = [
  {
    number: "01",
    name: "Assess",
    line: "See the operation clearly — where time, money, and effort actually go.",
  },
  {
    number: "02",
    name: "Guide",
    line: "Turn open questions into decisions you can defend.",
  },
  {
    number: "03",
    name: "Integrate",
    line: "Make the tools you already pay for work as one system.",
  },
  {
    number: "04",
    name: "Automate",
    line: "Remove the repetitive work that slows the week down.",
  },
];

const principles = [
  ["Map reality", "Follow the work as it runs today, not as the org chart says it should."],
  ["Choose the move", "Fix the constraint that matters instead of everything at once."],
  ["Make it stick", "Leave clear ownership behind, so the system outlives the engagement."],
];

const delay = (ms: number): CSSProperties => ({ "--reveal-delay": `${ms}ms` } as CSSProperties);

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
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
      <header className="site-header">
        <button className="brand-lockup" type="button" onClick={() => scrollTo("top")} aria-label="FanWorks home">
          <span className="wordmark">FanWorks</span>
          <span className="brand-subtitle">Business systems consulting</span>
        </button>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <button type="button" onClick={() => scrollTo("work")}>Work</button>
          <button type="button" onClick={() => scrollTo("ethos")}>Approach</button>
          <button type="button" onClick={() => scrollTo("story")}>Story</button>
          <button className="nav-cta" type="button" onClick={() => scrollTo("engage")}>
            Start a conversation
          </button>
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
          <button type="button" onClick={() => scrollTo("engage")}>Start a conversation</button>
        </nav>
      ) : null}

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="kicker" data-reveal>Richmond, Virginia</p>
          <h1 id="hero-title" data-reveal style={delay(70)}>
            Make the work <em>make sense.</em>
          </h1>
          <p className="lede" data-reveal style={delay(140)}>
            We assess operations, connect the tools you already pay for, and automate
            what slows the business down.
          </p>
          <div data-reveal style={delay(210)}>
            <button className="btn" type="button" onClick={() => scrollTo("engage")}>
              Start a conversation <ArrowDownRight aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="hero-media">
          <img
            src="/fan-works-hero.webp"
            alt="Collaborators at a worktable connecting operations, finance, technology, and customer research"
            decoding="async"
          />
        </div>
      </section>

      <nav className="hero-index" aria-label="FanWorks services">
        {services.map(({ number, name }) => (
          <button key={name} type="button" onClick={() => scrollTo("work")}>
            <b>{number}</b>
            {name}
          </button>
        ))}
      </nav>

      <section className="work-section" id="work" aria-labelledby="work-title">
        <div className="section-mark" data-reveal>
          <span>01</span>
          <span>What we do</span>
        </div>

        <div className="work-body">
          <h2 id="work-title" data-reveal>Where we help.</h2>

          <div className="service-list">
            {services.map(({ number, name, line }, index) => (
              <article className="service-row" key={name} data-reveal style={delay(index * 60)}>
                <span>{number}</span>
                <h3>{name}</h3>
                <p>{line}</p>
                <ArrowRight aria-hidden="true" />
              </article>
            ))}
          </div>

          <div className="work-cta" data-reveal>
            <p>Not sure which one you need?</p>
            <button className="text-cta" type="button" onClick={() => scrollTo("engage")}>
              Start a conversation <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <section className="ethos-section" id="ethos" aria-labelledby="ethos-title">
        <div className="section-mark section-mark-light" data-reveal>
          <span>02</span>
          <span>How we work</span>
        </div>
        <h2 id="ethos-title" data-reveal>Start with the work.</h2>
        <div className="principle-list">
          {principles.map(([title, line], index) => (
            <article key={title} data-reveal style={delay(index * 80)}>
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
          <div className="section-mark" data-reveal>
            <span>03</span>
            <span>Why FanWorks</span>
          </div>
          <h2 id="story-title" data-reveal>From Richmond. Built for operators.</h2>
          <p data-reveal style={delay(70)}>
            FanWorks brings business, process, and technology experience to the same
            table — so the fix fits the way you actually run.
          </p>
          <blockquote data-reveal style={delay(140)}>Clear work. Useful systems.</blockquote>
          <button className="text-cta" type="button" onClick={() => scrollTo("engage")} data-reveal style={delay(210)}>
            Start a conversation <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </section>

      <section className="engage-section" id="engage" aria-labelledby="engage-title">
        <div className="engage-copy">
          <div className="section-mark section-mark-light" data-reveal>
            <span>04</span>
            <span>Contact</span>
          </div>
          <h2 id="engage-title" data-reveal>What is slowing you down?</h2>
          <p data-reveal style={delay(70)}>
            A few honest lines are enough. We read everything and reply ourselves.
          </p>
          <a href="mailto:hello@fanworks.io" data-reveal style={delay(140)}>hello@fanworks.io</a>
        </div>

        <form className="contact-form" onSubmit={submitContact} data-reveal>
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
            <button className="btn btn-paper" type="submit">
              Start the conversation <ArrowRight aria-hidden="true" />
            </button>
            <p role="status">{submitted ? "Your email app is ready." : ""}</p>
          </div>
        </form>
      </section>

      <footer className="site-footer">
        <div className="brand-lockup footer-brand">
          <span className="wordmark">FanWorks</span>
          <span className="brand-subtitle">Business systems consulting</span>
        </div>
        <a href="mailto:hello@fanworks.io">hello@fanworks.io</a>
        <span>Richmond, Virginia</span>
        <span>Est. 2025</span>
      </footer>
    </main>
  );
}

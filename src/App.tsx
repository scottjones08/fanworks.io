import { CSSProperties, FormEvent, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowDownRight, ArrowRight, Menu, X } from "lucide-react";
import Scene from "./Scene";

const milestones = [
  {
    number: "01",
    name: "Assess",
    line: "First, see clearly. We map where time, money, and effort actually go.",
    side: "left",
  },
  {
    number: "02",
    name: "Guide",
    line: "Then, decide. Open questions become moves you can defend.",
    side: "right",
  },
  {
    number: "03",
    name: "Integrate",
    line: "The tools line up. What you already pay for starts working as one system.",
    side: "left",
  },
  {
    number: "04",
    name: "Automate",
    line: "The path clears. Repetitive work falls away, and the week gets lighter.",
    side: "right",
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
  const journeyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  useEffect(() => {
    const track = journeyRef.current;
    const video = videoRef.current;
    if (!track) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let ready = false;
    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = track.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      const p = range > 0 ? Math.min(1, Math.max(0, -rect.top / range)) : 1;
      track.style.setProperty("--p", p.toFixed(4));
      if (ready && video && video.duration) {
        const target = p * Math.max(0, video.duration - 0.05);
        if (video.seeking) {
          // a seek is in flight; keep settling toward the latest target
          raf = requestAnimationFrame(update);
        } else if (Math.abs(target - video.currentTime) > 0.02) {
          video.currentTime = target;
          raf = requestAnimationFrame(update);
        }
      }
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    // the video is progressive enhancement: fade it in over the SVG scene
    // once it has a frame to show, and pin it to the arc's end state when
    // the user prefers reduced motion
    const markReady = () => {
      if (!video || video.readyState < 2) return;
      ready = true;
      video.classList.add("is-ready");
      if (reduced) {
        if (video.duration) video.currentTime = Math.max(0, video.duration - 0.05);
      } else {
        kick();
      }
    };
    video?.addEventListener("loadeddata", markReady);
    if (video && video.readyState >= 2) markReady();

    if (reduced) {
      track.style.setProperty("--p", "1");
      return () => video?.removeEventListener("loadeddata", markReady);
    }

    update();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick, { passive: true });
    return () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      if (raf) cancelAnimationFrame(raf);
      video?.removeEventListener("loadeddata", markReady);
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
    <main id="top">
      <header className="site-header">
        <button className="brand-lockup" type="button" onClick={() => scrollTo("top")} aria-label="FanWorks home">
          <span className="wordmark">FanWorks</span>
          <span className="brand-subtitle">Business systems consulting</span>
        </button>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <button type="button" onClick={() => scrollTo("journey")}>The walk</button>
          <button type="button" onClick={() => scrollTo("ethos")}>Approach</button>
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
          <button type="button" onClick={() => scrollTo("journey")}>The walk</button>
          <button type="button" onClick={() => scrollTo("ethos")}>Approach</button>
          <button type="button" onClick={() => scrollTo("engage")}>Start a conversation</button>
        </nav>
      ) : null}

      <div className="journey" id="journey" ref={journeyRef}>
        <Scene videoRef={videoRef} />

        <section className="stage stage-hero" aria-labelledby="hero-title">
          <div className="stage-hero-copy">
            <p className="kicker kicker-light" data-reveal>Richmond, Virginia</p>
            <h1 id="hero-title" data-reveal style={delay(70)}>
              Make the work <em>make sense.</em>
            </h1>
            <p className="lede" data-reveal style={delay(140)}>
              Every operation starts somewhere dark — tangled tools, unclear numbers,
              work that fights itself. The way out is a walk, not a leap.
            </p>
            <div data-reveal style={delay(210)}>
              <button className="btn" type="button" onClick={() => scrollTo("engage")}>
                Start a conversation <ArrowDownRight aria-hidden="true" />
              </button>
            </div>
            <p className="cue" data-reveal style={delay(280)}>
              Scroll to walk <ArrowDown aria-hidden="true" />
            </p>
          </div>
        </section>

        {milestones.map(({ number, name, line, side }) => (
          <section className={`stage stage-${side}`} key={name} aria-label={`${name} — step ${number} of the walk`}>
            <article className="milestone" data-reveal>
              <div className="milestone-mark">
                <span>{number}</span>
                <span>The walk</span>
              </div>
              <h3>{name}</h3>
              <p>{line}</p>
            </article>
          </section>
        ))}

        <section className="stage stage-final" aria-labelledby="final-title">
          <div className="final-copy">
            <p className="kicker" data-reveal>The opening</p>
            <h2 id="final-title" data-reveal style={delay(70)}>
              Opportunity looks like this.
            </h2>
            <p data-reveal style={delay(140)}>
              Clear work. Useful systems. Room to grow — from Richmond, built for operators.
            </p>
            <div data-reveal style={delay(210)}>
              <button className="btn" type="button" onClick={() => scrollTo("engage")}>
                Start a conversation <ArrowRight aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>
      </div>

      <section className="ethos-section" id="ethos" aria-labelledby="ethos-title">
        <div className="section-mark" data-reveal>
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

      <div className="sketch-band">
        <img
          src="/fanworks-workflow-sketch.webp"
          alt="Hand-drawn people mapping work, connecting systems, and moving toward a Richmond neighborhood"
          loading="lazy"
          decoding="async"
        />
      </div>

      <section className="engage-section" id="engage" aria-labelledby="engage-title">
        <div className="engage-copy">
          <div className="section-mark" data-reveal>
            <span>03</span>
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
            <button className="btn" type="submit">
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

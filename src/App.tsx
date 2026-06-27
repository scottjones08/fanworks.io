import { FormEvent, useEffect, useState } from "react";

type Panel = "expertise" | "engage" | null;

const storyItems = [
  {
    label: "01",
    title: "Observe the living system",
    body: "FanWorks starts inside the actual day: meetings, handoffs, client moments, unfinished thoughts, and the workarounds people quietly maintain.",
  },
  {
    label: "02",
    title: "Make the human pattern visible",
    body: "We turn scattered rituals into a clear map of where trust, memory, judgment, and attention carry the work.",
  },
  {
    label: "03",
    title: "Shape technology around it",
    body: "Voice, AI, and workflow products become useful when they follow the human path instead of forcing people to become operators.",
  },
];

export default function App() {
  const [activePanel, setActivePanel] = useState<Panel>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const dot = document.querySelector<HTMLElement>(".cursor-dot");
    const outline = document.querySelector<HTMLElement>(".cursor-outline");
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let frame = 0;

    const updatePosition = (clientX: number, clientY: number) => {
      mouseX = clientX;
      mouseY = clientY;
      if (dot) {
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
      }
    };

    const handlePointer = (event: PointerEvent) => {
      updatePosition(event.clientX, event.clientY);
    };

    const handleTouch = (event: TouchEvent) => {
      const [touch] = event.touches;
      if (touch) updatePosition(touch.clientX, touch.clientY);
    };

    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;
      if (outline) {
        outline.style.left = `${cursorX}px`;
        outline.style.top = `${cursorY}px`;
      }
      root.style.setProperty("--x", `${(cursorX / window.innerWidth) * 100}%`);
      root.style.setProperty("--y", `${(cursorY / window.innerHeight) * 100}%`);
      frame = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handlePointer);
    window.addEventListener("pointerdown", handlePointer);
    window.addEventListener("pointermove", handlePointer);
    window.addEventListener("touchstart", handleTouch, { passive: true });
    window.addEventListener("touchmove", handleTouch, { passive: true });
    animate();

    return () => {
      window.removeEventListener("mousemove", handlePointer);
      window.removeEventListener("pointerdown", handlePointer);
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("touchstart", handleTouch);
      window.removeEventListener("touchmove", handleTouch);
      cancelAnimationFrame(frame);
    };
  }, []);

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const openPanel = (panel: Panel) => {
    setSubmitted(false);
    setActivePanel((current) => (current === panel ? null : panel));
  };

  return (
    <main className={activePanel ? "stage has-panel" : "stage"}>
      <div className="layer-sharp" aria-hidden="true" />
      <div className="layer-blur" aria-hidden="true" />
      <div className="noise-overlay" aria-hidden="true" />

      <section className="ui-layer" aria-labelledby="hero-title">
        <header className="header-top">
          <button type="button" className="nav-text brand" onClick={() => setActivePanel(null)}>
            FanWorks
          </button>
          <nav className="nav-stack" aria-label="Primary navigation">
            <button type="button" className="nav-text" onClick={() => openPanel("expertise")}>
              Expertise
            </button>
            <button type="button" className="nav-text" onClick={() => openPanel("engage")}>
              Engage
            </button>
          </nav>
        </header>

        <div className="hero-text">
          <h1 id="hero-title" className="prompt-main">
            Be More Human
          </h1>
          <p className="prompt-sub">human centered consulting</p>
        </div>

        <div className="coords">EST. 2025</div>

        <div className="interaction-anchor">
          <button
            type="button"
            className="orb-btn"
            aria-label="Open the FanWorks story"
            onClick={() => openPanel("expertise")}
          />
          <span className="label-enter">Initiate</span>
        </div>
      </section>

      <aside className={activePanel ? "story-panel is-open" : "story-panel"} aria-hidden={!activePanel}>
        <button type="button" className="panel-close" onClick={() => setActivePanel(null)}>
          Close
        </button>

        {activePanel === "expertise" ? (
          <div className="panel-content">
            <p className="panel-label">What we do</p>
            <h2>We design technology around the parts of work that still need people.</h2>
            <p className="panel-lede">
              The alley is the metaphor: old brick, living green, hand-laid stone, and a path that has learned from
              everyone who crossed it. FanWorks helps teams build AI and workflow systems with that same respect for
              texture, memory, and use.
            </p>
            <div className="story-list">
              {storyItems.map((item) => (
                <article key={item.title}>
                  <span>{item.label}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {activePanel === "engage" ? (
          <div className="panel-content">
            <p className="panel-label">Engage</p>
            <h2>Tell us where the work feels least human.</h2>
            <p className="panel-lede">
              Bring a workflow, a product idea, a voice interface, or a team ritual that needs to be understood before
              it gets automated.
            </p>
            <form className="contact-form" onSubmit={submitContact}>
              <label>
                Name
                <input name="name" autoComplete="name" required />
              </label>
              <label>
                Email
                <input name="email" type="email" autoComplete="email" required />
              </label>
              <label>
                What should we understand?
                <textarea name="story" rows={5} required />
              </label>
              <button type="submit">Send the signal</button>
              <p className="form-status" role="status">
                {submitted ? "Thank you. The signal is captured for this prototype." : "Prefer email? hello@fan.works"}
              </p>
            </form>
          </div>
        ) : null}
      </aside>

      <div className="cursor-dot" aria-hidden="true" />
      <div className="cursor-outline" aria-hidden="true" />
    </main>
  );
}

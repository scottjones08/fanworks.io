import { FormEvent, KeyboardEvent, PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react";

type Panel = "expertise" | "engage" | null;

const claritySignals = ["Human", "Authentic", "Voice", "Workflow", "Automation", "Trust"];

const guideSections = [
  {
    label: "Human",
    title: "Human centered consulting",
    body: "The work begins with people: how they decide, relate, remember, and carry trust through the day.",
  },
  {
    label: "Observe",
    title: "Observe the living system",
    body: "We study the real path of meetings, handoffs, voice, judgment, and attention before prescribing a tool.",
  },
  {
    label: "Clarify",
    title: "Surface clarity in complexity",
    body: "We turn tangled workflows into a clear map of what should stay human and what can be supported by systems.",
  },
  {
    label: "Shape",
    title: "Shape automation around people",
    body: "Automation becomes useful when it protects authenticity and follows the human path instead of replacing it.",
  },
];

const storyItems = [
  {
    label: "01",
    title: "Observe the living system",
    body: "FanWorks starts inside the actual day: meetings, handoffs, client moments, unfinished thoughts, and the workarounds people quietly maintain.",
  },
  {
    label: "02",
    title: "Surface clarity in complexity",
    body: "Our core ethos is surfacing clarity in complex environments, turning scattered work into a map of where trust, memory, judgment, and attention carry the human path.",
  },
  {
    label: "03",
    title: "Shape automation around it",
    body: "Voice, automation, and workflow products become useful when they follow the human path instead of forcing people to become operators.",
  },
];

export default function App() {
  const [activePanel, setActivePanel] = useState<Panel>(null);
  const [submitted, setSubmitted] = useState(false);
  const [portalPressed, setPortalPressed] = useState(false);
  const [portalPrimed, setPortalPrimed] = useState(false);
  const [guideIndex, setGuideIndex] = useState(0);
  const portalRef = useRef<HTMLButtonElement>(null);
  const portalActive = useRef(false);
  const portalStart = useRef({ x: 0, y: 0, progress: 0, primed: false });

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

    const handleMouse = (event: MouseEvent) => {
      updatePosition(event.clientX, event.clientY);
    };

    const handlePointer = (event: globalThis.PointerEvent) => {
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

    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("pointerdown", handlePointer);
    window.addEventListener("pointermove", handlePointer);
    window.addEventListener("touchstart", handleTouch, { passive: true });
    window.addEventListener("touchmove", handleTouch, { passive: true });
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouse);
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

  const resetPortal = () => {
    const portal = portalRef.current;
    if (!portal) return;
    portal.style.setProperty("--drag-x", "0px");
    portal.style.setProperty("--drag-y", "0px");
    portal.style.setProperty("--portal-scale", "1");
    portal.style.setProperty("--path-progress", "0");
    portalActive.current = false;
    portalStart.current.progress = 0;
    portalStart.current.primed = false;
    setPortalPressed(false);
    setPortalPrimed(false);
    setGuideIndex(0);
  };

  const updatePortal = (clientX: number, clientY: number) => {
    const portal = portalRef.current;
    if (!portal) return;

    const isCompact = window.matchMedia("(max-width: 760px)").matches;
    const maxLift = isCompact ? 250 : 285;
    const dx = Math.max(-42, Math.min(42, clientX - portalStart.current.x));
    const dy = Math.max(-maxLift, Math.min(28, clientY - portalStart.current.y));
    const distance = Math.hypot(dx, dy);
    const progress = Math.max(0, Math.min(1, -dy / maxLift));
    const scale = 1 + Math.min(distance / 520, 0.24);
    const primed = progress > 0.88;
    const nextGuideIndex = Math.min(guideSections.length - 1, Math.floor(progress * guideSections.length));

    portal.style.setProperty("--drag-x", `${dx}px`);
    portal.style.setProperty("--drag-y", `${dy}px`);
    portal.style.setProperty("--portal-scale", scale.toFixed(3));
    portal.style.setProperty("--path-progress", progress.toFixed(3));
    document.documentElement.style.setProperty("--x", `${(clientX / window.innerWidth) * 100}%`);
    document.documentElement.style.setProperty("--y", `${(clientY / window.innerHeight) * 100}%`);
    portalStart.current.progress = progress;

    if (portalStart.current.primed !== primed) {
      portalStart.current.primed = primed;
      setPortalPrimed(primed);
    }
    setGuideIndex((current) => (current === nextGuideIndex ? current : nextGuideIndex));
  };

  const pressPortal = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    portalActive.current = true;
    portalStart.current = { x: event.clientX, y: event.clientY, progress: 0, primed: false };
    setPortalPressed(true);
    updatePortal(event.clientX, event.clientY);
  };

  const movePortal = (event: ReactPointerEvent<HTMLElement>) => {
    if (!portalActive.current) return;
    updatePortal(event.clientX, event.clientY);
  };

  const releasePortal = (event: ReactPointerEvent<HTMLElement>) => {
    if (!portalActive.current) return;
    const portal = portalRef.current;
    if (portal?.hasPointerCapture(event.pointerId)) {
      portal.releasePointerCapture(event.pointerId);
    }
    const distance = Math.hypot(event.clientX - portalStart.current.x, event.clientY - portalStart.current.y);
    const shouldOpen = portalStart.current.progress > 0.88 || distance < 8;
    resetPortal();
    if (shouldOpen) {
      setSubmitted(false);
      setActivePanel("expertise");
    }
  };

  const activatePortalFromKeyboard = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    setSubmitted(false);
    setActivePanel("expertise");
  };

  const stageClass = ["stage", activePanel ? "has-panel" : "", portalPressed ? "is-portal-pressing" : "", portalPrimed ? "is-portal-primed" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <main className={stageClass} onPointerMove={movePortal} onPointerUp={releasePortal}>
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
            ref={portalRef}
            className="clarity-portal"
            aria-label="Drag to surface clarity and open the FanWorks story"
            onKeyDown={activatePortalFromKeyboard}
            onPointerCancel={resetPortal}
            onPointerDown={pressPortal}
            onPointerLeave={movePortal}
            onPointerMove={movePortal}
            onPointerUp={releasePortal}
          >
            <span className="guide-rail" aria-hidden="true">
              {guideSections.map((section, index) => (
                <span
                  key={section.label}
                  className={index <= guideIndex ? "guide-node is-active" : "guide-node"}
                >
                  {section.label}
                </span>
              ))}
            </span>
            <span className="portal-core" aria-hidden="true" />
            <span className="portal-copy">
              <span className="portal-state portal-state-idle">Drag upward</span>
              <span className="portal-state portal-state-primed">Release the path</span>
            </span>
            <span className="guide-card" aria-live="polite">
              <span>{guideSections[guideIndex].label}</span>
              <strong>{guideSections[guideIndex].title}</strong>
              <em>{guideSections[guideIndex].body}</em>
            </span>
            <span className="signal-cloud" aria-hidden="true">
              {claritySignals.map((signal) => (
                <span key={signal}>{signal}</span>
              ))}
            </span>
          </button>
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
              everyone who crossed it. FanWorks surfaces clarity in complex environments so teams can build automation
              and workflow systems with respect for human texture, memory, authenticity, and use.
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
              Bring a workflow, a product idea, a voice interface, or a team practice that needs to be understood before
              automation is shaped around it.
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

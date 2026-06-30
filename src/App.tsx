import { FormEvent, KeyboardEvent, PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react";

type GuideId = "human" | "authentic" | "workflow" | "automation";
type Panel = GuideId | "engage" | null;

const guideOptions: Array<{
  id: GuideId;
  label: string;
  title: string;
  body: string;
  points: string[];
}> = [
  {
    id: "human",
    label: "Human",
    title: "Human centered consulting",
    body: "We start with the people inside the work: how they decide, remember, relate, and carry trust through complexity.",
    points: ["Decision paths", "Team judgment", "Human texture"],
  },
  {
    id: "authentic",
    label: "Authentic",
    title: "Authentic systems",
    body: "We protect what makes the work believable, specific, and useful before a process becomes software.",
    points: ["Voice and tone", "Real context", "Trust-preserving design"],
  },
  {
    id: "workflow",
    label: "Workflow",
    title: "Workflow clarity",
    body: "We map where work actually moves, where it stalls, and where teams need cleaner handoffs or better memory.",
    points: ["Handoffs", "Operating rhythm", "Clarity maps"],
  },
  {
    id: "automation",
    label: "Automation",
    title: "Automation around people",
    body: "We shape automation to support human judgment instead of flattening the work into generic operations.",
    points: ["Useful automation", "Human oversight", "Adoption-ready systems"],
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
    const nextGuideIndex = Math.min(guideOptions.length - 1, Math.floor(progress * guideOptions.length));

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
    const selectedGuide = guideOptions[guideIndex].id;
    const shouldOpen = portalStart.current.progress > 0.08 || distance < 8;
    resetPortal();
    if (shouldOpen) {
      setSubmitted(false);
      setActivePanel(selectedGuide);
    }
  };

  const activatePortalFromKeyboard = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    setSubmitted(false);
    setActivePanel("human");
  };

  const activeGuidePanel = activePanel && activePanel !== "engage"
    ? guideOptions.find((option) => option.id === activePanel)
    : null;

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
            <button type="button" className="nav-text" onClick={() => openPanel("human")}>
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
              {guideOptions.map((option, index) => (
                <span
                  key={option.id}
                  className={index <= guideIndex ? "guide-node is-active" : "guide-node"}
                >
                  {option.label}
                </span>
              ))}
            </span>
            <span className="portal-core" aria-hidden="true" />
            <span className="portal-copy">
              <span className="portal-state portal-state-idle">Drag upward</span>
              <span className="portal-state portal-state-primed">Release the path</span>
            </span>
            <span className="guide-card" aria-live="polite">
              <span>{guideOptions[guideIndex].label}</span>
              <strong>{guideOptions[guideIndex].title}</strong>
              <em>{guideOptions[guideIndex].body}</em>
            </span>
          </button>
          <span className="label-enter">Initiate</span>
        </div>
      </section>

      <aside className={activePanel ? "story-panel is-open" : "story-panel"} aria-hidden={!activePanel}>
        <button type="button" className="panel-close" onClick={() => setActivePanel(null)}>
          Close
        </button>

        {activeGuidePanel ? (
          <div className="panel-content">
            <p className="panel-label">{activeGuidePanel.label}</p>
            <h2>{activeGuidePanel.title}</h2>
            <p className="panel-lede">{activeGuidePanel.body}</p>
            <div className="popup-points">
              {activeGuidePanel.points.map((point) => (
                <span key={point}>{point}</span>
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

import { useEffect, useRef, useState } from "react";
import { frictionWords, lineStages, scrollToId, tickerCopy } from "../content";
import { useReducedMotion } from "../hooks/useReducedMotion";

const HERO_VIDEO =
  "https://videos.pexels.com/video-files/2386581/2386581-uhd_2732_1440_24fps.mp4";

export function Hero() {
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [clock, setClock] = useState("RVA · --:--");
  const [wordIndex, setWordIndex] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);
  const [stageIndex, setStageIndex] = useState(0);
  const [showCue, setShowCue] = useState(true);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(
        `RVA · ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
      );
    };
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = 0.65;
    video.muted = true;
    if (reduced) {
      video.pause();
      return;
    }
    video.play().catch(() => undefined);

    const onScroll = () => {
      const progress = Math.min(1, window.scrollY / window.innerHeight);
      video.style.transform = `translateY(${progress * window.innerHeight * 0.18}px) scale(1.06)`;
      setShowCue(window.innerHeight >= 620 && window.scrollY <= 60);
      if (progress >= 1 && !video.paused) video.pause();
      else if (progress < 1 && video.paused && !reduced) video.play().catch(() => undefined);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setWordVisible(false);
      window.setTimeout(() => {
        setWordIndex((index) => (index + 1) % frictionWords.length);
        setWordVisible(true);
      }, 420);
    }, 2600);
    return () => window.clearInterval(id);
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setStageIndex((index) => (index + 1) % lineStages.length);
    }, 1700);
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <section className="hero" id="top">
      <div className="hero-media" aria-hidden="true">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/fan-works-hero.webp"
          src={HERO_VIDEO}
        />
        <div className="hero-shade" />
        <div className="hero-grain" />
      </div>

      <div className="hero-meta">
        <span>Richmond, Virginia</span>
        <span>{clock}</span>
        <span>Est. 2025</span>
      </div>

      <div className="hero-copy">
        <p className="hero-kicker">
          <i />
          Business systems consulting for established operators
        </p>
        <div className="hero-lines">
          <div className="hero-mask">
            <h1>Make the</h1>
          </div>
          <div className="hero-mask">
            <h1>
              work{" "}
              <span className="hero-flow">
                flow.
                <svg viewBox="0 0 340 44" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M6 20 C 70 6, 150 30, 218 16 C 262 7, 306 10, 334 15" />
                  <path d="M26 36 C 110 26, 210 40, 316 28" className="hero-flow-soft" />
                </svg>
              </span>
            </h1>
          </div>
        </div>

        <aside className="hero-aside" aria-hidden="true">
          <span>The line · end to end</span>
          <ol className="hero-spine">
            {lineStages.map((stage, index) => (
              <li key={stage} className={reduced || index === stageIndex ? "is-on" : ""}>
                {stage}
              </li>
            ))}
          </ol>
        </aside>

        <div className="hero-footer">
          <p>
            Your tools don't talk. People carry the work between them by hand. We sit with the teams
            who run the day and rebuild the systems underneath it — so the work moves on its own.
          </p>
          <div className="hero-actions">
            <button className="cta cta-ochre" type="button" onClick={() => scrollToId("engage")}>
              Start a conversation →
            </button>
            <span className="hero-rotate">
              Currently fixing →{" "}
              <b className={wordVisible ? "is-in" : ""}>{frictionWords[wordIndex]}</b>{" "}
              <em>0{wordIndex + 1}/05</em>
            </span>
          </div>
        </div>
      </div>

      <p className={`scroll-cue${showCue ? "" : " is-hidden"}`} aria-hidden="true">
        Scroll
        <i />
      </p>

      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          <span>{tickerCopy}</span>
          <span>{tickerCopy}</span>
        </div>
      </div>
    </section>
  );
}

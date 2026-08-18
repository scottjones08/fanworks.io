import { useEffect, useRef, useState } from "react";
import { dayCards } from "../content";
import { useReducedMotion } from "../hooks/useReducedMotion";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

const LINE_SRC = "/one-line-through.webp";

/** Room center X as a fraction of the stitched panorama width. */
const ROOM_CENTERS = [0.0923, 0.2514, 0.4201, 0.5934, 0.7518, 0.9075];

export function Ledger() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);
  const [overview, setOverview] = useState(true);
  const [narrow, setNarrow] = useState(false);

  const stacked = reduced;
  const card = dayCards[active];

  useEffect(() => {
    const media = window.matchMedia("(max-width: 899px)");
    const sync = () => setNarrow(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const camera = cameraRef.current;
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!section || !camera || !wrap || !img) return;

    const update = () => {
      if (stacked) {
        camera.style.transform = "";
        setProgress(1);
        setActive(dayCards.length - 1);
        setOverview(false);
        return;
      }

      const distance = Math.max(1, section.offsetHeight - window.innerHeight);
      const raw = clamp((window.scrollY - section.offsetTop) / distance, 0, 1);
      const walk = Math.max(0, (raw - 0.08) / 0.92);
      const eased = easeInOut(walk);
      const seeingAll = raw < 0.08;
      const last = dayCards.length - 1;
      const span = eased * last;
      const index = Math.min(last, Math.floor(span + 0.001));
      const next = Math.min(last, index + 1);
      const local = span - index;

      const wrapW = Math.max(1, wrap.clientWidth);
      const wrapH = Math.max(1, wrap.clientHeight);
      const naturalW = img.naturalWidth || 5259;
      const naturalH = img.naturalHeight || 966;
      const drawnW = naturalW * (wrapH / naturalH);
      const maxX = Math.max(0, drawnW - wrapW);
      const stops = ROOM_CENTERS.map((center) => clamp(center * drawnW - wrapW / 2, 0, maxX));
      const x = seeingAll ? 0 : lerp(stops[index], stops[next], local);

      camera.style.transform = `translate3d(${-x}px, 0, 0)`;
      setProgress(raw);
      setActive(seeingAll ? 0 : index);
      setOverview(seeingAll);
    };

    const onLoad = () => update();
    if (img.complete) update();
    img.addEventListener("load", onLoad);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      img.removeEventListener("load", onLoad);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [stacked]);

  return (
    <section
      className={`ledger${stacked ? " is-static" : ""}${narrow ? " is-narrow" : ""}${overview && !stacked ? " is-overview" : ""}`}
      id="ledger"
      ref={sectionRef}
      aria-labelledby="ledger-title"
    >
      <div className="ledger-stage">
        <div className="ledger-top">
          <div>
            <div className="section-kicker kicker-dark">
              <i />
              01 · A day on the floor
            </div>
            <h2 id="ledger-title">One line through the business.</h2>
          </div>
          <span>Six handoffs · one operating picture</span>
        </div>

        <div className="ledger-main">
          <article
            className={`ledger-story${overview ? " is-overview" : ""}${"finale" in card && card.finale && !overview ? " is-finale" : ""}`}
            key={overview ? "overview" : card.zone}
            aria-live="polite"
          >
            {overview ? (
              <>
                <div className="ledger-story-meta">
                  <span>The line of work</span>
                  <span>Six stations</span>
                </div>
                <p>Six rooms on one line. A job should move through the business in one direction — not bounce between inboxes.</p>
                <p className="ledger-after">Scroll to walk it.</p>
              </>
            ) : (
              <>
                <div className="ledger-story-meta">
                  <span>{card.stamp}</span>
                  <span>{card.room}</span>
                  <span>{card.index}</span>
                </div>
                <p>{card.before}</p>
                <div className="ledger-rule" aria-hidden="true">
                  <b />
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 12h14M13 6l6 6-6 6" />
                  </svg>
                </div>
                <p className="ledger-after">{card.after}</p>
              </>
            )}
          </article>

          <div className="ledger-plan-wrap" ref={wrapRef}>
            <div className="ledger-plan-camera" ref={cameraRef}>
              <img
                ref={imgRef}
                className="ledger-line-img"
                src={LINE_SRC}
                width={5259}
                height={966}
                alt="Six isometric rooms on one line: front office, order desk, planning, shop floor, warehouse, and close-out."
              />
            </div>
            {narrow && !stacked ? (
              <ol className="ledger-minimap" aria-hidden="true">
                {dayCards.map((item, index) => (
                  <li
                    key={item.zone}
                    className={
                      !overview && index === active ? "is-live" : !overview && index < active ? "is-visited" : ""
                    }
                  />
                ))}
              </ol>
            ) : null}
          </div>
        </div>

        <div className="ledger-rail" aria-hidden="true">
          <ol className="ledger-stops">
            {dayCards.map((item, index) => (
              <li
                key={item.time}
                className={
                  overview
                    ? ""
                    : index === active
                      ? "is-on is-live"
                      : index < active
                        ? "is-on"
                        : ""
                }
              >
                <b>{item.time}</b>
                <span>{item.room}</span>
              </li>
            ))}
          </ol>
          <div className="ledger-meter">
            <i style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
      </div>

      {stacked ? (
        <ol className="ledger-static-list">
          {dayCards.map((item) => (
            <li key={item.stamp}>
              <span>
                {item.stamp} · {item.room}
              </span>
              <p>{item.before}</p>
              <strong>{item.after}</strong>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}
